import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { readFileSync } from 'fs'

dotenv.config()

// Initialize Firebase Admin SDK once for the backend
if (!admin.apps.length) {
  let credential

  // Preferred: path to service account JSON in GOOGLE_APPLICATION_CREDENTIALS
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const serviceAccountJson = readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8')
    const serviceAccount = JSON.parse(serviceAccountJson)
    credential = admin.credential.cert(serviceAccount)
  } else {
    // Fallback: use application default credentials (for hosting on GCP, etc.)
    credential = admin.credential.applicationDefault()
  }

  admin.initializeApp({
    credential,
  })
}

export const firestore = admin.firestore()
export default admin


