
import pool from "../config/db.js";

export async function getChantiers(req, res) {
  try {
    const result = await pool.query(
      `SELECT *
       FROM chantiers
       WHERE entreprise_id = $1
       ORDER BY created_at DESC`,
      [req.user.entreprise_id]
    );

    res.json({
      success: true,
      chantiers: result.rows
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Impossible de récupérer les chantiers"
    });
  }
}

export async function createChantier(req, res) {
  const client = await pool.connect();

  try {
    const { reference, nom, adresse } = req.body;
    const entrepriseId = req.user.entreprise_id;

    if (!entrepriseId) {
      return res.status(400).json({
        message: "Entreprise obligatoire"
      });
    }

    if (!reference || !nom) {
      return res.status(400).json({
        message: "Référence et nom obligatoires"
      });
    }

    await client.query("BEGIN");

    const result = await client.query(
      `INSERT INTO chantiers
       (entreprise_id, reference, nom, adresse)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [entrepriseId, reference, nom, adresse || null]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Chantier créé avec succès",
      chantier: result.rows[0]
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(error.code === "23505" ? 409 : 500).json({
      message: error.code === "23505"
        ? "Cette référence existe déjà"
        : "Erreur lors de la création du chantier"
    });

  } finally {
    client.release();
  }
}
