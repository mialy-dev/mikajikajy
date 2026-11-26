
import express from "express";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { z } from "zod";

import * as svc from "../services/authService.js";
import { protect } from "../middleware/auth.js";
import { sendResetEmail } from "../services/mailService.js";
import pool from "../config/db.js";

// ==========================================
// INITIALISATION DU ROUTER
// ==========================================

const router = express.Router();

// ==========================================
// CONFIGURATION
// ==========================================

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

// IMPORTANT : vérifier le vrai nom de la colonne
// du mot de passe dans la table users.
const PASSWORD_COLUMN = "password_hash";

// Génération du hash du jeton
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// Réponse générique pour éviter de révéler
// si une adresse e-mail possède un compte.
const GENERIC_RESPONSE = {
  message:
    "Si un compte existe pour cette adresse, un e-mail de réinitialisation a été envoyé.",
};

// ==========================================
// LIMITATION DES TENTATIVES
// ==========================================

const createLimiter = (max, windowMin) =>
  rateLimit({
    windowMs: windowMin * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message:
        "Trop de tentatives. Réessayez dans quelques minutes.",
    },
  });

const registerLimiter = createLimiter(10, 60);
const loginLimiter = createLimiter(10, 15);
const forgotLimiter = createLimiter(5, 15);
const resetLimiter = createLimiter(10, 15);

// ==========================================
// CONFIGURATION DES COOKIES
// ==========================================

const cookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  ameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",

  ...(rememberMe
    ? {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      }
    : {}),
});

// ==========================================
// INSCRIPTION
// ==========================================

router.post(
  "/register",
  registerLimiter,
  async (req, res, next) => {
    try {
      const user = await svc.register(req.body || {});

      return res.status(201).json({
        message:
          "Compte créé avec succès. Vous pouvez maintenant vous connecter.",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// CONNEXION
// ==========================================

router.post(
  "/login",
  loginLimiter,
  async (req, res, next) => {
    try {
      const { user, token } = await svc.login(
        req.body || {}
      );

      res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: "/",
        });

      // res.cookie(
      //   "token",
      //   token,
      //   cookieOptions(Boolean(req.body?.rememberMe))
      // );

      return res.status(200).json({
        message: "Connexion réussie.",
        user,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ==========================================
// MOT DE PASSE OUBLIÉ
// ==========================================

router.post(
  "/forgot-password",
  forgotLimiter,
  async (req, res) => {
    const validation = z
      .object({
        email: z.string().email(),
      })
      .safeParse(req.body || {});

    if (!validation.success) {
      return res.status(400).json({
        error: "Veuillez saisir une adresse e-mail valide.",
      });
    }

    try {
      const email = validation.data.email.trim();

      const result = await pool.query(
        `SELECT id, email
         FROM utilisateurs
         WHERE LOWER(email) = LOWER($1)
         LIMIT 1`,
        [email]
      );

      const account = result.rows[0];

      if (account) {
        // Génération d'un jeton aléatoire sécurisé
        const token = crypto.randomBytes(32).toString("hex");

        // Invalidation des anciens jetons non utilisés
        await pool.query(
          `UPDATE password_reset_tokens
           SET used_at = NOW()
           WHERE user_id = $1
           AND used_at IS NULL`,
          [account.id]
        );

        // Enregistrement du hash du jeton
        await pool.query(
          `INSERT INTO password_reset_tokens
            (user_id, token_hash, expires_at)
           VALUES ($1, $2, NOW() + INTERVAL '30 minutes')`,
          [account.id, hashToken(token)]
        );

        // Envoi du lien de réinitialisation
        const resetLink =
          `${FRONTEND_URL}/reset-password/${token}`;

        await sendResetEmail(
          account.email,
          resetLink
        );
      }
    } catch (error) {
      console.error(
        "[AUTH] Erreur mot de passe oublié :",
        error.message
      );
    }

    return res.status(200).json(GENERIC_RESPONSE);
  }
);

// ==========================================
// RÉINITIALISATION DU MOT DE PASSE
// ==========================================

router.post(
  "/reset-password",
  resetLimiter,
  async (req, res) => {
    const validation = z
      .object({
        token: z.string().length(64),
        password: z.string().min(8).max(128),
      })
      .safeParse(req.body || {});

    if (!validation.success) {
      return res.status(400).json({
        error:
          "Lien invalide ou mot de passe incorrect. Le mot de passe doit contenir au moins 8 caractères.",
      });
    }

    let client;

    try {
      client = await pool.connect();

      await client.query("BEGIN");

      // Vérifier le jeton et son expiration
      const result = await client.query(
        `SELECT id, user_id
         FROM password_reset_tokens
         WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
         FOR UPDATE`,
        [hashToken(validation.data.token)]
      );

      const resetToken = result.rows[0];

      if (!resetToken) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          error: "Lien invalide ou expiré.",
        });
      }

      // Hasher le nouveau mot de passe
      const passwordHash = await bcrypt.hash(
        validation.data.password,
        12
      );

      // Modifier le mot de passe de l'utilisateur
      await client.query(
        `UPDATE users
         SET ${PASSWORD_COLUMN} = $1
         WHERE id = $2`,
        [passwordHash, resetToken.user_id]
      );

      // Marquer le jeton comme utilisé
      await client.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE id = $1`,
        [resetToken.id]
      );

      await client.query("COMMIT");

      return res.status(200).json({
        message:
          "Mot de passe modifié avec succès. Vous pouvez maintenant vous connecter.",
      });
    } catch (error) {
      if (client) {
        await client.query("ROLLBACK").catch(() => {});
      }

      console.error(
        "[AUTH] Erreur réinitialisation :",
        error.message
      );

      return res.status(500).json({
        error: "Une erreur serveur est survenue.",
      });
    } finally {
      if (client) {
        client.release();
      }
    }
  }
);

// ==========================================
// UTILISATEUR CONNECTÉ
// ==========================================

router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

// ==========================================
// DÉCONNEXION
// ==========================================

router.post("/logout", (req, res) => {
  const options = cookieOptions(false);

  return res
    .clearCookie("token", options)
    .status(200)
    .json({
      message: "Déconnexion réussie.",
    });
});

// ==========================================
// EXPORT
// ==========================================

export default router;
