import { useEffect, useState } from 'react'
import './Lightbox.css'

export default function Lightbox({ images, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  useEffect(() => {
    setIndex(currentIndex)
  }, [currentIndex])

  const goToNext = () => {
    setIndex((prev) => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) goToNext()
    if (isRightSwipe) goToPrevious()
  }

  const currentImage = images[index]

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Previous Button */}
        {images.length > 1 && (
          <button className="lightbox-nav lightbox-nav-prev" onClick={goToPrevious} aria-label="Previous">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Image */}
        <div 
          className="lightbox-image-wrapper"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img 
            src={currentImage.url} 
            alt={currentImage.title || currentImage.category} 
            className="lightbox-image"
          />
          
          {/* Image Info */}
          <div className="lightbox-info">
            <h3 className="lightbox-title">{currentImage.title || currentImage.category}</h3>
            <p className="lightbox-category">{currentImage.category}</p>
            <p className="lightbox-counter">{index + 1} / {images.length}</p>
          </div>
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button className="lightbox-nav lightbox-nav-next" onClick={goToNext} aria-label="Next">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
