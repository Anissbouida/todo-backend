// server.js - Point d'entrée de notre API

import express from 'express'
import cors from 'cors'
import todosRouter from './routes/todos.js'

const app = express()
const PORT = 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Log des requêtes
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`)
  next()
})

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 API Todo Backend',
    version: '2.0.0',
    database: 'PostgreSQL',  // Mis à jour !
    endpoints: {
      todos: '/api/todos'
    }
  })
})

app.use('/api/todos', todosRouter)

// Démarrage
app.listen(PORT, () => {
  console.log('')
  console.log('🚀 ====================================')
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
  console.log('🐘 Base de données: PostgreSQL')
  console.log('🚀 ====================================')
  console.log('')
})