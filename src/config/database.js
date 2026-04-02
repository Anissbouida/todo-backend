// database.js - Configuration PostgreSQL robuste

import pg from 'pg'
const { Pool } = pg

let pool

// Configuration selon l'environnement
if (process.env.DATABASE_URL) {
  // Production (Railway)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  })
  console.log('🐘 Mode production - PostgreSQL Railway')
} else {
  // Local
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'todo_db',
    user: process.env.USER,
    password: '',
  })
  console.log('🐘 Mode local - PostgreSQL localhost')
}

// Test de connexion (non-bloquant)
pool.query('SELECT NOW()')
  .then(res => console.log('✅ PostgreSQL connecté:', res.rows[0].now))
  .catch(err => console.error('❌ PostgreSQL erreur:', err.message))

export default pool