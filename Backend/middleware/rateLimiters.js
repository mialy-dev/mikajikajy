import rateLimit from "express-rate-limit";

// 10 tentatives de connexion par 15 minutes et par adresse IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Réessayez dans quelques minutes." },
});

// 5 demandes de réinitialisation par 15 minutes et par adresse IP
export const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de demandes. Réessayez dans quelques minutes." },
});