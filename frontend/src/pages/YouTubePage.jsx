import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StickyContactBar from '../components/StickyContactBar'
import './YouTubePage.css'

export default function YouTubePage() {
  const { youtubeVideos } = useStudio()

  return (
    <>
      <Navbar />
      <div className="youtube-page">
        <div className="youtube-page-container">
          <div className="youtube-page-header">
            <span className="section-label">Recent Events</span>
            <h1 className="youtube-page-title">Our YouTube Channel</h1>
            <p className="youtube-page-intro">
              Explore our latest wedding films, pre-wedding shoots, and special moments captured on film.
            </p>
          </div>

          <div className="youtube-videos-grid">
            {youtubeVideos && youtubeVideos.length > 0 ? (
              youtubeVideos.map((video) => (
                <div key={video.id} className="youtube-video-card">
                  <div className="youtube-video-wrapper">
                    <iframe
                      src={video.embedUrl}
                      title={video.title || 'YouTube video'}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="youtube-iframe"
                    ></iframe>
                  </div>
                  {video.title && (
                    <div className="youtube-video-info">
                      <h3 className="youtube-video-title">{video.title}</h3>
                      {video.description && (
                        <p className="youtube-video-description">{video.description}</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="youtube-empty-state">
                <span className="empty-icon">📹</span>
                <h3>No videos yet</h3>
                <p>Check back soon for our latest wedding films and special moments!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <StickyContactBar />
    </>
  )
}
