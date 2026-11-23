
import pool from "./config/db.js";

try {
  const result = await pool.query("SELECT NOW()");

  console.log("Connexion PostgreSQL réussie !");
  console.log("Date serveur :", result.rows[0].now);

} catch (error) {
  console.error("Échec connexion :", error.message);

} finally {
  await pool.end();
}
