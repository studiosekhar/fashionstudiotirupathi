import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import './AboutPage.css'

export default function AboutPage() {
  const { aboutData } = useStudio()

  return (
    <div className="about-page">
      {/* Fixed Navbar */}
      <nav className="about-page-nav">
        <div className="about-nav-container">
          <Link to="/" className="about-back-btn">
            <span>←</span> Back to Home
          </Link>
          <h1 className="about-page-brand">FASHION STUDIO</h1>
          <div></div>
        </div>
      </nav>

      {/* About Content */}
      <section className="about-content-section">
        <div className="about-container">
          {/* Photo */}
          <div className="about-photo-wrapper">
            {aboutData?.photo?.url ? (
              <img src={aboutData.photo.url} alt="About Us" className="about-photo" />
            ) : (
              <div className="about-photo-placeholder">
                <span>📷</span>
                <p>No photo uploaded yet</p>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="about-text-wrapper">
            <span className="about-label">FASHION PHOTOGRAPHY · TIRUPATI</span>
            <h1 className="about-title">{aboutData?.name || "I'm Sekhar"}</h1>
            <div className="about-divider"></div>
            
            <p className="about-description">
              {aboutData?.description || 
                "I'm a candid wedding and portrait photographer based in Tirupati. I love capturing raw emotions, genuine smiles, quiet in-between moments, and the beautiful chaos that makes every story unique. From dreamy pre-wedding shoots and timeless wedding celebrations to newborn memories, maternity sessions, birthdays, couple shoots, and milestone moments — I believe every chapter of life deserves to be preserved with warmth, emotion, and elegance."
              }
            </p>

            {/* Stats */}
            <div className="about-stats">
              <div className="about-stat">
                <h3>{aboutData?.weddingsShot || '500'}+</h3>
                <p>WEDDINGS SHOT</p>
              </div>
              <div className="about-stat">
                <h3>{aboutData?.yearsExperience || '25'}+</h3>
                <p>YEARS EXPERIENCE</p>
              </div>
              <div className="about-stat">
                <h3>{aboutData?.happyMemories || '300k'}+</h3>
                <p>HAPPY MEMORIES</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-page-footer">
        <div className="about-footer-content">
          <p>&copy; 2024 Fashion Studio. All rights reserved.</p>
          <Link to="/" className="about-footer-link">Back to Home</Link>
        </div>
      </footer>
    </div>
  )
}
