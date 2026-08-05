import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
import './ContactPage.css'

export default function ContactPage() {
  const { addInquiry } = useStudio()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addInquiry(formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', service: '', message: '' })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="cp-page">
      <Navbar />

      {/* Hero */}
      <section className="cp-hero">
        <div className="cp-hero-inner">
          <span className="cp-hero-label">REACH OUT</span>
          <h1 className="cp-hero-title">
            <span className="cp-title-light">CONTACT</span>
            <span className="cp-title-bold">US</span>
          </h1>
          <div className="cp-hero-rule" />
        </div>
      </section>

      {/* Main content */}
      <section className="cp-section">
        <div className="cp-inner">

          {/* Left — info */}
          <div className="cp-info">
            <span className="cp-section-label">Get In Touch</span>
            <h2 className="cp-section-title">Let's Create Something Extraordinary</h2>
            <p className="cp-section-desc">
              Ready to capture your most precious moments? Our team is here to bring your vision to life with world-class photography.
            </p>

            <div className="cp-details">
              <div className="cp-detail-item">
                <span className="cp-detail-icon">✉</span>
                <div>
                  <h4>Email</h4>
                  <p>hello@fashionstudio.com</p>
                </div>
              </div>
              <div className="cp-detail-item">
                <span className="cp-detail-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <p>+91 98480 78999</p>
                </div>
              </div>
              <div className="cp-detail-item">
                <span className="cp-detail-icon">📍</span>
                <div>
                  <h4>Studio</h4>
                  <p>Tirupati, Andhra Pradesh</p>
                </div>
              </div>
              <div className="cp-detail-item">
                <span className="cp-detail-icon">🕐</span>
                <div>
                  <h4>Working Hours</h4>
                  <p>Mon – Sat: 9 AM – 7 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="cp-form-wrapper">
            <div className="cp-form-header">
              <div className="traffic-lights">
                <span className="light red" />
                <span className="light yellow" />
                <span className="light green" />
              </div>
              <span className="cp-form-title">Send an Inquiry</span>
            </div>

            {submitted ? (
              <div className="cp-success">
                <div className="cp-success-icon">✓</div>
                <h3>Message Sent!</h3>
                <p>We'll get back to you shortly.</p>
              </div>
            ) : (
              <form className="cp-form" onSubmit={handleSubmit}>
                <div className="cp-form-row">
                  <div className="cp-form-group">
                    <label>Your Name *</label>
                    <input type="text" name="name" placeholder="Sekhar" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="cp-form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" placeholder="you@email.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="cp-form-row">
                  <div className="cp-form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="cp-form-group">
                    <label>Service *</label>
                    <select name="service" value={formData.service} onChange={handleChange} required>
                      <option value="">Select a service</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Engagement">Engagement</option>
                      <option value="Newborn">Newborn</option>
                      <option value="Maternity">Maternity</option>
                      <option value="Half Saree">Half Saree</option>
                      <option value="Baby Photos">Baby Photos</option>
                      <option value="Baby Birthday">Baby Birthday</option>
                      <option value="Outdoor Shoot">Outdoor Shoot</option>
                    </select>
                  </div>
                </div>
                <div className="cp-form-group cp-form-group--full">
                  <label>Message *</label>
                  <textarea name="message" placeholder="Tell us about your shoot — date, location, any special requests..." rows="5" value={formData.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="cp-submit-btn">Send Inquiry →</button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="cp-footer">
        <p>© {new Date().getFullYear()} Fashion Studio · All rights reserved</p>
        <Link to="/" className="cp-footer-link">Back to Home</Link>
      </footer>
    </div>
  )
}
