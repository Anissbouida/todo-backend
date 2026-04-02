// database.js - Configuration PostgreSQL pour production

import pg from 'pg'
const { Pool } = pg

// Utilise DATABASE_URL en production, sinon config locale
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
})

// Test de connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur PostgreSQL:', err.message)
  } else {
    console.log('✅ Connecté à PostgreSQL:', res.rows[0].now)
  }
})

export default pool