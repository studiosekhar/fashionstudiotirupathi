import { useState } from 'react'
import { useStudio } from '../context/StudioContext'

export default function Portfolio() {
  const { portfolio, portfolioCategories } = useStudio()
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPortfolio = selectedCategory === 'All'
    ? portfolio
    : portfolio.filter(item => item.category === selectedCategory)

  return (
    <section id="portfolio" className="portfolio">
      <div className="container-fluid">
        <div className="section-header centered">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Our Work Speaks</h2>
        </div>

        {/* Category Filters */}
        <div className="portfolio-categories">
          {portfolioCategories.map(category => (
            <button
              key={category}
              className={`portfolio-category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="category-circle">
                {portfolio.filter(p => category === 'All' || p.category === category)[0]?.url && (
                  <img
                    src={portfolio.filter(p => category === 'All' || p.category === category)[0].url}
                    alt={category}
                  />
                )}
              </span>
              <span className="category-name">{category.toUpperCase()}</span>
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredPortfolio.map((item) => (
            <div key={item.id} className={`portfolio-item${item.tall ? ' tall' : ''}${item.wide ? ' wide' : ''}`}>
              <img src={item.url} alt={item.title} className="portfolio-img" />
              <div className="portfolio-overlay">
                <h4>{item.title || item.category}</h4>
                <span>{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredPortfolio.length === 0 && (
          <div className="portfolio-empty">
            <p>No photos in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
