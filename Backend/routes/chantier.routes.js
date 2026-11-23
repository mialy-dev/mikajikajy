import { Router } from "express";

import {
  getChantiers,
  createChantier
} from "../controllers/chantier.controller.js";

import { protect, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getChantiers);

router.post(
  "/",
  protect,
  requireRole("superadmin", "editeur"),
  createChantier
);

export default router;