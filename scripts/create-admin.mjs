#!/usr/bin/env node
// Script pour créer le compte admin avec un vrai hash bcrypt
// Usage: node scripts/create-admin.mjs

import bcrypt from "bcryptjs"
import mysql from "mysql2/promise"

const conn = await mysql.createConnection({
  host:     "localhost",
  port:     3306,
  user:     "root",
  password: "M@tzo2705",
  database: "car",
  charset:  "utf8mb4",
})

const email    = "admin@admin.com"
const password = "Admin1234!"

const hash = await bcrypt.hash(password, 12)

await conn.execute(
  `INSERT INTO users (email, password_hash, role, full_name)
   VALUES (?, ?, 'admin', 'Administrateur MAISON AUTO')
   ON DUPLICATE KEY UPDATE password_hash = ?`,
  [email, hash, hash]
)

console.log(`✅ Compte admin créé/mis à jour`)
console.log(`   Email:       ${email}`)
console.log(`   Mot de passe: ${password}`)
console.log(`   Rôle:        admin`)

await conn.end()
