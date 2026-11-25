import path from 'node:path';
import fs from 'node:fs';
import pool from '../config/db.js';

const roleOf = (req) =>
  String(req.user?.role || req.user?.role_name || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const nameOf = (req) => req.user?.nom || req.user?.name || req.user?.email || 'Utilisateur';

const EDIT_ROLES = ['superadmin', 'editeur', 'intervenant'];
const REVIEW_ROLES = ['superadmin', 'editeur'];

// statut courant -> { statut cible: rôles autorisés }
const TRANSITIONS = {
  brouillon:       { soumis: EDIT_ROLES },
  soumis:          { en_verification: REVIEW_ROLES, brouillon: REVIEW_ROLES },
  en_verification: { valide: REVIEW_ROLES, rejete: REVIEW_ROLES },
  valide:          { signe: REVIEW_ROLES },
  rejete:          { brouillon: EDIT_ROLES },
  signe:           { archive: ['superadmin'] },
  archive:         {},
};
const EDITABLE = ['brouillon', 'rejete'];

async function log(db, pvId, req, action, details = {}) {
  await db.query(
    'INSERT INTO pv_historique (pv_id, user_id, auteur, action, details) VALUES ($1,$2,$3,$4,$5)',
    [pvId, req.user?.id ?? null, nameOf(req), action, details]
  );
}

async function replaceChildren(db, pvId, { participants, reserves }) {
  if (Array.isArray(participants)) {
    await db.query('DELETE FROM pv_participants WHERE pv_id=$1', [pvId]);
    for (const p of participants.filter((x) => x?.nom?.trim())) {
      await db.query(
        'INSERT INTO pv_participants (pv_id, nom, fonction, entreprise, email, present) VALUES ($1,$2,$3,$4,$5,$6)',
        [pvId, p.nom.trim(), p.fonction || null, p.entreprise || null, p.email || null, p.present !== false]
      );
    }
  }
  if (Array.isArray(reserves)) {
    await db.query('DELETE FROM pv_reserves WHERE pv_id=$1', [pvId]);
    for (const r of reserves.filter((x) => x?.description?.trim())) {
      await db.query(
        'INSERT INTO pv_reserves (pv_id, description, responsable, echeance, levee, date_levee) VALUES ($1,$2,$3,$4,$5,$6)',
        [pvId, r.description.trim(), r.responsable || null, r.echeance || null, !!r.levee, r.levee ? (r.date_levee || new Date()) : null]
      );
    }
  }
}

export async function listTypes(_req, res) {
  const { rows } = await pool.query(
    `SELECT t.*, (SELECT COUNT(*)::int FROM proces_verbaux p WHERE p.type_id = t.id) AS total
     FROM types_pv t WHERE t.actif ORDER BY t.ordre`
  );
  res.json(rows);
}

export async function stats(_req, res) {
  const { rows } = await pool.query(
    'SELECT statut, COUNT(*)::int AS total FROM proces_verbaux GROUP BY statut'
  );
  res.json(rows);
}

export async function listPv(req, res) {
  const { type, statut, projet_id, q, page = 1, limit = 20 } = req.query;
  const where = [];
  const params = [];
  const add = (sql, v) => { params.push(v); where.push(sql.replaceAll('?', `$${params.length}`)); };

  if (type) add('t.code = ?', type);
  if (statut) add('p.statut = ?', statut);
  if (projet_id) add('p.projet_id = ?', projet_id);
  if (q) add('(p.numero ILIKE ? OR p.titre ILIKE ? OR p.lieu ILIKE ?)', `%${q}%`);
  // l'intervenant ne voit que ses PV et les PV validés/signés/archivés
  if (roleOf(req) === 'intervenant') {
    add("(p.created_by = ? OR p.statut IN ('valide','signe','archive'))", req.user.id);
  }

  const w = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const lim = Math.min(Number(limit) || 20, 100);
  const off = (Math.max(Number(page), 1) - 1) * lim;

  const count = await pool.query(
    `SELECT COUNT(*)::int AS total FROM proces_verbaux p JOIN types_pv t ON t.id=p.type_id ${w}`, params
  );
  const { rows } = await pool.query(
    `SELECT p.id, p.numero, p.titre, p.date_pv, p.lieu, p.statut, p.avancement, p.projet_id,
            t.code AS type_code, t.libelle AS type_libelle,
            COALESCE(to_jsonb(pj)->>'nom', to_jsonb(pj)->>'titre', to_jsonb(pj)->>'name', to_jsonb(pj)->>'intitule') AS projet_nom
     FROM proces_verbaux p
     JOIN types_pv t ON t.id = p.type_id
     LEFT JOIN chantiers pj ON pj.id = p.projet_id
     ${w}
     ORDER BY p.date_pv DESC, p.id DESC
     LIMIT ${lim} OFFSET ${off}`,
    params
  );
  res.json({ data: rows, total: count.rows[0].total, page: Number(page), limit: lim });
}

export async function getPv(req, res) {
  const id = Number(req.params.id);
  const { rows } = await pool.query(
    `SELECT p.*, t.code AS type_code, t.libelle AS type_libelle
     FROM proces_verbaux p JOIN types_pv t ON t.id=p.type_id WHERE p.id=$1`, [id]
  );
  const pv = rows[0];
  if (!pv) return res.status(404).json({ message: 'PV introuvable' });
  if (roleOf(req) === 'intervenant' && pv.created_by !== req.user.id && !['valide', 'signe', 'archive'].includes(pv.statut))
    return res.status(403).json({ message: 'Accès refusé' });

  const q = (sql) => pool.query(sql, [id]).then((r) => r.rows);
  const [participants, reserves, signatures, validations, documents, historique] = await Promise.all([
    q('SELECT * FROM pv_participants WHERE pv_id=$1 ORDER BY id'),
    q('SELECT * FROM pv_reserves WHERE pv_id=$1 ORDER BY id'),
    q('SELECT * FROM pv_signatures WHERE pv_id=$1 ORDER BY signe_le'),
    q('SELECT * FROM pv_validations WHERE pv_id=$1 ORDER BY created_at DESC'),
    q('SELECT * FROM pv_documents WHERE pv_id=$1 ORDER BY created_at DESC'),
    q('SELECT * FROM pv_historique WHERE pv_id=$1 ORDER BY created_at DESC'),
  ]);
  const projet = await pool.query('SELECT * FROM chantiers WHERE id=$1', [pv.projet_id]).then((r) => r.rows[0] || null);
  res.json({ ...pv, projet, participants, reserves, signatures, validations, documents, historique });
}

export async function createPv(req, res) {
  const { type_code, projet_id, titre, date_pv, lieu, objet, observations, details, avancement, participants, reserves } = req.body;
  if (!type_code || !projet_id || !titre?.trim())
    return res.status(400).json({ message: 'Type, chantier et titre sont obligatoires' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const t = await client.query('SELECT id, code FROM types_pv WHERE code=$1 AND actif', [type_code]);
    if (!t.rows[0]) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Type de PV inconnu' }); }
    const pj = await client.query('SELECT id FROM chantiers WHERE id=$1', [projet_id]);
    if (!pj.rows[0]) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Chantier introuvable' }); }

    const seq = await client.query("SELECT nextval('pv_numero_seq') AS n");
    const year = new Date(date_pv || Date.now()).getFullYear();
    const prefix = t.rows[0].code.split('-').map((s) => s[0]).join('').toUpperCase();
    const numero = `PV-${prefix}-${year}-${String(seq.rows[0].n).padStart(5, '0')}`;

    const ins = await client.query(
      `INSERT INTO proces_verbaux (numero, type_id, projet_id, titre, date_pv, lieu, objet, observations, details, avancement, created_by)
       VALUES ($1,$2,$3,$4,COALESCE($5, CURRENT_DATE),$6,$7,$8,$9,$10,$11) RETURNING *`,
      [numero, t.rows[0].id, projet_id, titre.trim(), date_pv || null, lieu || null, objet || null,
       observations || null, details || {}, avancement ?? null, req.user.id]
    );
    await replaceChildren(client, ins.rows[0].id, { participants, reserves });
    await log(client, ins.rows[0].id, req, 'creation', { numero });
    await client.query('COMMIT');
    res.status(201).json(ins.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la création du PV' });
  } finally { client.release(); }
}

export async function updatePv(req, res) {
  const id = Number(req.params.id);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cur = (await client.query('SELECT * FROM proces_verbaux WHERE id=$1 FOR UPDATE', [id])).rows[0];
    if (!cur) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'PV introuvable' }); }
    if (!EDITABLE.includes(cur.statut)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Modification impossible : le PV n\'est plus en brouillon' });
    }
    if (roleOf(req) === 'intervenant' && cur.created_by !== req.user.id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: 'Vous ne pouvez modifier que vos propres PV' });
    }
    const b = req.body;
    const upd = await client.query(
      `UPDATE proces_verbaux SET titre=COALESCE($1,titre), date_pv=COALESCE($2,date_pv), lieu=$3, objet=$4,
         observations=$5, details=COALESCE($6,details), avancement=$7, projet_id=COALESCE($8,projet_id), updated_at=now()
       WHERE id=$9 RETURNING *`,
      [b.titre?.trim() || null, b.date_pv || null, b.lieu ?? cur.lieu, b.objet ?? cur.objet,
       b.observations ?? cur.observations, b.details || null, b.avancement ?? cur.avancement, b.projet_id || null, id]
    );
    await replaceChildren(client, id, b);
    await log(client, id, req, 'modification', { champs: Object.keys(b) });
    await client.query('COMMIT');
    res.json(upd.rows[0]);
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ message: 'Erreur lors de la modification' });
  } finally { client.release(); }
}

export async function changeStatut(req, res) {
  const id = Number(req.params.id);
  const { statut, commentaire } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cur = (await client.query('SELECT * FROM proces_verbaux WHERE id=$1 FOR UPDATE', [id])).rows[0];
    if (!cur) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'PV introuvable' }); }
    const allowed = TRANSITIONS[cur.statut]?.[statut];
    if (!allowed) { await client.query('ROLLBACK'); return res.status(409).json({ message: `Transition ${cur.statut} → ${statut} non autorisée` }); }
    if (!allowed.includes(roleOf(req))) { await client.query('ROLLBACK'); return res.status(403).json({ message: 'Votre rôle ne permet pas cette action' }); }
    if (statut === 'rejete' && !commentaire?.trim()) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Un motif de rejet est obligatoire' }); }
    if (statut === 'signe') {
      const s = await client.query('SELECT COUNT(*)::int AS n FROM pv_signatures WHERE pv_id=$1', [id]);
      if (s.rows[0].n === 0) { await client.query('ROLLBACK'); return res.status(409).json({ message: 'Ajoutez au moins une signature avant de passer en « Signé »' }); }
    }
    await client.query('UPDATE proces_verbaux SET statut=$1, updated_at=now() WHERE id=$2', [statut, id]);
    if (['en_verification', 'valide', 'rejete'].includes(statut)) {
      await client.query(
        'INSERT INTO pv_validations (pv_id, user_id, valideur, decision, commentaire) VALUES ($1,$2,$3,$4,$5)',
        [id, req.user.id, nameOf(req), statut, commentaire || null]
      );
    }
    await log(client, id, req, 'statut', { de: cur.statut, vers: statut, commentaire: commentaire || null });
    await client.query('COMMIT');
    res.json({ id, statut });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(500).json({ message: 'Erreur lors du changement de statut' });
  } finally { client.release(); }
}

export async function addSignature(req, res) {
  const id = Number(req.params.id);
  const { nom, fonction, signature } = req.body;
  if (!nom?.trim()) return res.status(400).json({ message: 'Nom du signataire obligatoire' });
  const pv = (await pool.query('SELECT statut FROM proces_verbaux WHERE id=$1', [id])).rows[0];
  if (!pv) return res.status(404).json({ message: 'PV introuvable' });
  if (!['valide', 'signe'].includes(pv.statut))
    return res.status(409).json({ message: 'Le PV doit être validé avant d\'être signé' });
  const { rows } = await pool.query(
    'INSERT INTO pv_signatures (pv_id, user_id, nom, fonction, signature) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, req.user.id, nom.trim(), fonction || null, signature || null]
  );
  await log(pool, id, req, 'signature', { nom: nom.trim() });
  res.status(201).json(rows[0]);
}

export async function addDocument(req, res) {
  const id = Number(req.params.id);
  const { nom, url, type } = req.body;
  if (!nom || !url) return res.status(400).json({ message: 'Nom et URL obligatoires' });
  const { rows } = await pool.query(
    'INSERT INTO pv_documents (pv_id, nom, url, type, ajoute_par) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [id, nom, url, type || 'annexe', req.user.id]
  );
  await log(pool, id, req, 'modification', { document: nom });
  res.status(201).json(rows[0]);
}

export async function deletePv(req, res) {
  const id = Number(req.params.id);
  const r = await pool.query("DELETE FROM proces_verbaux WHERE id=$1 AND statut IN ('brouillon','rejete')", [id]);
  if (!r.rowCount) return res.status(409).json({ message: 'Seuls les PV en brouillon ou rejetés peuvent être supprimés' });
  res.json({ ok: true });
}

// ---------- Pièces jointes (photos, PDF, annexes) ----------
// Dossier temporaire compatible avec Vercel
export const UPLOAD_DIR = path.join('/tmp', 'uploads', 'pv');

export async function uploadDocuments(req, res) {
  const id = Number(req.params.id);
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ message: 'Aucun fichier reçu' });
  const pv = (await pool.query('SELECT statut, created_by FROM proces_verbaux WHERE id=$1', [id])).rows[0];
  if (!pv) { files.forEach((f) => fs.unlink(f.path, () => {})); return res.status(404).json({ message: 'PV introuvable' }); }
  if (pv.statut === 'archive') { files.forEach((f) => fs.unlink(f.path, () => {})); return res.status(409).json({ message: 'PV archivé' }); }
  if (roleOf(req) === 'intervenant' && pv.created_by !== req.user.id) {
    files.forEach((f) => fs.unlink(f.path, () => {}));
    return res.status(403).json({ message: 'Accès refusé' });
  }
  const out = [];
  for (const f of files) {
    const type = f.mimetype.startsWith('image/') ? 'photo' : f.mimetype === 'application/pdf' ? 'pdf' : 'annexe';
    const r = await pool.query(
      'INSERT INTO pv_documents (pv_id, nom, url, type, ajoute_par) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [id, f.originalname, f.filename, type, req.user.id]
    );
    out.push(r.rows[0]);
  }
  await log(pool, id, req, 'modification', { fichiers: out.map((d) => d.nom) });
  res.status(201).json(out);
}

export async function downloadDocument(req, res) {
  const { rows } = await pool.query(
    `SELECT d.*, p.created_by, p.statut FROM pv_documents d JOIN proces_verbaux p ON p.id=d.pv_id WHERE d.id=$1`,
    [Number(req.params.docId)]
  );
  const d = rows[0];
  if (!d) return res.status(404).json({ message: 'Document introuvable' });
  if (roleOf(req) === 'intervenant' && d.created_by !== req.user.id && !['valide', 'signe', 'archive'].includes(d.statut))
    return res.status(403).json({ message: 'Accès refusé' });
  const file = path.join(UPLOAD_DIR, path.basename(d.url)); // basename : empêche toute traversée de dossier
  if (!fs.existsSync(file)) return res.status(404).json({ message: 'Fichier absent du serveur' });
  res.download(file, d.nom);
}

export async function deleteDocument(req, res) {
  const { rows } = await pool.query(
    `SELECT d.*, p.created_by, p.statut FROM pv_documents d JOIN proces_verbaux p ON p.id=d.pv_id WHERE d.id=$1`,
    [Number(req.params.docId)]
  );
  const d = rows[0];
  if (!d) return res.status(404).json({ message: 'Document introuvable' });
  if (!['brouillon', 'rejete'].includes(d.statut)) return res.status(409).json({ message: 'Suppression possible seulement en brouillon ou rejeté' });
  if (roleOf(req) === 'intervenant' && d.created_by !== req.user.id) return res.status(403).json({ message: 'Accès refusé' });
  await pool.query('DELETE FROM pv_documents WHERE id=$1', [d.id]);
  fs.unlink(path.join(UPLOAD_DIR, path.basename(d.url)), () => {});
  await log(pool, d.pv_id, req, 'modification', { fichier_supprime: d.nom });
  res.json({ ok: true });
}
