import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StickyContactBar from '../components/StickyContactBar'
import './AboutPage.css'

export default function AboutPage() {
  const { aboutData } = useStudio()

  return (
    <>
      <Navbar />
      <div className="about-page">
        <div className="about-page-container">
          <div className="about-page-header">
            <span className="section-label">About Us</span>
            <h1 className="about-page-title">Meet Our Team</h1>
          </div>

          <div className="about-page-content">
            {/* Photo Section */}
            <div className="about-photo-section">
              {aboutData.photo ? (
                <img
                  src={aboutData.photo.url}
                  alt={aboutData.name || 'Studio'}
                  className="about-main-photo"
                />
              ) : (
                <div className="about-photo-placeholder">
                  <span className="placeholder-icon">📸</span>
                  <p>No photo uploaded yet</p>
                </div>
              )}
            </div>

            {/* Text Section */}
            <div className="about-text-section">
              <h2 className="about-name">
                {aboutData.name || "I'm Sekhar"}
              </h2>
              <p className="about-description">
                {aboutData.description || 
                  "Passionate photographer specializing in fashion, portraits, and weddings. With years of experience capturing life's precious moments, I bring creativity and professionalism to every shoot."}
              </p>

              {/* Stats */}
              <div className="about-stats">
                <div className="stat-item">
                  <h3>{aboutData.weddingsShot || '500'}+</h3>
                  <p>Weddings Shot</p>
                </div>
                <div className="stat-item">
                  <h3>{aboutData.yearsExperience || '10'}+</h3>
                  <p>Years Experience</p>
                </div>
                <div className="stat-item">
                  <h3>{aboutData.happyMemories || '1000'}+</h3>
                  <p>Happy Memories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <StickyContactBar />
    </>
  )
}
