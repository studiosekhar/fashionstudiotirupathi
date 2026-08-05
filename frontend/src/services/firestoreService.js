/**
 * Firestore service layer
 * Replaces supabaseService.js — all collections stored in Firestore.
 * Falls back gracefully if db is not initialised.
 */

import {
  collection, doc, getDocs, setDoc, deleteDoc,
  onSnapshot, orderBy, query, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebaseConfig'

// ─── helpers ──────────────────────────────────────────────────────────────────

function colRef(name) { return collection(db, name) }
function docRef(name, id) { return doc(db, name, String(id)) }

// Convert Firestore snapshot to plain array
function snapToArray(snapshot) {
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────

export const portfolioService = {
  async getAll() {
    try {
      const q = query(colRef('portfolio'), orderBy('created_at', 'asc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('portfolio.getAll:', e); return null }
  },

  async upsert(item) {
    try {
      await setDoc(docRef('portfolio', item.id), { ...item, created_at: item.created_at ?? serverTimestamp() }, { merge: true })
    } catch (e) { console.error('portfolio.upsert:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('portfolio', id)) }
    catch (e) { console.error('portfolio.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('portfolio'), orderBy('created_at', 'asc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('portfolio.sub:', e))
  },
}

// ─── PORTFOLIO CATEGORIES ─────────────────────────────────────────────────────

export const categoriesService = {
  async get() {
    try {
      const snap = await getDocs(colRef('portfolio_categories'))
      if (snap.empty) return null
      return snap.docs[0].data().categories ?? null
    } catch (e) { console.error('categories.get:', e); return null }
  },

  async set(categories) {
    try {
      await setDoc(doc(db, 'portfolio_categories', 'main'), { categories })
    } catch (e) { console.error('categories.set:', e) }
  },

  subscribe(callback) {
    return onSnapshot(doc(db, 'portfolio_categories', 'main'),
      snap => { if (snap.exists()) callback(snap.data().categories) },
      e => console.error('categories.sub:', e))
  },
}

// ─── CATEGORY IMAGES ──────────────────────────────────────────────────────────

export const categoryImagesService = {
  async get() {
    try {
      const snap = await getDocs(colRef('category_images'))
      if (snap.empty) return null
      return snap.docs[0].data().images ?? null
    } catch (e) { console.error('categoryImages.get:', e); return null }
  },

  async set(images) {
    try {
      await setDoc(doc(db, 'category_images', 'main'), { images })
    } catch (e) { console.error('categoryImages.set:', e) }
  },

  subscribe(callback) {
    return onSnapshot(doc(db, 'category_images', 'main'),
      snap => { if (snap.exists()) callback(snap.data().images) },
      e => console.error('categoryImages.sub:', e))
  },
}

// ─── ABOUT DATA ───────────────────────────────────────────────────────────────

export const aboutService = {
  async get() {
    try {
      const snap = await getDocs(colRef('about_data'))
      if (snap.empty) return null
      return snap.docs[0].data().data ?? null
    } catch (e) { console.error('about.get:', e); return null }
  },

  async set(aboutData) {
    try {
      await setDoc(doc(db, 'about_data', 'main'), { data: aboutData })
    } catch (e) { console.error('about.set:', e) }
  },

  subscribe(callback) {
    return onSnapshot(doc(db, 'about_data', 'main'),
      snap => { if (snap.exists()) callback(snap.data().data) },
      e => console.error('about.sub:', e))
  },
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

export const servicesService = {
  async getAll() {
    try {
      const q = query(colRef('services'), orderBy('created_at', 'asc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('services.getAll:', e); return null }
  },

  async upsert(item) {
    try {
      await setDoc(docRef('services', item.id), { ...item, created_at: item.created_at ?? serverTimestamp() }, { merge: true })
    } catch (e) { console.error('services.upsert:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('services', id)) }
    catch (e) { console.error('services.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('services'), orderBy('created_at', 'asc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('services.sub:', e))
  },
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const testimonialsService = {
  async getAll() {
    try {
      const q = query(colRef('testimonials'), orderBy('created_at', 'asc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('testimonials.getAll:', e); return null }
  },

  async upsert(item) {
    try {
      await setDoc(docRef('testimonials', item.id), { ...item, created_at: item.created_at ?? serverTimestamp() }, { merge: true })
    } catch (e) { console.error('testimonials.upsert:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('testimonials', id)) }
    catch (e) { console.error('testimonials.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('testimonials'), orderBy('created_at', 'asc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('testimonials.sub:', e))
  },
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

export const inquiriesService = {
  async getAll() {
    try {
      const q = query(colRef('inquiries'), orderBy('created_at', 'desc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('inquiries.getAll:', e); return null }
  },

  async insert(item) {
    try {
      const id = String(Date.now())
      await setDoc(doc(db, 'inquiries', id), { ...item, created_at: serverTimestamp() })
    } catch (e) { console.error('inquiries.insert:', e) }
  },

  async update(id, changes) {
    try { await setDoc(docRef('inquiries', id), changes, { merge: true }) }
    catch (e) { console.error('inquiries.update:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('inquiries', id)) }
    catch (e) { console.error('inquiries.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('inquiries'), orderBy('created_at', 'desc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('inquiries.sub:', e))
  },
}

// ─── HERO PHOTOS ──────────────────────────────────────────────────────────────

export const heroPhotosService = {
  async getAll() {
    try {
      const q = query(colRef('hero_photos'), orderBy('created_at', 'asc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('heroPhotos.getAll:', e); return null }
  },

  async upsert(item) {
    try {
      await setDoc(docRef('hero_photos', item.id), { ...item, created_at: item.created_at ?? serverTimestamp() }, { merge: true })
    } catch (e) { console.error('heroPhotos.upsert:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('hero_photos', id)) }
    catch (e) { console.error('heroPhotos.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('hero_photos'), orderBy('created_at', 'asc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('heroPhotos.sub:', e))
  },
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

export const galleryService = {
  async getAll() {
    try {
      const q = query(colRef('gallery'), orderBy('created_at', 'asc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('gallery.getAll:', e); return null }
  },

  async upsert(item) {
    try {
      await setDoc(docRef('gallery', item.id), { ...item, created_at: item.created_at ?? serverTimestamp() }, { merge: true })
    } catch (e) { console.error('gallery.upsert:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('gallery', id)) }
    catch (e) { console.error('gallery.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('gallery'), orderBy('created_at', 'asc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('gallery.sub:', e))
  },
}

// ─── YOUTUBE VIDEOS ───────────────────────────────────────────────────────────

export const youtubeService = {
  async getAll() {
    try {
      const q = query(colRef('youtube_videos'), orderBy('created_at', 'desc'))
      const snap = await getDocs(q)
      return snapToArray(snap)
    } catch (e) { console.error('youtube.getAll:', e); return null }
  },

  async upsert(item) {
    try {
      await setDoc(docRef('youtube_videos', item.id), { ...item, created_at: item.created_at ?? serverTimestamp() }, { merge: true })
    } catch (e) { console.error('youtube.upsert:', e) }
  },

  async remove(id) {
    try { await deleteDoc(docRef('youtube_videos', id)) }
    catch (e) { console.error('youtube.remove:', e) }
  },

  subscribe(callback) {
    const q = query(colRef('youtube_videos'), orderBy('created_at', 'desc'))
    return onSnapshot(q, snap => callback(snapToArray(snap)), e => console.error('youtube.sub:', e))
  },
}
