import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
import './AboutPage.css'

export default function AboutPage() {
  const { aboutData } = useStudio()

  const name        = aboutData?.name        || "I'm Sekhar"
  const description = aboutData?.description || "I'm a candid wedding and portrait photographer based in Tirupati. I love capturing raw emotions, genuine smiles, quiet in-between moments, and the beautiful chaos that makes every story unique. From dreamy pre-wedding shoots and timeless wedding celebrations to newborn memories, maternity sessions, birthdays, couple shoots, and milestone moments — I believe every chapter of life deserves to be preserved with warmth, emotion, and elegance."
  const weddings    = aboutData?.weddingsShot    || '500'
  const years       = aboutData?.yearsExperience || '25'
  const memories    = aboutData?.happyMemories   || '300k'
  const photo       = aboutData?.photo?.url      || null

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero photo — full width */}
      {photo && (
        <div className="about-hero-photo">
          <img src={photo} alt={name} />
          <div className="about-hero-overlay" />
        </div>
      )}

      {/* Main content */}
      <section className="about-section">
        <div className="about-inner">

          {/* Left — photo (if no hero) or decorative column */}
          {!photo && (
            <div className="about-photo-col">
              <div className="about-photo-placeholder">
                <span>📷</span>
                <p>No photo uploaded yet</p>
              </div>
            </div>
          )}

          {/* Right — text */}
          <div className={`about-text-col${!photo ? '' : ' full-width'}`}>
            <span className="about-label">FASHION PHOTOGRAPHY · TIRUPATI</span>
            <h1 className="about-name">{name}</h1>
            <div className="about-rule" />
            <p className="about-bio">{description}</p>

            {/* Stats */}
            <div className="about-stats">
              <div className="about-stat">
                <strong>{weddings}+</strong>
                <span>WEDDINGS SHOT</span>
              </div>
              <div className="about-stat">
                <strong>{years}+</strong>
                <span>YEARS EXPERIENCE</span>
              </div>
              <div className="about-stat">
                <strong>{memories}+</strong>
                <span>HAPPY MEMORIES</span>
              </div>
            </div>

            <Link to="/" className="about-back-btn btn btn-secondary">← Back to Home</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Fashion Studio · All rights reserved</p>
      </footer>
    </div>
  )
}
