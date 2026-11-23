import jwt from "jsonwebtoken";
import { getUserById, publicUser, HttpError } from "../services/authService.js";

// Lit le cookie HttpOnly (ou l'en-tête Authorization, pour rester compatible avec l'existant)
async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = req.cookies?.token || (header?.startsWith("Bearer ") ? header.slice(7) : null);
    if (!token) throw new HttpError(401, "Non authentifié.");

    let payload;
    try { payload = jwt.verify(token, process.env.JWT_SECRET); }
    catch { throw new HttpError(401, "Session expirée. Veuillez vous reconnecter."); }

    const user = await getUserById(payload.id);
    if (!user) throw new HttpError(401, "Non authentifié.");
    if (user.actif === false) throw new HttpError(403, "Ce compte est désactivé.");

    req.user = publicUser(user); // rôle relu en base à chaque requête
    next();
  } catch (e) { next(e); }
}

const requireRole = (...roles) => (req, res, next) =>
  roles.includes(req.user?.role) ? next() : next(new HttpError(403, "Accès refusé : droits insuffisants."));

export { protect, requireRole };