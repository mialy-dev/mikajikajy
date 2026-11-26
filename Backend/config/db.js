import pg from "pg";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;

// SSL requis pour Neon (Vercel), inutile pour un PostgreSQL local
const isLocalUrl =
  !!databaseUrl && /@(localhost|127\.0\.0\.1)(:|\/)/.test(databaseUrl);
const sslConfig = { rejectUnauthorized: false };

const config = databaseUrl
  ? {
      connectionString: databaseUrl,
      ssl: isLocalUrl ? false : sslConfig,
    }
  : {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "ekajy",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      ssl: isProduction ? sslConfig : false,
    };

const pool = new pg.Pool({
  ...config,
  max: process.env.VERCEL ? 3 : 10, // peu de connexions en serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Erreur PostgreSQL :", err.message);
});

export default pool;