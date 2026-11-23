
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';   // ← ajoute cette ligne
import HomePage from './pages/HomePage';
import PVHome from './pages/pv/PVHome';
// ... tes autres imports

import authRoutes from "./routes/auth.routes.js";
import chantierRoutes from "./routes/chantier.routes.js";
import pvRoutes from "./routes/pv.routes.js";


const app = express();

app.use(helmet());

app.use('/api/pv', pvRoutes);

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300
}));

app.get("/", (req, res) => {
  res.json({
    application: "E-KAJY",
    message: "Bienvenue sur E-KAJY",
    status: "Opérationnel"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    application: "E-KAJY",
    status: "OK"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/chantiers", chantierRoutes);
app.use("/api/pv", pvRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route introuvable"
  });
});

app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.status
      ? err.message
      : "Erreur interne du serveur"
  });
});

export default app;
