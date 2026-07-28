import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <ul className="nav-menu nav-left">
            <li><Link to="/about" style={{ color: '#d4af37' }}>ABOUT</Link></li>
            <li><a href="#portfolio">PORTFOLIO</a></li>
          </ul>
          <div className="logo">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=100&h=100&fit=crop"
              alt="Fashion Studio Logo"
              className="logo-img"
            />
          </div>
          <ul className="nav-menu nav-right">
            <li><a href="#services">SERVICES</a></li>
            <li><Link to="/contact" style={{ color: '#d4af37' }}>CONTACT</Link></li>
            <li><Link to="/admin" className="nav-cta">ADMIN</Link></li>
          </ul>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-inner">
          <Link to="/about" onClick={close}>About</Link>
          <a href="#portfolio" onClick={close}>Portfolio</a>
          <a href="#services"  onClick={close}>Services</a>
          <Link to="/contact" onClick={close}>Contact</Link>
          <Link to="/admin" onClick={close} className="mobile-admin-btn">Admin</Link>
        </div>
      </div>
      {menuOpen && <div className="drawer-backdrop" onClick={close} />}
    </>
  )
}
