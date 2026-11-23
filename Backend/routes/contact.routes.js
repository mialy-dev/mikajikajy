import { Router } from "express";
import rateLimit from "express-rate-limit";
import { protect, requireRole } from "../middleware/auth.js";
import {
  creerMessage,
  listerMessages,
  statsMessages,
  changerStatut,
  supprimerMessage,
} from "../controllers/contact.controller.js";

const router = Router();

// ⚠ Rôles autorisés à lire les messages : adaptez à vos quatre rôles
const ROLES_ADMIN = ["superadmin"];
const admin = [protect, requireRole(...ROLES_ADMIN)];

// 5 messages par 15 minutes et par adresse IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Trop de messages envoyés. Réessayez dans quelques minutes." },
});

router.post("/", contactLimiter, creerMessage);          // public
router.get("/stats", ...admin, statsMessages);
router.get("/", ...admin, listerMessages);
router.put("/:id/statut", ...admin, changerStatut);
router.delete("/:id", ...admin, supprimerMessage);

export default router;