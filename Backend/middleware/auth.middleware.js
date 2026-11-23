import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentification requise"
    });
  }

  try {
    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Token invalide ou expiré"
    });
  }
}

// Alias pour les fichiers qui utilisent protect
export const protect = authenticate;
