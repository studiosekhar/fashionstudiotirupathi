import { createContext, useContext, useState, useEffect } from 'react'
import {
  portfolioService,
  categoriesService,
  categoryImagesService,
  aboutService,
  servicesService,
  testimonialsService,
  inquiriesService,
  heroPhotosService,
  galleryService,
  youtubeService,
} from '../services/firestoreService'

const StudioContext = createContext()

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PORTFOLIO_CATEGORIES = [
  'All',
  'Wedding',
  'Pre-Wedding',
  'Engagement',
  'Newborn',
  'Maternity',
  'Half Saree',
  'Baby Photos',
  'Baby Birthday',
  'Outdoor Shoot',
]

const DEFAULT_CATEGORY_IMAGES = {
  'All': null,
  'Wedding': null,
  'Pre-Wedding': null,
  'Engagement': null,
  'Newborn': null,
  'Maternity': null,
  'Half Saree': null,
  'Baby Photos': null,
  'Baby Birthday': null,
  'Outdoor Shoot': null,
}

const DEFAULT_ABOUT_DATA = {
  name: "I'm Sekhar",
  description: "I'm a candid wedding and portrait photographer based in Tirupati. I love capturing raw emotions, genuine smiles, quiet in-between moments, and the beautiful chaos that makes every story unique. From dreamy pre-wedding shoots and timeless wedding celebrations to newborn memories, maternity sessions, birthdays, couple shoots, and milestone moments — I believe every chapter of life deserves to be preserved with warmth, emotion, and elegance.",
  weddingsShot: '500',
  yearsExperience: '25',
  happyMemories: '300k',
  photo: null,
}

const DEFAULT_YOUTUBE_VIDEOS = []

const DEFAULT_PORTFOLIO = [
  { id: 1, title: 'Fashion Week 2026',  category: 'Wedding',     url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=600&fit=crop', tall: true  },
  { id: 2, title: 'Romantic Wedding',   category: 'Wedding',     url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=600&fit=crop', wide: true  },
  { id: 3, title: 'Bridal Elegance',    category: 'Pre-Wedding', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=600&fit=crop' },
  { id: 4, title: 'Haute Couture',      category: 'Engagement',  url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop' },
  { id: 5, title: 'Ceremony Moments',   category: 'Wedding',     url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=600&fit=crop', wide: true  },
]

const DEFAULT_SERVICES = [
  { id: 1, icon: '01', title: 'Editorial Photography',  description: 'Magazine-quality shoots with world-class styling and creative direction for fashion brands and publications.' },
  { id: 2, icon: '02', title: 'Commercial Campaigns',   description: 'Full-scale production for advertising campaigns that captivate audiences and drive brand recognition.' },
  { id: 3, icon: '03', title: 'Luxury Portraits',       description: 'Exclusive portrait sessions for executives, celebrities, and discerning individuals seeking timeless imagery.' },
  { id: 4, icon: '04', title: 'Brand Identity',         description: "Comprehensive visual storytelling to establish and elevate your brand's aesthetic presence." },
]

const DEFAULT_TESTIMONIALS = [
  { id: 1, author: 'Alexandra Chen', role: 'Creative Director, Luxe Magazine',   text: 'Fashion Studio transformed our brand identity with their exceptional vision. The attention to detail and creative excellence is unmatched.' },
  { id: 2, author: 'Marcus Dubois',  role: 'CEO, Maison Élégance',               text: 'Working with this team was an absolute pleasure. They captured the essence of our collection in ways we never imagined possible.' },
  { id: 3, author: 'Sofia Rossi',    role: 'Brand Manager, Bellezza Cosmetics',  text: 'The professionalism and artistry displayed throughout our campaign exceeded all expectations. True masters of their craft.' },
]

const DEFAULT_HERO_PHOTOS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop', alt: 'Fashion Photo 1', rotate: '3deg'  },
  { id: 2, url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop', alt: 'Fashion Photo 2', rotate: '-4deg' },
  { id: 3, url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop', alt: 'Fashion Photo 3', rotate: '2deg'  },
  { id: 4, url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=400&fit=crop', alt: 'Fashion Photo 4', rotate: '-3deg' },
  { id: 5, url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', alt: 'Fashion Photo 5', rotate: '4deg'  },
]

const DEFAULT_GALLERY_ITEMS = [
  { id: 1,  url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop', text: 'Fashion Shoot'  },
  { id: 2,  url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop', text: 'Editorial'      },
  { id: 3,  url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop', text: 'Runway'         },
  { id: 4,  url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop', text: 'Portrait'       },
  { id: 5,  url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=600&fit=crop', text: 'Street Style'   },
  { id: 6,  url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&h=600&fit=crop', text: 'Couture'        },
  { id: 7,  url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800&h=600&fit=crop', text: 'Wedding'        },
  { id: 8,  url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop', text: 'Bridal'         },
  { id: 9,  url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop', text: 'Ceremony'       },
  { id: 10, url: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=600&fit=crop', text: 'Studio'         },
]

function load(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch { return fallback }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StudioProvider({ children }) {
  const [portfolio,            setPortfolioState]           = useState(() => load('fs_portfolio',            DEFAULT_PORTFOLIO))
  const [portfolioCategories,  setPortfolioCategoriesState] = useState(() => load('fs_portfolio_categories', DEFAULT_PORTFOLIO_CATEGORIES))
  const [categoryImages,       setCategoryImagesState]      = useState(() => load('fs_category_images',      DEFAULT_CATEGORY_IMAGES))
  const [aboutData,            setAboutDataState]           = useState(() => load('fs_about_data',           DEFAULT_ABOUT_DATA))
  const [services,             setServicesState]            = useState(() => load('fs_services',             DEFAULT_SERVICES))
  const [testimonials,         setTestimonialsState]        = useState(() => load('fs_testimonials',         DEFAULT_TESTIMONIALS))
  const [inquiries,            setInquiriesState]           = useState(() => load('fs_inquiries',            []))
  const [heroPhotos,           setHeroPhotosState]          = useState(() => load('fs_hero_photos',          DEFAULT_HERO_PHOTOS))
  const [galleryItems,         setGalleryItemsState]        = useState(() => load('fs_gallery_v2',           DEFAULT_GALLERY_ITEMS))
  const [youtubeVideos,        setYoutubeVideosState]        = useState(() => load('fs_youtube_videos',       DEFAULT_YOUTUBE_VIDEOS))

  // ─── Initial load from Supabase ─────────────────────────────────────────────

  useEffect(() => {
    async function loadFromSupabase() {
      const [
        remotePortfolio,
        remoteCategories,
        remoteCategoryImages,
        remoteAbout,
        remoteServices,
        remoteTestimonials,
        remoteInquiries,
        remoteHeroPhotos,
        remoteGallery,
        remoteYoutube,
      ] = await Promise.all([
        portfolioService.getAll(),
        categoriesService.get(),
        categoryImagesService.get(),
        aboutService.get(),
        servicesService.getAll(),
        testimonialsService.getAll(),
        inquiriesService.getAll(),
        heroPhotosService.getAll(),
        galleryService.getAll(),
        youtubeService.getAll(),
      ])

      if (remotePortfolio)      setPortfolioState(remotePortfolio)
      if (remoteCategories)     setPortfolioCategoriesState(remoteCategories)
      if (remoteCategoryImages) setCategoryImagesState(remoteCategoryImages)
      if (remoteAbout)          setAboutDataState(remoteAbout)
      if (remoteServices)       setServicesState(remoteServices)
      if (remoteTestimonials)   setTestimonialsState(remoteTestimonials)
      if (remoteInquiries)      setInquiriesState(remoteInquiries)
      if (remoteHeroPhotos)     setHeroPhotosState(remoteHeroPhotos)
      if (remoteGallery)        setGalleryItemsState(remoteGallery)
      if (remoteYoutube)        setYoutubeVideosState(remoteYoutube)
    }

    loadFromSupabase()
  }, [])

  // ─── Real-time subscriptions ─────────────────────────────────────────────────

  useEffect(() => {
    const unsubs = [
      portfolioService.subscribe(data     => setPortfolioState(data)),
      categoriesService.subscribe(data    => setPortfolioCategoriesState(data)),
      categoryImagesService.subscribe(data => setCategoryImagesState(data)),
      aboutService.subscribe(data         => setAboutDataState(data)),
      servicesService.subscribe(data      => setServicesState(data)),
      testimonialsService.subscribe(data  => setTestimonialsState(data)),
      inquiriesService.subscribe(data     => setInquiriesState(data)),
      heroPhotosService.subscribe(data    => setHeroPhotosState(data)),
      galleryService.subscribe(data       => setGalleryItemsState(data)),
      youtubeService.subscribe(data       => setYoutubeVideosState(data)),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [])

  // ─── Setters: write to Supabase + localStorage ───────────────────────────────

  const setPortfolio = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(portfolio)
      : valueOrUpdater
    setPortfolioState(next)
    save('fs_portfolio', next)
    // Sync to Supabase: upsert every item
    for (const item of next) await portfolioService.upsert(item)
  }

  const setPortfolioCategories = async (v) => {
    setPortfolioCategoriesState(v)
    save('fs_portfolio_categories', v)
    await categoriesService.set(v)
  }

  const setCategoryImages = async (v) => {
    setCategoryImagesState(v)
    save('fs_category_images', v)
    await categoryImagesService.set(v)
  }

  const setAboutData = async (v) => {
    setAboutDataState(v)
    save('fs_about_data', v)
    await aboutService.set(v)
  }

  const setServices = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(services)
      : valueOrUpdater
    setServicesState(next)
    save('fs_services', next)
    for (const item of next) await servicesService.upsert(item)
  }

  const setTestimonials = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(testimonials)
      : valueOrUpdater
    setTestimonialsState(next)
    save('fs_testimonials', next)
    for (const item of next) await testimonialsService.upsert(item)
  }

  const setInquiries = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(inquiries)
      : valueOrUpdater
    setInquiriesState(next)
    save('fs_inquiries', next)
    // Full replace is complex with supabase; handled via addInquiry / updateInquiry / deleteInquiry
  }

  const setHeroPhotos = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(heroPhotos)
      : valueOrUpdater
    setHeroPhotosState(next)
    save('fs_hero_photos', next)
    for (const item of next) await heroPhotosService.upsert(item)
  }

  const setGalleryItems = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(galleryItems)
      : valueOrUpdater
    setGalleryItemsState(next)
    save('fs_gallery_v2', next)
    for (const item of next) await galleryService.upsert(item)
  }

  const setYoutubeVideos = async (valueOrUpdater) => {
    const next = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(youtubeVideos)
      : valueOrUpdater
    setYoutubeVideosState(next)
    save('fs_youtube_videos', next)
    for (const item of next) await youtubeService.upsert(item)
  }

  const deleteYoutubeVideo = async (id) => {
    setYoutubeVideosState(prev => {
      const updated = prev.filter(v => v.id !== id)
      save('fs_youtube_videos', updated)
      return updated
    })
    await youtubeService.remove(id)
  }

  // ─── Granular helpers used by admin panels ───────────────────────────────────

  const addInquiry = async (data) => {
    const newInquiry = {
      ...data,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
    }
    // Insert into Supabase (id auto-assigned by DB)
    await inquiriesService.insert(newInquiry)
    // Optimistic local update
    const withId = { id: Date.now(), ...newInquiry }
    setInquiriesState(prev => {
      const updated = [withId, ...prev]
      save('fs_inquiries', updated)
      return updated
    })
  }

  const updateInquiryStatus = async (id, status) => {
    setInquiriesState(prev => prev.map(i => i.id === id ? { ...i, status } : i))
    await inquiriesService.update(id, { status })
  }

  const deleteInquiry = async (id) => {
    setInquiriesState(prev => {
      const updated = prev.filter(i => i.id !== id)
      save('fs_inquiries', updated)
      return updated
    })
    await inquiriesService.remove(id)
  }

  const deletePortfolioItem = async (id) => {
    setPortfolioState(prev => {
      const updated = prev.filter(p => p.id !== id)
      save('fs_portfolio', updated)
      return updated
    })
    await portfolioService.remove(id)
  }

  const deleteService = async (id) => {
    setServicesState(prev => {
      const updated = prev.filter(s => s.id !== id)
      save('fs_services', updated)
      return updated
    })
    await servicesService.remove(id)
  }

  const deleteTestimonial = async (id) => {
    setTestimonialsState(prev => {
      const updated = prev.filter(t => t.id !== id)
      save('fs_testimonials', updated)
      return updated
    })
    await testimonialsService.remove(id)
  }

  const deleteHeroPhoto = async (id) => {
    setHeroPhotosState(prev => {
      const updated = prev.filter(p => p.id !== id)
      save('fs_hero_photos', updated)
      return updated
    })
    await heroPhotosService.remove(id)
  }

  const deleteGalleryItem = async (id) => {
    setGalleryItemsState(prev => {
      const updated = prev.filter(g => g.id !== id)
      save('fs_gallery_v2', updated)
      return updated
    })
    await galleryService.remove(id)
  }

  return (
    <StudioContext.Provider value={{
      portfolio,           setPortfolio,           deletePortfolioItem,
      portfolioCategories, setPortfolioCategories,
      categoryImages,      setCategoryImages,
      aboutData,           setAboutData,
      services,            setServices,             deleteService,
      testimonials,        setTestimonials,         deleteTestimonial,
      inquiries,           setInquiries,            addInquiry,
                                                    updateInquiryStatus,
                                                    deleteInquiry,
      heroPhotos,          setHeroPhotos,           deleteHeroPhoto,
      galleryItems,        setGalleryItems,         deleteGalleryItem,
      youtubeVideos,       setYoutubeVideos,        deleteYoutubeVideo,
    }}>
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  return useContext(StudioContext)
}
