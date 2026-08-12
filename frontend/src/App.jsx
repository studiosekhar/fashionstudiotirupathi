import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import DomeGallery from './components/DomeGallery'
import HomePortfolio from './components/HomePortfolio'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SocialSwipe from './components/SocialSwipe'
import './App.css'

// Lazy load heavy pages
const AdminPage = lazy(() => import('./pages/AdminPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const YouTubePage = lazy(() => import('./pages/YouTubePage'))

// Loading fallback
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '100vh',
    fontSize: '1.5rem',
    color: '#666'
  }}>
    Loading...
  </div>
)

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SocialSwipe />
      <Services />
      <DomeGallery />
      <HomePortfolio />
      <About />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={
          <Suspense fallback={<PageLoader />}>
            <PortfolioPage />
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<PageLoader />}>
            <AboutPage />
          </Suspense>
        } />
        <Route path="/youtube" element={
          <Suspense fallback={<PageLoader />}>
            <YouTubePage />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<PageLoader />}>
            <ContactPage />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<PageLoader />}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="/admin/*" element={
          <Suspense fallback={<PageLoader />}>
            <AdminPage />
          </Suspense>
        } />
      </Routes>
    </Router>
  )
}

export default App
