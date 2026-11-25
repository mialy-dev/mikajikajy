import pg from "pg";

const isProduction = process.env.NODE_ENV === "production";

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "ekajy",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    };

const pool = new pg.Pool({
  ...config,
  max: process.env.VERCEL ? 3 : 10,   // peu de connexions en serverless
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("Erreur PostgreSQL :", err.message);
});

export default pool;