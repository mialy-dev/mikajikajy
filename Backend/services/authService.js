import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { sendMail, resetEmailHtml } from "./mailer.js";

// ====== À AJUSTER selon votre schéma réel ======
const T = "utilisateurs";
const COL = { id: "id", nom: "nom", email: "email", tel: "telephone", hash: "password_hash", role: "role", actif: "actif" };
const DEFAULT_ROLE = "lecteur";
// ================================================

const PASSWORD_RE = {
  length: (p) => p.length >= 8,
  lower: (p) => /[a-z]/.test(p),
  upper: (p) => /[A-Z]/.test(p),
  digit: (p) => /\d/.test(p),
  special: (p) => /[^A-Za-z0-9]/.test(p),
};
const isStrongPassword = (p) => typeof p === "string" && Object.values(PASSWORD_RE).every((f) => f(p));
const isEmail = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const isPhone = (v) => typeof v === "string" && /^\+?\d{9,15}$/.test(v.replace(/[\s.\-()]/g, ""));
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");

class HttpError extends Error {
  constructor(status, message, errors) { super(message); this.status = status; this.errors = errors; }
}

const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", 12);

function publicUser(u) {
  return { id: u[COL.id], nom: u[COL.nom], email: u[COL.email], role: u[COL.role] };
}

function signToken(user, rememberMe) {
  return jwt.sign({ id: user[COL.id], role: user[COL.role] }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : "12h",
  });
}

async function register({ nom, email, telephone, password, acceptTerms }) {
  const errors = {};
  if (!nom || nom.trim().length < 2) errors.nom = "Le nom complet est obligatoire.";
  if (!isEmail(email)) errors.email = "Adresse e-mail invalide.";
  if (!isPhone(telephone)) errors.telephone = "Numéro de téléphone invalide.";
  if (!isStrongPassword(password))
    errors.password = "8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.";
  if (acceptTerms !== true) errors.acceptTerms = "Vous devez accepter les conditions.";
  if (Object.keys(errors).length) throw new HttpError(400, "Veuillez corriger les champs en erreur.", errors);

  const mail = email.trim().toLowerCase();
  const exists = await pool.query(`SELECT 1 FROM ${T} WHERE LOWER(${COL.email}) = $1`, [mail]);
  if (exists.rowCount) throw new HttpError(409, "Cette adresse e-mail est déjà utilisée.", { email: "Adresse déjà utilisée." });

  const hash = await bcrypt.hash(password, 12);
  // Le rôle est TOUJOURS le moins privilégié ; jamais lu depuis la requête.
  const { rows } = await pool.query(
    `INSERT INTO ${T} (${COL.nom}, ${COL.email}, ${COL.tel}, ${COL.hash}, ${COL.role}, ${COL.actif})
     VALUES ($1,$2,$3,$4,$5,true) RETURNING *`,
    [nom.trim(), mail, telephone.trim(), hash, DEFAULT_ROLE]
  );
  return publicUser(rows[0]);
}

async function login({ email, password, rememberMe }) {
  const bad = new HttpError(401, "E-mail ou mot de passe incorrect.");
  if (!isEmail(email) || typeof password !== "string") throw bad;

  const { rows } = await pool.query(`SELECT * FROM ${T} WHERE LOWER(${COL.email}) = $1`, [email.trim().toLowerCase()]);
  const user = rows[0];
  const ok = await bcrypt.compare(password, user ? user[COL.hash] : DUMMY_HASH); // temps constant
  if (!user || !ok) throw bad;
  if (user[COL.actif] === false) throw new HttpError(403, "Ce compte est désactivé. Contactez l'administrateur.");

  return { user: publicUser(user), token: signToken(user, !!rememberMe) };
}

async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM ${T} WHERE ${COL.id} = $1`, [id]);
  return rows[0] || null;
}

async function forgotPassword(email) {
  if (!isEmail(email)) return; // réponse générique quoi qu'il arrive
  const { rows } = await pool.query(
    `SELECT ${COL.id} AS id, ${COL.email} AS email FROM ${T} WHERE LOWER(${COL.email}) = $1 AND ${COL.actif} IS NOT FALSE`,
    [email.trim().toLowerCase()]
  );
  const user = rows[0];
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, NOW() + INTERVAL '30 minutes')`,
    [user.id, sha256(token)]
  );
  const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  await sendMail({ to: user.email, subject: "Réinitialisation de votre mot de passe E-KAJY", html: resetEmailHtml(link) });
}

async function resetPassword(token, password) {
  if (typeof token !== "string" || token.length < 32) throw new HttpError(400, "Lien invalide ou expiré.");
  if (!isStrongPassword(password))
    throw new HttpError(400, "Mot de passe trop faible.", {
      password: "8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.",
    });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT id, user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()
       FOR UPDATE`,
      [sha256(token)]
    );
    const row = rows[0];
    if (!row) { await client.query("ROLLBACK"); throw new HttpError(400, "Lien invalide ou expiré."); }

    const hash = await bcrypt.hash(password, 12);
    await client.query(`UPDATE ${T} SET ${COL.hash} = $1 WHERE ${COL.id} = $2`, [hash, row.user_id]);
    // Invalide ce jeton et tous les autres jetons en attente de cet utilisateur
    await client.query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL`, [row.user_id]);
    await client.query("COMMIT");
  } catch (e) {
    try { await client.query("ROLLBACK"); } catch {}
    throw e;
  } finally {
    client.release();
  }
}

export { register, login, getUserById, forgotPassword, resetPassword, publicUser, HttpError };