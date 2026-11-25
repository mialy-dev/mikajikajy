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


const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const isProd = process.env.NODE_ENV === "production";

app.use(helmet());
app.use(cors({ origin: FRONTEND_URL.split(","), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());            // AVANT toutes les routes

app.get("/", (req, res) => {
  res.json({ success: true, message: "Bienvenue sur le backend EKAJY", status: "Serveur opérationnel" });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, database: "Connectée", date: result.rows[0].now });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error.message);
    res.status(500).json({ success: false, database: "Erreur", message: error.message });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, database: "Connectée", date: result.rows[0].now });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error.message);
    res.status(500).json({ success: false, database: "Erreur", message: error.message });
  }
});

// TEMPORAIRE : à supprimer après le test
app.get("/api/debug-db", (req, res) => {
  const url = process.env.DATABASE_URL;
  res.json({
    aDatabaseUrl: Boolean(url),
    hoteDansUrl: url ? url.split("@")[1]?.split("/")[0] : null,
    dbHost: process.env.DB_HOST || null,
  });
});

app.use("/api/auth", authRoutes);

app.get("/api/debug-db", (req, res) => {
  const url = process.env.DATABASE_URL;

  res.json({
    aDatabaseUrl: Boolean(url),
    hoteDansUrl: url ? url.split("@")[1]?.split("/")[0] : null,
    dbHost: process.env.DB_HOST || null,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chantiers", chantierRoutes);
app.use("/api/pv", pvRoutes);       // déplacé ici
app.use("/api/contact", contactRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error("ERREUR SERVEUR:", err.code, err.message, err.detail, err.stack);

  res.status(status).json({
    message: status >= 500 ? "Erreur interne du serveur." : err.message,
    debug: status >= 500 && !isProd
      ? { code: err.code, message: err.message, detail: err.detail }
      : undefined,
    errors: err.errors,
  });
});

// Démarrage local uniquement (pas sur Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
};
// Démarrage local uniquement (pas sur Vercel)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
}

export default app;   // indispensable pour Vercel