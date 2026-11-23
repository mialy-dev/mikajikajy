
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires"
      });
    }

    const result = await pool.query(
      `SELECT id, entreprise_id, nom, email,
              password, role, actif
       FROM utilisateurs
       WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user || !user.actif) {
      return res.status(401).json({
        message: "Identifiants incorrects"
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Identifiants incorrects"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        entreprise_id: user.entreprise_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role,
        entreprise_id: user.entreprise_id
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la connexion"
    });
  }
}
