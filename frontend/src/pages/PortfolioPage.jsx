import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import Lightbox from '../components/Lightbox'
import './PortfolioPage.css'

export default function PortfolioPage() {
  const { portfolio, portfolioCategories, categoryImages } = useStudio()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filteredPortfolio = selectedCategory === 'All'
    ? portfolio
    : portfolio.filter(item => item.category === selectedCategory)

  const handleImageClick = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const getCategoryImage = (category) => {
    // Use uploaded category image if available
    if (categoryImages[category]?.url) {
      return categoryImages[category].url
    }
    
    // Fallback to first photo in that category
    const categoryPhotos = category === 'All' ? portfolio : portfolio.filter(p => p.category === category)
    return categoryPhotos[0]?.url || null
  }

  return (
    <div className="portfolio-page">
      {/* Header/Navbar */}
      <nav className="portfolio-page-nav">
        <div className="portfolio-nav-container">
          <Link to="/" className="portfolio-back-btn">
            <span>←</span> Back to Home
          </Link>
          <h1 className="portfolio-page-brand">FASHION STUDIO</h1>
          <div></div> {/* Spacer for flex layout */}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-content">
          <span className="portfolio-label">PORTFOLIO</span>
          <h1 className="portfolio-hero-title">OUR WORK</h1>
          <p className="portfolio-hero-subtitle">Capturing moments that last forever</p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="portfolio-categories-section">
        <div className="portfolio-categories-wrapper">
          {portfolioCategories.map(category => {
            const categoryImageUrl = getCategoryImage(category)
            
            return (
              <button
                key={category}
                className={`portfolio-category-card ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="category-image-circle">
                  {categoryImageUrl ? (
                    <img src={categoryImageUrl} alt={category} />
                  ) : (
                    <div className="category-placeholder">{category.charAt(0)}</div>
                  )}
                </div>
                <span className="category-label">{category.toUpperCase()}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="portfolio-grid-section">
        <div className="portfolio-container">
          {filteredPortfolio.length > 0 ? (
            <div className="portfolio-masonry-grid">
              {filteredPortfolio.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`portfolio-grid-item${item.tall ? ' tall' : ''}${item.wide ? ' wide' : ''}`}
                  onClick={() => handleImageClick(idx)}
                >
                  <img src={item.url} alt={item.title || item.category} className="portfolio-grid-img" />
                  <div className="portfolio-grid-overlay">
                    <h4>{item.title || item.category}</h4>
                    <span>{item.category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="portfolio-empty-state">
              <p>No photos in this category yet.</p>
              <p className="portfolio-empty-hint">Check back soon for new additions!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="portfolio-page-footer">
        <div className="portfolio-footer-content">
          <p>&copy; 2024 Fashion Studio. All rights reserved.</p>
          <Link to="/" className="portfolio-footer-link">Back to Home</Link>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={filteredPortfolio}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
