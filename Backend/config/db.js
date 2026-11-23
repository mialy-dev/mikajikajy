import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'ekajy',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    ssl: false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
    console.error('Erreur PostgreSQL :', err.message);
});

pool.query("SELECT current_database() AS db, current_user AS usr")
  .then(r => console.log("DB connectée :", r.rows[0].db, "| user :", r.rows[0].usr))
  .catch(e => console.error("Connexion DB échouée :", e.message));

export default pool;