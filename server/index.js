import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import scoresRouter from './routes/scores.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz'

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/scores', scoresRouter)

mongoose
  .connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined })
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  })


