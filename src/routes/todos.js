// Routes todos - Version PostgreSQL
// Remplace complètement l'ancienne version

import express from 'express'
import pool from '../config/database.js'

const router = express.Router()

// ============================================
// GET /api/todos - Récupérer toutes les tâches
// ============================================
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    console.error('Erreur GET /todos:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// GET /api/todos/:id - Récupérer une tâche
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'SELECT * FROM todos WHERE id = $1',
      [id]  // $1 = paramètre sécurisé (évite les injections SQL)
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Erreur GET /todos/:id:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// POST /api/todos - Créer une tâche
// ============================================
router.post('/', async (req, res) => {
  try {
    const { text } = req.body
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Le texte est requis' })
    }
    
    const result = await pool.query(
      'INSERT INTO todos (text) VALUES ($1) RETURNING *',
      [text.trim()]
    )
    
    // RETURNING * renvoie la ligne créée (avec id et created_at générés)
    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Erreur POST /todos:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// PUT /api/todos/:id - Modifier une tâche
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { text, completed } = req.body
    
    // Construire la requête dynamiquement
    const updates = []
    const values = []
    let paramCount = 1
    
    if (text !== undefined) {
      updates.push(`text = $${paramCount}`)
      values.push(text.trim())
      paramCount++
    }
    
    if (completed !== undefined) {
      updates.push(`completed = $${paramCount}`)
      values.push(completed)
      paramCount++
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune modification fournie' })
    }
    
    values.push(id)
    
    const query = `
      UPDATE todos 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `
    
    const result = await pool.query(query, values)
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    console.error('Erreur PUT /todos/:id:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// DELETE /api/todos/:id - Supprimer une tâche
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' })
    }
    
    res.json({ message: 'Tâche supprimée', todo: result.rows[0] })
  } catch (error) {
    console.error('Erreur DELETE /todos/:id:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ============================================
// DELETE /api/todos - Supprimer les tâches complétées
// ============================================
router.delete('/', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM todos WHERE completed = true RETURNING *'
    )
    
    res.json({ 
      message: `${result.rowCount} tâche(s) supprimée(s)`,
      deleted: result.rows
    })
  } catch (error) {
    console.error('Erreur DELETE /todos:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router