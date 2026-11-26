import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import pool from "./config/db.js";
import authRoutes from "./routes/auth.js";
import chantierRoutes from "./routes/chantier.routes.js";
import pvRoutes from "./routes/pv.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import licenceRoutes from "./routes/licences.js";

const app = express();

const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// Domaines autorisés à communiquer avec le backend
const allowedOrigins = [
  ...(process.env.FRONTEND_URL || "").split(","),
  "https://mikajikajy.vercel.app",
  "http://localhost:5173",
]
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

// Configuration du proxy Vercel
app.set("trust proxy", 1);

// Sécurité HTTP
app.use(helmet());

// Configuration CORS : une seule fois
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route principale
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bienvenue sur le backend EKAJY",
    status: "Serveur opérationnel",
  });
});

// Vérification du backend et de PostgreSQL
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      database: "Connectée",
      date: result.rows[0].now,
    });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error.message);

    res.status(500).json({
      success: false,
      database: "Erreur",
      message: isProd
        ? "Impossible de se connecter à la base de données."
        : error.message,
    });
  }
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/chantiers", chantierRoutes);
app.use("/api/pv", pvRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/licence", licenceRoutes);

// Route introuvable (après toutes les routes, avant le gestionnaire d'erreurs)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

// Gestion centralisée des erreurs
app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("ERREUR SERVEUR:", err.code, err.message, err.stack);
  }

  res.status(status).json({
    success: false,
    message: status >= 500 ? "Erreur interne du serveur." : err.message,
    debug:
      status >= 500 && !isProd
        ? { code: err.code, message: err.message, detail: err.detail }
        : undefined,
    errors: err.errors,
  });
});

// Démarrage local uniquement
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}

// Export pour Vercel
export default app;