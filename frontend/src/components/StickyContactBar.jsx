import './StickyContactBar.css'

export default function StickyContactBar() {
  const phoneNumber = "+919848078999"
  const whatsappNumber = "919848078999"

  return (
    <div className="sticky-contact-bar">
      <div className="sticky-contact-content">
        <div className="contact-bar-info">
          <span className="contact-bar-label">Need Help?</span>
          <span className="contact-bar-text">📱 +91 98480 78999</span>
          <span className="contact-bar-divider">|</span>
          <span className="contact-bar-text">📧 hello@fashionstudio.com</span>
          <span className="contact-bar-divider">|</span>
          <span className="contact-bar-text">📍 Tirupati, Andhra Pradesh</span>
        </div>
        <div className="contact-bar-buttons">
          <a 
            href={`tel:${phoneNumber}`} 
            className="contact-bar-btn phone-btn"
            aria-label="Call us"
          >
            <span className="btn-icon">📞</span>
            <span className="btn-text">Call Now</span>
          </a>
          <a 
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="contact-bar-btn whatsapp-btn"
            aria-label="WhatsApp us"
          >
            <span className="btn-icon">💬</span>
            <span className="btn-text">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
