import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setMenuOpen(false)

  // Active link style — gold if current page, white otherwise
  const linkStyle = (path) => ({
    color: location.pathname === path ? '#d4af37' : 'rgba(255,255,255,0.85)'
  })

  // HOME click: if already on home, scroll to top; otherwise navigate to /
  const handleHome = (e) => {
    e.preventDefault()
    close()
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
    }
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Left links */}
          <ul className="nav-menu nav-left">
            <li>
              <a href="/" onClick={handleHome} style={linkStyle('/')}>HOME</a>
            </li>
            <li>
              <Link to="/portfolio" style={linkStyle('/portfolio')}>PORTFOLIO</Link>
            </li>
            <li>
              <Link to="/youtube" style={linkStyle('/youtube')}>YOUTUBE</Link>
            </li>
          </ul>

          {/* Center logo — always goes home */}
          <Link to="/" className="logo" onClick={() => { close(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=100&h=100&fit=crop"
              alt="Fashion Studio Logo"
              className="logo-img"
            />
          </Link>

          {/* Right links */}
          <ul className="nav-menu nav-right">
            <li><Link to="/about" style={linkStyle('/about')}>ABOUT US</Link></li>
            <li><Link to="/contact" style={linkStyle('/contact')}>CONTACT</Link></li>
            <li><Link to="/admin" className="nav-cta">ADMIN</Link></li>
          </ul>

          {/* Hamburger */}
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
          <a href="/" onClick={handleHome} style={linkStyle('/')}>Home</a>
          <Link to="/portfolio" onClick={close} style={linkStyle('/portfolio')}>Portfolio</Link>
          <Link to="/youtube"   onClick={close} style={linkStyle('/youtube')}>YouTube</Link>
          <Link to="/about"     onClick={close} style={linkStyle('/about')}>About Us</Link>
          <Link to="/contact"   onClick={close} style={linkStyle('/contact')}>Contact</Link>
          <Link to="/admin"     onClick={close} className="mobile-admin-btn">Admin</Link>
        </div>
      </div>
      {menuOpen && <div className="drawer-backdrop" onClick={close} />}
    </>
  )
}
