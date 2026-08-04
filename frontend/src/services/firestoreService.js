/**
 * Firestore Service Layer
 * 
 * This service provides CRUD operations for all collections in Firestore.
 * It handles data fetching, creating, updating, and deleting with real-time updates.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

/**
 * Collection names in Firestore
 */
const COLLECTIONS = {
  PORTFOLIO: 'portfolio',
  CATEGORIES: 'categories',
  CATEGORY_IMAGES: 'categoryImages',
  ABOUT: 'about',
  YOUTUBE: 'youtubeVideos',
  SERVICES: 'services',
  TESTIMONIALS: 'testimonials',
  INQUIRIES: 'inquiries',
  HERO_PHOTOS: 'heroPhotos',
  GALLERY: 'gallery',
}

/**
 * Generic function to get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} Array of documents
 */
export async function getCollection(collectionName) {
  if (!db) {
    console.warn('Firestore not initialized, returning empty array')
    return []
  }

  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    const documents = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })
    return documents
  } catch (error) {
    console.error(`Error fetching ${collectionName}:`, error)
    return []
  }
}

/**
 * Generic function to get a single document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>} Document data or null
 */
export async function getDocument(collectionName, docId) {
  if (!db) {
    console.warn('Firestore not initialized')
    return null
  }

  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
  } catch (error) {
    console.error(`Error fetching document ${docId} from ${collectionName}:`, error)
    return null
  }
}

/**
 * Generic function to set/create a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Data to save
 * @returns {Promise<boolean>} Success status
 */
export async function setDocument(collectionName, docId, data) {
  if (!db) {
    console.warn('Firestore not initialized')
    return false
  }

  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error(`Error setting document ${docId} in ${collectionName}:`, error)
    return false
  }
}

/**
 * Generic function to update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Object} data - Data to update
 * @returns {Promise<boolean>} Success status
 */
export async function updateDocument(collectionName, docId, data) {
  if (!db) {
    console.warn('Firestore not initialized')
    return false
  }

  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    })
    return true
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error)
    return false
  }
}

/**
 * Generic function to delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteDocument(collectionName, docId) {
  if (!db) {
    console.warn('Firestore not initialized')
    return false
  }

  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
    return true
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
    return false
  }
}

/**
 * Subscribe to real-time updates for a collection
 * @param {string} collectionName - Name of the collection
 * @param {Function} callback - Callback function to receive updates
 * @returns {Function} Unsubscribe function
 */
export function subscribeToCollection(collectionName, callback) {
  if (!db) {
    console.warn('Firestore not initialized')
    return () => {}
  }

  try {
    const colRef = collection(db, collectionName)
    return onSnapshot(
      colRef,
      (snapshot) => {
        const documents = []
        snapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() })
        })
        callback(documents)
      },
      (error) => {
        console.error(`Error in real-time subscription for ${collectionName}:`, error)
      }
    )
  } catch (error) {
    console.error(`Error subscribing to ${collectionName}:`, error)
    return () => {}
  }
}

/**
 * Subscribe to real-time updates for a single document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {Function} callback - Callback function to receive updates
 * @returns {Function} Unsubscribe function
 */
export function subscribeToDocument(collectionName, docId, callback) {
  if (!db) {
    console.warn('Firestore not initialized')
    return () => {}
  }

  try {
    const docRef = doc(db, collectionName, docId)
    return onSnapshot(
      docRef,
      (doc) => {
        callback(doc.exists() ? { id: doc.id, ...doc.data() } : null)
      },
      (error) => {
        console.error(`Error in real-time subscription for document ${docId}:`, error)
      }
    )
  } catch (error) {
    console.error(`Error subscribing to document ${docId}:`, error)
    return () => {}
  }
}

/**
 * Batch write multiple documents
 * @param {Array} operations - Array of {type: 'set'|'update'|'delete', collection, id, data}
 * @returns {Promise<boolean>} Success status
 */
export async function batchWrite(operations) {
  if (!db) {
    console.warn('Firestore not initialized')
    return false
  }

  try {
    const batch = writeBatch(db)

    operations.forEach(({ type, collection: collectionName, id, data }) => {
      const docRef = doc(db, collectionName, id)
      
      switch (type) {
        case 'set':
          batch.set(docRef, { ...data, updatedAt: serverTimestamp() })
          break
        case 'update':
          batch.update(docRef, { ...data, updatedAt: serverTimestamp() })
          break
        case 'delete':
          batch.delete(docRef)
          break
        default:
          console.warn(`Unknown batch operation type: ${type}`)
      }
    })

    await batch.commit()
    return true
  } catch (error) {
    console.error('Error in batch write:', error)
    return false
  }
}

// ============================================================
// SPECIFIC COLLECTION HELPERS
// ============================================================

/**
 * Portfolio operations
 */
export const portfolioService = {
  getAll: () => getCollection(COLLECTIONS.PORTFOLIO),
  get: (id) => getDocument(COLLECTIONS.PORTFOLIO, id),
  set: (id, data) => setDocument(COLLECTIONS.PORTFOLIO, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.PORTFOLIO, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.PORTFOLIO, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.PORTFOLIO, callback),
}

/**
 * Categories operations
 */
export const categoriesService = {
  get: () => getDocument(COLLECTIONS.CATEGORIES, 'list'),
  set: (data) => setDocument(COLLECTIONS.CATEGORIES, 'list', data),
  subscribe: (callback) => subscribeToDocument(COLLECTIONS.CATEGORIES, 'list', callback),
}

/**
 * Category Images operations
 */
export const categoryImagesService = {
  getAll: () => getCollection(COLLECTIONS.CATEGORY_IMAGES),
  get: (category) => getDocument(COLLECTIONS.CATEGORY_IMAGES, category),
  set: (category, data) => setDocument(COLLECTIONS.CATEGORY_IMAGES, category, data),
  delete: (category) => deleteDocument(COLLECTIONS.CATEGORY_IMAGES, category),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.CATEGORY_IMAGES, callback),
}

/**
 * About data operations
 */
export const aboutService = {
  get: () => getDocument(COLLECTIONS.ABOUT, 'data'),
  set: (data) => setDocument(COLLECTIONS.ABOUT, 'data', data),
  subscribe: (callback) => subscribeToDocument(COLLECTIONS.ABOUT, 'data', callback),
}

/**
 * YouTube videos operations
 */
export const youtubeService = {
  getAll: () => getCollection(COLLECTIONS.YOUTUBE),
  get: (id) => getDocument(COLLECTIONS.YOUTUBE, id),
  set: (id, data) => setDocument(COLLECTIONS.YOUTUBE, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.YOUTUBE, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.YOUTUBE, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.YOUTUBE, callback),
}

/**
 * Services operations
 */
export const servicesService = {
  getAll: () => getCollection(COLLECTIONS.SERVICES),
  get: (id) => getDocument(COLLECTIONS.SERVICES, id),
  set: (id, data) => setDocument(COLLECTIONS.SERVICES, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.SERVICES, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.SERVICES, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.SERVICES, callback),
}

/**
 * Testimonials operations
 */
export const testimonialsService = {
  getAll: () => getCollection(COLLECTIONS.TESTIMONIALS),
  get: (id) => getDocument(COLLECTIONS.TESTIMONIALS, id),
  set: (id, data) => setDocument(COLLECTIONS.TESTIMONIALS, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.TESTIMONIALS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.TESTIMONIALS, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.TESTIMONIALS, callback),
}

/**
 * Inquiries operations
 */
export const inquiriesService = {
  getAll: () => getCollection(COLLECTIONS.INQUIRIES),
  get: (id) => getDocument(COLLECTIONS.INQUIRIES, id),
  set: (id, data) => setDocument(COLLECTIONS.INQUIRIES, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.INQUIRIES, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.INQUIRIES, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.INQUIRIES, callback),
}

/**
 * Hero photos operations
 */
export const heroPhotosService = {
  getAll: () => getCollection(COLLECTIONS.HERO_PHOTOS),
  get: (id) => getDocument(COLLECTIONS.HERO_PHOTOS, id),
  set: (id, data) => setDocument(COLLECTIONS.HERO_PHOTOS, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.HERO_PHOTOS, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.HERO_PHOTOS, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.HERO_PHOTOS, callback),
}

/**
 * Gallery operations
 */
export const galleryService = {
  getAll: () => getCollection(COLLECTIONS.GALLERY),
  get: (id) => getDocument(COLLECTIONS.GALLERY, id),
  set: (id, data) => setDocument(COLLECTIONS.GALLERY, id, data),
  update: (id, data) => updateDocument(COLLECTIONS.GALLERY, id, data),
  delete: (id) => deleteDocument(COLLECTIONS.GALLERY, id),
  subscribe: (callback) => subscribeToCollection(COLLECTIONS.GALLERY, callback),
}

export { COLLECTIONS }
