import { Router } from 'express'
import Score from '../models/Score.js'

const router = Router()

// POST /api/scores  { name, code, score, durationMs, classNumber? }
router.post('/', async (req, res) => {
  try {
    const { name, classNumber, code, score, durationMs } = req.body
    if (
      typeof name !== 'string' || !name.trim() ||
      typeof code !== 'string' || !code.trim() ||
      typeof score !== 'number' || typeof durationMs !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid payload' })
    }

    const created = await Score.create({ name: name.trim(), classNumber: (classNumber || '').trim(), code: code.trim(), score, durationMs })
    return res.status(201).json({ id: created._id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/scores/leaderboard?limit=10
router.get('/leaderboard', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '10', 10), 100)
    const results = await Score.find({})
      .sort({ score: -1, durationMs: 1, createdAt: 1 })
      .limit(limit)
      .lean()

    return res.json(results.map((r) => ({
      id: r._id,
      name: r.name,
      classNumber: r.classNumber,
      code: r.code,
      score: r.score,
      durationMs: r.durationMs,
      createdAt: r.createdAt,
    })))
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router


