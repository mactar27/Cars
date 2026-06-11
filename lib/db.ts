import "server-only"
import mysql from "mysql2/promise"

// Pool de connexions MySQL réutilisable
const pool = mysql.createPool({
  host:     process.env.DATABASE_HOST     || "localhost",
  port:     parseInt(process.env.DATABASE_PORT || "3306"),
  user:     process.env.DATABASE_USER     || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME     || "car",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            "utf8mb4",
  ssl: process.env.DATABASE_SSL === "true" ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
})

export default pool

/** Exécute une requête SQL préparée et retourne les lignes. */
export async function query<T = unknown>(
  sql: string,
  values?: unknown[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, values)
  return rows as T[]
}

/** Exécute une requête de modification et retourne le résultat. */
export async function execute(
  sql: string,
  values?: unknown[]
): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.execute(sql, values)
  return result as mysql.ResultSetHeader
}
