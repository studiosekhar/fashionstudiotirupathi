import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
import './YouTubePage.css'

// Extract YouTube video ID from any YouTube URL format
function getYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export default function YouTubePage() {
  const { youtubeVideos } = useStudio()

  return (
    <div className="yt-page">
      <Navbar />

      {/* Hero */}
      <section className="yt-hero">
        <div className="yt-hero-inner">
          <span className="yt-hero-label">OUR CHANNEL</span>
          <h1 className="yt-hero-title">
            <span className="yt-title-light">YOUTUBE</span>
            <span className="yt-title-bold">VIDEOS</span>
          </h1>
          <div className="yt-hero-rule" />
        </div>
      </section>

      {/* Grid */}
      <section className="yt-grid-section">
        {youtubeVideos && youtubeVideos.length > 0 ? (
          <div className="yt-grid">
            {youtubeVideos.map(video => {
              const videoId = getYouTubeId(video.url)
              if (!videoId) return null
              return (
                <div key={video.id} className="yt-card">
                  <div className="yt-iframe-wrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={video.title || 'YouTube video'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {video.title && (
                    <div className="yt-card-info">
                      <h3>{video.title}</h3>
                      {video.description && <p>{video.description}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="yt-empty">
            <span className="yt-empty-icon">▶</span>
            <p>No videos added yet.</p>
            <span>Check back soon or add videos from the admin panel.</span>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="yt-footer">
        <p>© {new Date().getFullYear()} Fashion Studio · All rights reserved</p>
        <Link to="/" className="yt-footer-link">Back to Home</Link>
      </footer>
    </div>
  )
}
