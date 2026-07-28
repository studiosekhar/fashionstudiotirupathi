import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import DomeGallery from './components/DomeGallery'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SocialSwipe from './components/SocialSwipe'
import StickyContactBar from './components/StickyContactBar'
import AdminPage from './pages/AdminPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'
import './App.css'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialSwipe />
      <Services />
      <Portfolio />
      <DomeGallery />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
      <StickyContactBar />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

export default App
