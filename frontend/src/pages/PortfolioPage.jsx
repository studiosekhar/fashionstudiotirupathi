import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
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
    if (categoryImages[category]?.url) return categoryImages[category].url
    const photos = category === 'All' ? portfolio : portfolio.filter(p => p.category === category)
    return photos[0]?.url || null
  }

  return (
    <div className="pf-page">
      <Navbar />

      {/* ── Hero title ── */}
      <section className="pf-hero">
        <div className="pf-hero-inner">
          <span className="pf-hero-label">PORTFOLIO</span>
          <h1 className="pf-hero-title">
            <span className="pf-title-light">PORTFOLIO</span>
            <span className="pf-title-bold">FEED</span>
          </h1>
          <div className="pf-hero-border-box" />
        </div>
      </section>

      {/* ── Category circles ── */}
      <section className="pf-cats-section">
        <div className="pf-cats-scroll">
          {portfolioCategories.map(cat => {
            const img = getCategoryImage(cat)
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                className={`pf-cat-btn${isActive ? ' active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <div className="pf-cat-ring">
                  <div className="pf-cat-circle">
                    {img
                      ? <img src={img} alt={cat} />
                      : <span className="pf-cat-initial">{cat.charAt(0)}</span>
                    }
                  </div>
                </div>
                <span className="pf-cat-label">{cat.toUpperCase()}</span>
              </button>
            )
          })}
        </div>
        <div className="pf-cats-underline" />
      </section>

      {/* ── Grid ── */}
      <section className="pf-grid-section">
        {filteredPortfolio.length > 0 ? (
          <div className="pf-grid">
            {filteredPortfolio.map((item, idx) => (
              <div
                key={item.id}
                className={`pf-grid-item${item.tall ? ' tall' : ''}${item.wide ? ' wide' : ''}`}
                onClick={() => handleImageClick(idx)}
              >
                <img
                  src={item.url}
                  alt={item.title || item.category}
                  className="pf-grid-img"
                  loading="lazy"
                />
                <div className="pf-grid-overlay">
                  <h4>{item.title || item.category}</h4>
                  <span>{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="pf-empty">
            <p>No photos in this category yet.</p>
            <span>Check back soon for new additions!</span>
          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="pf-footer">
        <p>© {new Date().getFullYear()} Fashion Studio · All rights reserved</p>
        <Link to="/" className="pf-footer-link">Back to Home</Link>
      </footer>

      {/* ── Lightbox ── */}
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
