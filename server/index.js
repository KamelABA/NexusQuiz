import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import scoresRouter from './routes/scores.js'
import visitorsRouter from './routes/visitors.js'
import { firestore } from './firebaseAdmin.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quiz'

app.use(cors())
app.use(express.json())
app.set('trust proxy', true)

// Simple health endpoint to verify server and Firebase
app.get('/api/health', async (req, res) => {
  try {
    // Try a lightweight Firestore operation to confirm connectivity
    await firestore.listCollections()
    res.json({ status: 'ok', firebase: true })
  } catch (e) {
    res.json({ status: 'ok', firebase: false })
  }
})

app.use('/api/scores', scoresRouter)
app.use('/api/visitors', visitorsRouter)

mongoose
  .connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined })
  .then(() => {
    console.log('Connected to MongoDB')
    console.log('Firebase Admin initialized for Firestore')
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on http://0.0.0.0:${port}`)
      console.log(`Access locally at http://localhost:${port}`)
      console.log(`Access from network at http://<your-ip>:${port}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err)
    process.exit(1)
  })


