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

// Middlewares
app.use(helmet());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/pv', pvRoutes);
app.use(cookieParser());

// Vérification du serveur
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bienvenue sur le backend EKAJY",
    status: "Serveur opérationnel",
  });
});

// Vérification de PostgreSQL
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, database: "Connectée", date: result.rows[0].now });
  } catch (error) {
    console.error("Erreur PostgreSQL :", error.message);
    res.status(500).json({ success: false, database: "Erreur", message: error.message });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chantiers", chantierRoutes);
app.use("/api/contact", contactRoutes);

// Gestion centralisée des erreurs : toujours APRÈS toutes les routes
app.use((err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) {
    console.error("ERREUR SERVEUR:", err.code, err.message, err.detail, err.stack);
  }

  res.status(status).json({
    message: status >= 500 ? "Erreur interne du serveur." : err.message,
    debug: status >= 500 ? { code: err.code, message: err.message, detail: err.detail } : undefined,
    errors: err.errors,
  });
});

// Démarrage du serveur
async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("================================");
    console.log("          EKAJY BACKEND");
    console.log("================================");
    console.log("Connexion PostgreSQL réussie !");

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erreur de connexion PostgreSQL :", error.message);
    process.exit(1);
  }
}

startServer();