import { z } from "zod";
import pool from "../config/db.js";

// ⚠ Ces deux listes doivent rester identiques à celles de src/config/siteInfo.js
export const CATEGORIES = [
  "Demande d'information",
  "Support technique",
  "Licence et abonnement",
  "Partenariat",
  "Autre",
];
export const STATUTS = ["Nouveau", "En cours", "Traité"];

const MSG_OK = "Votre message a bien été envoyé. Nous vous répondrons rapidement.";

const creerSchema = z.object({
  nom_complet: z.string().trim().min(2, "Le nom est obligatoire.").max(150, "Nom trop long."),
  email: z.string().trim().email("Adresse e-mail invalide.").max(255),
  telephone: z.string().trim().max(30)
    .regex(/^[+()\d\s.-]{6,30}$/, "Numéro de téléphone invalide.")
    .optional().or(z.literal("")),
  sujet: z.string().trim().min(3, "Le sujet est obligatoire.").max(200, "Sujet trop long."),
  categorie: z.enum(CATEGORIES, { error: "Catégorie invalide." }),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères.")
    .max(5000, "Message trop long (5000 caractères maximum)."),
  website: z.string().optional(), // champ piège anti-robots
});

const listeSchema = z.object({
  statut: z.enum(STATUTS).optional(),
  categorie: z.enum(CATEGORIES).optional(),
  q: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const idSchema = z.coerce.number().int().positive();

function erreursChamps(error) {
  const out = {};
  for (const i of error.issues) {
    const k = String(i.path[0] ?? "form");
    if (!out[k]) out[k] = i.message;
  }
  return out;
}

// POST /api/contact (public)
export async function creerMessage(req, res, next) {
  try {
    const parsed = creerSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({
        message: "Veuillez corriger le formulaire.",
        errors: erreursChamps(parsed.error),
      });
    }
    const d = parsed.data;
    if (d.website) return res.status(201).json({ message: MSG_OK }); // robot : on fait semblant

    await pool.query(
      `INSERT INTO messages_contact (nom_complet, email, telephone, sujet, categorie, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [d.nom_complet, d.email.toLowerCase(), d.telephone || null, d.sujet, d.categorie, d.message]
    );
    res.status(201).json({ message: MSG_OK });
  } catch (e) { next(e); }
}

// GET /api/contact (admin) : filtres statut, categorie, q, pagination
export async function listerMessages(req, res, next) {
  try {
    const parsed = listeSchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ message: "Paramètres invalides." });
    const { statut, categorie, q, page, limit } = parsed.data;

    const where = [];
    const params = [];
    if (statut) { params.push(statut); where.push(`statut = $${params.length}`); }
    if (categorie) { params.push(categorie); where.push(`categorie = $${params.length}`); }
    if (q) {
      params.push(`%${q.replace(/[%_\\]/g, "\\$&")}%`);
      const n = params.length;
      where.push(`(nom_complet ILIKE $${n} OR email ILIKE $${n} OR sujet ILIKE $${n} OR message ILIKE $${n})`);
    }
    const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const total = await pool.query(`SELECT COUNT(*)::int AS n FROM messages_contact ${clause}`, params);
    const rows = await pool.query(
      `SELECT * FROM messages_contact ${clause}
       ORDER BY date_creation DESC, id DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, (page - 1) * limit]
    );
    const nouveaux = await pool.query(
      `SELECT COUNT(*)::int AS n FROM messages_contact WHERE statut = 'Nouveau'`
    );
    res.json({ items: rows.rows, total: total.rows[0].n, page, limit, nouveaux: nouveaux.rows[0].n });
  } catch (e) { next(e); }
}

// GET /api/contact/stats (admin) : compteur de nouveaux messages
export async function statsMessages(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS total,
              COUNT(*) FILTER (WHERE statut = 'Nouveau')::int AS nouveaux
       FROM messages_contact`
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
}

// PUT /api/contact/:id/statut (admin)
export async function changerStatut(req, res, next) {
  try {
    const id = idSchema.safeParse(req.params.id);
    const body = z.object({ statut: z.enum(STATUTS) }).safeParse(req.body ?? {});
    if (!id.success || !body.success) return res.status(400).json({ message: "Requête invalide." });

    const { rows } = await pool.query(
      "UPDATE messages_contact SET statut = $1 WHERE id = $2 RETURNING *",
      [body.data.statut, id.data]
    );
    if (!rows[0]) return res.status(404).json({ message: "Message introuvable." });
    res.json(rows[0]);
  } catch (e) { next(e); }
}

// DELETE /api/contact/:id (admin)
export async function supprimerMessage(req, res, next) {
  try {
    const id = idSchema.safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ message: "Requête invalide." });

    const { rowCount } = await pool.query("DELETE FROM messages_contact WHERE id = $1", [id.data]);
    if (!rowCount) return res.status(404).json({ message: "Message introuvable." });
    res.json({ message: "Message supprimé." });
  } catch (e) { next(e); }
}