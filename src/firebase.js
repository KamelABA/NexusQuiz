// Frontend Firebase initialization for NexusQuiz
// 1. In Firebase Console, create a Web App for your project
// 2. Copy the config object and replace the placeholders below

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase config for NexusQuiz project
// If you regenerate keys in Firebase Console, update them here.
const firebaseConfig = {
  apiKey: 'AIzaSyAaLSaQUsxJlIVdh8rC3eav5qDNLJ4eSQ8',
  authDomain: 'quiz-94eab.firebaseapp.com',
  projectId: 'quiz-94eab',
  storageBucket: 'quiz-94eab.firebasestorage.app',
  messagingSenderId: '386269610402',
  appId: '1:386269610402:web:5e9919dfc7c09ff1ebb2fb',
  measurementId: 'G-BZ3Y7RT8MM',
}

// Initialize Firebase once per app
const app = initializeApp(firebaseConfig)

// Export Firestore instance for use in components
export const db = getFirestore(app)


