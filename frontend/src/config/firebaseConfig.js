/**
 * Firebase Configuration
 * 
 * This file initializes Firebase services for the Fashion Studio app.
 * Make sure to set up your environment variables in .env file.
 */

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Validate configuration
const validateConfig = () => {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ]

  const missingKeys = requiredKeys.filter(key => !import.meta.env[key])

  if (missingKeys.length > 0) {
    console.error('❌ Missing Firebase environment variables:', missingKeys)
    console.error('📝 Please add these to your .env file')
    console.error('📖 See FIREBASE_SETUP_GUIDE.md for instructions')
    return false
  }

  return true
}

// Initialize Firebase
let app = null
let db = null
let auth = null

try {
  if (validateConfig()) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
    console.log('✅ Firebase initialized successfully')
  } else {
    console.warn('⚠️ Firebase not initialized - missing configuration')
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
}

export { app, db, auth }
