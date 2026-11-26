import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import chantierRoutes from "./routes/chantier.routes.js";
import pvRoutes from "./routes/pv.routes.js";

const app = express();

// Nécessaire derrière Vercel (cookies secure + rate limit)
app.set("trust proxy", 1);

app.use(helmet());

// Origines autorisées : FRONTEND_URL peut contenir plusieurs URL séparées par des virgules
const allowedOrigins = [
  ...(process.env.FRONTEND_URL || "").split(",").map((u) => u.trim()).filter(Boolean),
  "https://mikajikajy.vercel.app",
  "http://localhost:5173",
];

app.use(cors({
  origin(origin, callback) {
    // Autorise aussi les appels sans origine (navigateur direct, tests)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origine non autorisée par CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
}));

app.get("/", (req, res) => {
  res.json({
    application: "E-KAJY",
    message: "Bienvenue sur E-KAJY",
    status: "Opérationnel",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ application: "E-KAJY", status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chantiers", chantierRoutes);
app.use("/api/pv", pvRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.status ? err.message : "Erreur interne du serveur",
  });
});

export default app;