import fs from 'node:fs';
import pool from './config/db.js';

const file = process.argv[2];
if (!file) {
  console.error('Usage : node apply-migration.js fichier.sql');
  process.exit(1);
}

try {
  const sql = fs.readFileSync(file, 'utf8');
  await pool.query(sql);
  console.log('Migration appliquée :', file);
} catch (e) {
  console.error('Erreur migration :', e.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
