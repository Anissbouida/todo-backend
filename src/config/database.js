// database.js - Configuration de la connexion PostgreSQL

import pg from 'pg'
const { Pool } = pg

// Pool = groupe de connexions réutilisables (plus efficace)
const pool = new Pool({
  host: 'localhost',      // Serveur PostgreSQL
  port: 5432,             // Port par défaut
  database: 'todo_db',    // Nom de notre base
  user: process.env.USER, // Ton nom d'utilisateur macOS
  password: '',           // Pas de mot de passe en local
})

// Test de connexion au démarrage
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur de connexion à PostgreSQL:', err.message)
  } else {
    console.log('✅ Connecté à PostgreSQL:', res.rows[0].now)
  }
})

export default pool