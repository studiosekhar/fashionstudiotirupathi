import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import Lightbox from './Lightbox'
import './HomePortfolio.css'

export default function HomePortfolio() {
  const { portfolio } = useStudio()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Show only latest 8 photos
  const latestPhotos = [...portfolio]
    .sort((a, b) => b.id - a.id)
    .slice(0, 8)

  const handleImageClick = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  if (latestPhotos.length === 0) return null

  return (
    <section id="portfolio" className="home-portfolio">
      <div className="home-portfolio-container">
        {/* Section Header */}
        <div className="home-portfolio-header">
          <span className="section-label">LATEST WORK</span>
          <h2 className="section-title">Our Portfolio</h2>
          <p className="section-subtitle">
            A glimpse of our most recent captures
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="home-portfolio-grid">
          {latestPhotos.map((item, idx) => (
            <div 
              key={item.id} 
              className="home-portfolio-item"
              onClick={() => handleImageClick(idx)}
            >
              <img 
                src={item.url} 
                alt={item.title || item.category} 
                className="home-portfolio-img"
                loading="lazy"
              />
              <div className="home-portfolio-overlay">
                <h4>{item.title || item.category}</h4>
                <span>{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="home-portfolio-footer">
          <Link to="/portfolio" className="view-all-btn">
            View Full Portfolio
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={latestPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  )
}
