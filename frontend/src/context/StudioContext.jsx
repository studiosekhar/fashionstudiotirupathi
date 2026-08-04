import { createContext, useContext, useState, useEffect } from 'react'
import {
  portfolioService,
  categoriesService,
  categoryImagesService,
  aboutService,
  youtubeService,
  servicesService,
  testimonialsService,
  inquiriesService,
  heroPhotosService,
  galleryService,
} from '../services/firestoreService'
import { db } from '../config/firebaseConfig'

const StudioContext = createContext()

const DEFAULT_PORTFOLIO_CATEGORIES = [
  'All',
  'Wedding',
  'Pre-Wedding',
  'Engagement',
  'Haldi',
  'Reception',
  'Birthday',
  'Newborn',
]

const DEFAULT_CATEGORY_IMAGES = {
  'All': null,
  'Wedding': null,
  'Pre-Wedding': null,
  'Engagement': null,
  'Haldi': null,
  'Reception': null,
  'Birthday': null,
  'Newborn': null,
}

const DEFAULT_ABOUT_DATA = {
  name: "I'm Sekhar",
  description: "I'm a candid wedding and portrait photographer based in Tirupati. I love capturing raw emotions, genuine smiles, quiet in-between moments, and the beautiful chaos that makes every story unique. From dreamy pre-wedding shoots and timeless wedding celebrations to newborn memories, maternity sessions, birthdays, couple shoots, and milestone moments — I believe every chapter of life deserves to be preserved with warmth, emotion, and elegance.",
  weddingsShot: '500',
  yearsExperience: '25',
  happyMemories: '300k',
  photo: null
}

const DEFAULT_YOUTUBE_VIDEOS = []

const DEFAULT_PORTFOLIO = [
  { id: 1, title: 'Fashion Week 2026', category: 'Wedding', url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=600&fit=crop', tall: true },
  { id: 2, title: 'Romantic Wedding',  category: 'Wedding',   url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=600&fit=crop', wide: true },
  { id: 3, title: 'Bridal Elegance',   category: 'Pre-Wedding',  url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop' },
  { id: 4, title: 'Haute Couture',     category: 'Engagement',   url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop' },
  { id: 5, title: 'Ceremony Moments',  category: 'Wedding',   url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop', wide: true },
]

const DEFAULT_SERVICES = [
  { id: 1, icon: '01', title: 'Editorial Photography', description: 'Magazine-quality shoots with world-class styling and creative direction for fashion brands and publications.' },
  { id: 2, icon: '02', title: 'Commercial Campaigns',  description: 'Full-scale production for advertising campaigns that captivate audiences and drive brand recognition.' },
  { id: 3, icon: '03', title: 'Luxury Portraits',      description: 'Exclusive portrait sessions for executives, celebrities, and discerning individuals seeking timeless imagery.' },
  { id: 4, icon: '04', title: 'Brand Identity',        description: "Comprehensive visual storytelling to establish and elevate your brand's aesthetic presence." },
]

const DEFAULT_TESTIMONIALS = [
  { id: 1, author: 'Alexandra Chen', role: 'Creative Director, Luxe Magazine',  text: 'Fashion Studio transformed our brand identity with their exceptional vision. The attention to detail and creative excellence is unmatched.' },
  { id: 2, author: 'Marcus Dubois',  role: 'CEO, Maison Élégance',              text: 'Working with this team was an absolute pleasure. They captured the essence of our collection in ways we never imagined possible.' },
  { id: 3, author: 'Sofia Rossi',    role: 'Brand Manager, Bellezza Cosmetics', text: 'The professionalism and artistry displayed throughout our campaign exceeded all expectations. True masters of their craft.' },
]

const DEFAULT_HERO_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop', alt: 'Fashion Photo 1', rotate: '3deg' },
  { id: 2, url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop', alt: 'Fashion Photo 2', rotate: '-4deg' },
  { id: 3, url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop', alt: 'Fashion Photo 3', rotate: '2deg' },
  { id: 4, url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop', alt: 'Fashion Photo 4', rotate: '-3deg' },
  { id: 5, url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', alt: 'Fashion Photo 5', rotate: '4deg' },
]

const DEFAULT_GALLERY_ITEMS = [
  { id: 1,  url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop&auto=format', text: 'Fashion Shoot' },
  { id: 2,  url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&auto=format', text: 'Editorial' },
  { id: 3,  url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop&auto=format', text: 'Runway' },
  { id: 4,  url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop&auto=format', text: 'Portrait' },
  { id: 5,  url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop&auto=format', text: 'Street Style' },
  { id: 6,  url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop&auto=format', text: 'Couture' },
  { id: 7,  url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop&auto=format', text: 'Wedding' },
  { id: 8,  url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop&auto=format', text: 'Bridal' },
  { id: 9,  url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop&auto=format', text: 'Ceremony' },
  { id: 10, url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop&auto=format', text: 'Studio' },
]

/**
 * Sync local data to Firestore (one-time migration)
 * This runs only once to migrate existing localStorage data to Firestore
 */
async function migrateLocalStorageToFirestore() {
  // Check if migration has already been done
  const migrated = localStorage.getItem('fs_migrated_to_firestore')
  if (migrated === 'true' || !db) return

  console.log('🔄 Starting migration from localStorage to Firestore...')

  try {
    // Migrate portfolio
    const localPortfolio = localStorage.getItem('fs_portfolio')
    if (localPortfolio) {
      const portfolioData = JSON.parse(localPortfolio)
      for (const item of portfolioData) {
        await portfolioService.set(String(item.id), item)
      }
      console.log('✅ Portfolio migrated')
    }

    // Migrate categories
    const localCategories = localStorage.getItem('fs_portfolio_categories')
    if (localCategories) {
      await categoriesService.set({ categories: JSON.parse(localCategories) })
      console.log('✅ Categories migrated')
    }

    // Migrate category images
    const localCategoryImages = localStorage.getItem('fs_category_images')
    if (localCategoryImages) {
      const images = JSON.parse(localCategoryImages)
      for (const [category, image] of Object.entries(images)) {
        if (image) {
          await categoryImagesService.set(category, image)
        }
      }
      console.log('✅ Category images migrated')
    }

    // Migrate about data
    const localAbout = localStorage.getItem('fs_about_data')
    if (localAbout) {
      await aboutService.set(JSON.parse(localAbout))
      console.log('✅ About data migrated')
    }

    // Migrate YouTube videos
    const localYoutube = localStorage.getItem('fs_youtube_videos')
    if (localYoutube) {
      const videos = JSON.parse(localYoutube)
      for (const video of videos) {
        await youtubeService.set(String(video.id), video)
      }
      console.log('✅ YouTube videos migrated')
    }

    // Migrate services
    const localServices = localStorage.getItem('fs_services')
    if (localServices) {
      const services = JSON.parse(localServices)
      for (const service of services) {
        await servicesService.set(String(service.id), service)
      }
      console.log('✅ Services migrated')
    }

    // Migrate testimonials
    const localTestimonials = localStorage.getItem('fs_testimonials')
    if (localTestimonials) {
      const testimonials = JSON.parse(localTestimonials)
      for (const testimonial of testimonials) {
        await testimonialsService.set(String(testimonial.id), testimonial)
      }
      console.log('✅ Testimonials migrated')
    }

    // Migrate inquiries
    const localInquiries = localStorage.getItem('fs_inquiries')
    if (localInquiries) {
      const inquiries = JSON.parse(localInquiries)
      for (const inquiry of inquiries) {
        await inquiriesService.set(String(inquiry.id), inquiry)
      }
      console.log('✅ Inquiries migrated')
    }

    // Migrate hero photos
    const localHero = localStorage.getItem('fs_hero_photos')
    if (localHero) {
      const photos = JSON.parse(localHero)
      for (const photo of photos) {
        await heroPhotosService.set(String(photo.id), photo)
      }
      console.log('✅ Hero photos migrated')
    }

    // Migrate gallery
    const localGallery = localStorage.getItem('fs_gallery_v2')
    if (localGallery) {
      const items = JSON.parse(localGallery)
      for (const item of items) {
        await galleryService.set(String(item.id), item)
      }
      console.log('✅ Gallery items migrated')
    }

    // Mark migration as complete
    localStorage.setItem('fs_migrated_to_firestore', 'true')
    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

export function StudioProvider({ children }) {
  // State with default values
  const [portfolio, setPortfolio] = useState(DEFAULT_PORTFOLIO)
  const [portfolioCategories, setPortfolioCategories] = useState(DEFAULT_PORTFOLIO_CATEGORIES)
  const [categoryImages, setCategoryImages] = useState(DEFAULT_CATEGORY_IMAGES)
  const [aboutData, setAboutData] = useState(DEFAULT_ABOUT_DATA)
  const [youtubeVideos, setYoutubeVideos] = useState(DEFAULT_YOUTUBE_VIDEOS)
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [testimonials, setTestimonials] = useState(DEFAULT_TESTIMONIALS)
  const [inquiries, setInquiries] = useState([])
  const [heroPhotos, setHeroPhotos] = useState(DEFAULT_HERO_PHOTOS)
  const [galleryItems, setGalleryItems] = useState(DEFAULT_GALLERY_ITEMS)
  const [loading, setLoading] = useState(true)

  // Initialize data from Firestore or use defaults
  useEffect(() => {
    if (!db) {
      console.warn('⚠️ Firebase not configured, using localStorage fallback')
      setLoading(false)
      return
    }

    let unsubscribers = []

    const initializeData = async () => {
      try {
        // Run migration first (only once)
        await migrateLocalStorageToFirestore()

        // Subscribe to portfolio
        const unsubPortfolio = portfolioService.subscribe((data) => {
          setPortfolio(data.length > 0 ? data : DEFAULT_PORTFOLIO)
        })
        unsubscribers.push(unsubPortfolio)

        // Subscribe to categories
        const unsubCategories = categoriesService.subscribe((data) => {
          setPortfolioCategories(data?.categories || DEFAULT_PORTFOLIO_CATEGORIES)
        })
        unsubscribers.push(unsubCategories)

        // Subscribe to category images
        const unsubCategoryImages = categoryImagesService.subscribe((data) => {
          const imagesMap = {}
          data.forEach(item => {
            imagesMap[item.id] = item
          })
          setCategoryImages({ ...DEFAULT_CATEGORY_IMAGES, ...imagesMap })
        })
        unsubscribers.push(unsubCategoryImages)

        // Subscribe to about data
        const unsubAbout = aboutService.subscribe((data) => {
          setAboutData(data || DEFAULT_ABOUT_DATA)
        })
        unsubscribers.push(unsubAbout)

        // Subscribe to YouTube videos
        const unsubYoutube = youtubeService.subscribe((data) => {
          setYoutubeVideos(data.length > 0 ? data : DEFAULT_YOUTUBE_VIDEOS)
        })
        unsubscribers.push(unsubYoutube)

        // Subscribe to services
        const unsubServices = servicesService.subscribe((data) => {
          setServices(data.length > 0 ? data : DEFAULT_SERVICES)
        })
        unsubscribers.push(unsubServices)

        // Subscribe to testimonials
        const unsubTestimonials = testimonialsService.subscribe((data) => {
          setTestimonials(data.length > 0 ? data : DEFAULT_TESTIMONIALS)
        })
        unsubscribers.push(unsubTestimonials)

        // Subscribe to inquiries
        const unsubInquiries = inquiriesService.subscribe((data) => {
          setInquiries(data)
        })
        unsubscribers.push(unsubInquiries)

        // Subscribe to hero photos
        const unsubHero = heroPhotosService.subscribe((data) => {
          setHeroPhotos(data.length > 0 ? data : DEFAULT_HERO_PHOTOS)
        })
        unsubscribers.push(unsubHero)

        // Subscribe to gallery
        const unsubGallery = galleryService.subscribe((data) => {
          setGalleryItems(data.length > 0 ? data : DEFAULT_GALLERY_ITEMS)
        })
        unsubscribers.push(unsubGallery)

        setLoading(false)
        console.log('✅ Real-time sync enabled with Firestore')
      } catch (error) {
        console.error('❌ Error initializing Firestore:', error)
        setLoading(false)
      }
    }

    initializeData()

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribers.forEach(unsub => unsub())
    }
  }, [])

  // Helper function to update portfolio
  const updatePortfolio = async (newPortfolio) => {
    if (!db) {
      setPortfolio(newPortfolio)
      return
    }

    // Firestore subscription will update the state automatically
    // We just need to save to Firestore
    for (const item of newPortfolio) {
      await portfolioService.set(String(item.id), item)
    }
  }

  // Helper function to update categories
  const updateCategories = async (newCategories) => {
    if (!db) {
      setPortfolioCategories(newCategories)
      return
    }

    await categoriesService.set({ categories: newCategories })
  }

  // Helper function to update category images
  const updateCategoryImages = async (newImages) => {
    if (!db) {
      setCategoryImages(newImages)
      return
    }

    for (const [category, image] of Object.entries(newImages)) {
      if (image) {
        await categoryImagesService.set(category, image)
      }
    }
  }

  // Helper function to update about data
  const updateAboutData = async (newData) => {
    if (!db) {
      setAboutData(newData)
      return
    }

    await aboutService.set(newData)
  }

  // Helper function to update YouTube videos
  const updateYoutubeVideos = async (newVideos) => {
    if (!db) {
      setYoutubeVideos(newVideos)
      return
    }

    for (const video of newVideos) {
      await youtubeService.set(String(video.id), video)
    }
  }

  // Helper function to update services
  const updateServices = async (newServices) => {
    if (!db) {
      setServices(newServices)
      return
    }

    for (const service of newServices) {
      await servicesService.set(String(service.id), service)
    }
  }

  // Helper function to update testimonials
  const updateTestimonials = async (newTestimonials) => {
    if (!db) {
      setTestimonials(newTestimonials)
      return
    }

    for (const testimonial of newTestimonials) {
      await testimonialsService.set(String(testimonial.id), testimonial)
    }
  }

  // Helper function to update inquiries
  const updateInquiries = async (newInquiries) => {
    if (!db) {
      setInquiries(newInquiries)
      return
    }

    for (const inquiry of newInquiries) {
      await inquiriesService.set(String(inquiry.id), inquiry)
    }
  }

  // Helper function to update hero photos
  const updateHeroPhotos = async (newPhotos) => {
    if (!db) {
      setHeroPhotos(newPhotos)
      return
    }

    for (const photo of newPhotos) {
      await heroPhotosService.set(String(photo.id), photo)
    }
  }

  // Helper function to update gallery items
  const updateGalleryItems = async (newItems) => {
    if (!db) {
      setGalleryItems(newItems)
      return
    }

    for (const item of newItems) {
      await galleryService.set(String(item.id), item)
    }
  }

  // Add inquiry function
  const addInquiry = async (data) => {
    const newInquiry = {
      id: Date.now(),
      ...data,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
    }

    if (!db) {
      setInquiries(prev => [newInquiry, ...prev])
      return
    }

    await inquiriesService.set(String(newInquiry.id), newInquiry)
  }

  return (
    <StudioContext.Provider value={{
      portfolio, setPortfolio: updatePortfolio,
      portfolioCategories, setPortfolioCategories: updateCategories,
      categoryImages, setCategoryImages: updateCategoryImages,
      aboutData, setAboutData: updateAboutData,
      youtubeVideos, setYoutubeVideos: updateYoutubeVideos,
      services, setServices: updateServices,
      testimonials, setTestimonials: updateTestimonials,
      inquiries, setInquiries: updateInquiries, addInquiry,
      heroPhotos, setHeroPhotos: updateHeroPhotos,
      galleryItems, setGalleryItems: updateGalleryItems,
      loading,
    }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  return useContext(StudioContext)
}
