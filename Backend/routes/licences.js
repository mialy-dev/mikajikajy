import { Router } from "express";
import rateLimit from "express-rate-limit";
import pool from "../config/db.js";

const router = Router();

// Limite les essais de codes (protection contre les devinettes)
const activationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: "Trop de tentatives. Réessayez dans quelques minutes." },
});

router.post("/activate", activationLimiter, async (req, res, next) => {
  try {
    const code = String(req.body?.licenceKey || "").trim().toUpperCase();

    if (!code) {
      return res.status(400).json({ success: false, message: "Veuillez saisir votre clé de licence." });
    }

    const { rows } = await pool.query(
      "SELECT id, statut, date_expiration FROM licences WHERE UPPER(code) = $1",
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Code de licence invalide." });
    }

    const licence = rows[0];

    if (licence.date_expiration && new Date(licence.date_expiration) < new Date()) {
      return res.status(400).json({ success: false, message: "Votre licence a expiré." });
    }

    if (licence.statut === "active") {
      return res.status(409).json({ success: false, message: "Cette licence est déjà activée." });
    }

    // Mise à jour atomique : évite deux activations simultanées
    const update = await pool.query(
      "UPDATE licences SET statut = 'active', date_activation = NOW() WHERE id = $1 AND statut <> 'active'",
      [licence.id]
    );

    if (update.rowCount === 0) {
      return res.status(409).json({ success: false, message: "Cette licence est déjà activée." });
    }

    res.json({ success: true, message: "Votre licence a été activée avec succès." });
  } catch (error) {
    next(error);
  }
});

export default router;