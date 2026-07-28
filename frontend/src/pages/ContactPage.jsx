import { useState } from 'react'
import { useStudio } from '../context/StudioContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StickyContactBar from '../components/StickyContactBar'
import './ContactPage.css'

export default function ContactPage() {
  const { addInquiry } = useStudio()
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    service: '', 
    message: '' 
  })
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
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <>
      <Navbar />
      <div className="contact-page">
      <div className="contact-page-container">
        <div className="contact-page-header">
          <span className="section-label">Get In Touch</span>
          <h1 className="contact-page-title">Let's Create Something Extraordinary</h1>
          <p className="contact-page-intro">
            Ready to elevate your brand with world-class photography? 
            Our team is here to bring your vision to life.
          </p>
        </div>

        <div className="contact-page-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="contact-form-wrapper">
              <div className="contact-form-header">
                <div className="traffic-lights">
                  <span className="light red"></span>
                  <span className="light yellow"></span>
                  <span className="light green"></span>
                </div>
              </div>
              {submitted ? (
                <div className="form-success">
                  <div className="form-success-icon">✓</div>
                  <h3>Message Sent!</h3>
                  <p>We'll get back to you shortly.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Your Name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      name="email" 
                      placeholder="Email Address" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="tel" 
                      name="phone" 
                      placeholder="Phone Number" 
                      value={formData.phone} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      name="service" 
                      value={formData.service} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Select Service</option>
                      <option value="Editorial Photography">Editorial Photography</option>
                      <option value="Commercial Campaign">Commercial Campaign</option>
                      <option value="Luxury Portrait">Luxury Portrait</option>
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Wedding">Wedding</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea 
                      name="message" 
                      placeholder="Tell us about your project" 
                      rows="5" 
                      value={formData.message} 
                      onChange={handleChange} 
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info & Map */}
          <div className="contact-info-section">
            <div className="contact-details-card">
              <h3>Contact Information</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email</h4>
                    <p>hello@fashionstudio.com</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📱</div>
                  <div>
                    <h4>Phone</h4>
                    <p>+91 98480 78999</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div>
                    <h4>Studio Address</h4>
                    <p>Tirupati, Andhra Pradesh, India</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="contact-socials">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="https://www.instagram.com/fashion_studio_tirupati" target="_blank" rel="noreferrer" className="social-link">
                    Instagram
                  </a>
                  <a href="https://www.facebook.com/fashiostudios" target="_blank" rel="noreferrer" className="social-link">
                    Facebook
                  </a>
                  <a href="https://youtube.com/@fashionstudiosekhar6276" target="_blank" rel="noreferrer" className="social-link">
                    YouTube
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62091.36899724595!2d79.38191857431639!3d13.628719299999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4d4b0f88220c91%3A0x92f7869d4e6b9ffe!2sTirupati%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Fashion Studio Location"
              ></iframe>
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
