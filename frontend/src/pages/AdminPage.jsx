import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudio } from '../context/StudioContext'
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary'
import './AdminPage.css'

const CREDENTIALS = {
  username: import.meta.env.VITE_ADMIN_USER,
  password: import.meta.env.VITE_ADMIN_PASS,
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('inquiries')

  const handleLogin = (e) => {
    e.preventDefault()
    if (loginData.username === CREDENTIALS.username && loginData.password === CREDENTIALS.password) {
      setLoggedIn(true)
      setLoginError('')
    } else {
      setLoginError('Invalid credentials. Try again.')
    }
  }

  if (!loggedIn) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <div className="traffic-lights">
              <span className="light red"></span>
              <span className="light yellow"></span>
              <span className="light green"></span>
            </div>
          </div>
          <div className="admin-login-body">
            <h1>FASHION STUDIO</h1>
            <p className="admin-login-sub">Admin Panel</p>
            <form onSubmit={handleLogin}>
              <div className="admin-form-group">
                <input type="text" placeholder="Username" value={loginData.username}
                  onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))} required />
              </div>
              <div className="admin-form-group">
                <input type="password" placeholder="Password" value={loginData.password}
                  onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} required />
              </div>
              {loginError && <p className="admin-error">{loginError}</p>}
              <button type="submit" className="admin-login-btn">LOGIN</button>
            </form>
            <Link to="/" className="admin-back-link">← Back to Site</Link>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'inquiries',    label: '📬 Inquiries' },
    { id: 'portfolio',    label: '📸 Portfolio' },
    { id: 'about',        label: '👤 About Us' },
    { id: 'youtube',      label: '🎬 YouTube' },
    { id: 'hero',         label: '🖼️ Hero Photos' },
    { id: 'gallery',      label: '🎠 Gallery' },
    { id: 'services',     label: '✨ Services' },
    { id: 'testimonials', label: '💬 Testimonials' },
  ]

  const titles = {
    inquiries:    'Contact Inquiries',
    portfolio:    'Portfolio Management',
    about:        'About Us Page',
    youtube:      'YouTube Videos',
    hero:         'Hero Polaroid Photos',
    gallery:      'Circular Gallery',
    services:     'Services Management',
    testimonials: 'Testimonials',
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <h2>FS Admin</h2>
          <span>Fashion Studio</span>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={() => setLoggedIn(false)}>Logout</button>
          <Link to="/" className="admin-view-site">View Site →</Link>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <h1 className="admin-page-title">{titles[activeTab]}</h1>
          <div className="admin-user-badge">👤 fsadmin</div>
        </div>
        <div className="admin-content">
          {activeTab === 'inquiries'    && <InquiriesPanel />}
          {activeTab === 'portfolio'    && <PortfolioPanel />}
          {activeTab === 'about'        && <AboutUsPanel />}
          {activeTab === 'youtube'      && <YouTubePanel />}
          {activeTab === 'hero'         && <HeroPhotosPanel />}
          {activeTab === 'gallery'      && <GalleryPanel />}
          {activeTab === 'services'     && <ServicesPanel />}
          {activeTab === 'testimonials' && <TestimonialsPanel />}
        </div>
      </main>
    </div>
  )
}

/* ─── INQUIRIES ─── */
function InquiriesPanel() {
  const { inquiries, setInquiries } = useStudio()

  const updateStatus = (id, status) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status } : i))
  }

  const deleteInquiry = (id) => {
    setInquiries(inquiries.filter(i => i.id !== id))
  }

  if (inquiries.length === 0) {
    return (
      <div className="admin-panel">
        <div className="admin-empty">
          <p>📭 No inquiries yet.</p>
          <span>When someone submits the contact form, it will appear here.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}</span>
        <span className="admin-hint">New inquiries come from the contact form on the site</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Service</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(i => (
              <tr key={i.id}>
                <td><strong>{i.name}</strong></td>
                <td>{i.email}</td>
                <td>{i.phone || '—'}</td>
                <td>{i.service}</td>
                <td className="msg-cell" title={i.message}>{i.message?.slice(0, 40)}{i.message?.length > 40 ? '…' : ''}</td>
                <td>{i.date}</td>
                <td>
                  <select
                    className={`status-select ${i.status === 'New' ? 'new' : i.status === 'Replied' ? 'replied' : 'closed'}`}
                    value={i.status}
                    onChange={e => updateStatus(i.id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>
                <td>
                  <button className="admin-delete-btn-inline" onClick={() => deleteInquiry(i.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ─── PORTFOLIO ─── */
function PortfolioPanel() {
  const { portfolio, setPortfolio, portfolioCategories, setPortfolioCategories, categoryImages, setCategoryImages } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', category: '', url: '', publicId: '', tall: false, wide: false })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false)
  const [categoryImageUploadError, setCategoryImageUploadError] = useState('')

  const openAdd = () => { setForm({ title: '', category: selectedCategory === 'All' ? '' : selectedCategory, url: '', publicId: '', tall: false, wide: false }); setEditing(null); setAdding(true) }
  const openEdit = (item) => { setForm({ title: item.title, category: item.category, url: item.url, publicId: item.publicId ?? '', tall: !!item.tall, wide: !!item.wide }); setEditing(item.id); setAdding(true) }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const { url, publicId } = await uploadToCloudinary(file)
      setForm(prev => ({ ...prev, url, publicId }))
    } catch (err) {
      setUploadError(err.message ?? 'Upload failed')
    }
    setUploading(false)
  }

  const handleCategoryImageUpload = async (e, category) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingCategoryImage(true)
    setCategoryImageUploadError('')
    try {
      const { url, publicId } = await uploadToCloudinary(file)
      
      // Delete old category image if exists
      if (categoryImages[category]?.publicId) {
        await deleteFromCloudinary(categoryImages[category].publicId)
      }
      
      setCategoryImages({
        ...categoryImages,
        [category]: { url, publicId }
      })
    } catch (err) {
      setCategoryImageUploadError(err.message ?? 'Upload failed')
    }
    setUploadingCategoryImage(false)
  }

  const handleDeleteCategoryImage = async (category) => {
    if (window.confirm(`Delete profile picture for "${category}"?`)) {
      if (categoryImages[category]?.publicId) {
        await deleteFromCloudinary(categoryImages[category].publicId)
      }
      setCategoryImages({
        ...categoryImages,
        [category]: null
      })
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setPortfolio(portfolio.map(p => p.id === editing ? { ...p, ...form } : p))
    } else {
      setPortfolio([...portfolio, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  const handleDelete = async (item) => {
    setPortfolio(portfolio.filter(p => p.id !== item.id))
    if (item.publicId) await deleteFromCloudinary(item.publicId)
    setConfirmDelete(null)
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !portfolioCategories.includes(newCategoryName.trim())) {
      const newCat = newCategoryName.trim()
      setPortfolioCategories([...portfolioCategories, newCat])
      // Initialize category image as null
      setCategoryImages({
        ...categoryImages,
        [newCat]: null
      })
      setNewCategoryName('')
      setAddingCategory(false)
    }
  }

  const handleDeleteCategory = (cat) => {
    if (cat === 'All') return
    if (window.confirm(`Delete category "${cat}"? Photos in this category will not be deleted.`)) {
      setPortfolioCategories(portfolioCategories.filter(c => c !== cat))
      
      // Delete category image if exists
      if (categoryImages[cat]?.publicId) {
        deleteFromCloudinary(categoryImages[cat].publicId)
      }
      
      // Remove from categoryImages
      const newCategoryImages = { ...categoryImages }
      delete newCategoryImages[cat]
      setCategoryImages(newCategoryImages)
      
      if (selectedCategory === cat) setSelectedCategory('All')
    }
  }

  const filteredPortfolio = selectedCategory === 'All' 
    ? portfolio 
    : portfolio.filter(p => p.category === selectedCategory)

  return (
    <div className="admin-panel">
      {/* Category Management */}
      <div className="category-manager">
        <div className="category-list">
          {portfolioCategories.map(cat => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
              {cat !== 'All' && (
                <span className="delete-cat" onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat) }}>×</span>
              )}
            </button>
          ))}
        </div>
        {addingCategory ? (
          <div className="add-category-form">
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
              autoFocus
            />
            <button onClick={handleAddCategory} className="admin-save-btn-sm">Add</button>
            <button onClick={() => { setAddingCategory(false); setNewCategoryName('') }} className="admin-cancel-btn-sm">Cancel</button>
          </div>
        ) : (
          <button className="admin-add-category-btn" onClick={() => setAddingCategory(true)}>+ Add Category</button>
        )}
      </div>

      {/* Category Profile Picture Upload */}
      {selectedCategory !== 'All' && (
        <div className="category-image-upload-section">
          <h3 className="category-image-title">Category Profile Picture - {selectedCategory}</h3>
          <p className="category-image-hint">Upload a profile picture for this category. This will appear in the circular button on the portfolio page.</p>
          
          <div className="category-image-container">
            {categoryImages[selectedCategory]?.url ? (
              <div className="category-image-preview">
                <img src={categoryImages[selectedCategory].url} alt={selectedCategory} />
                <button 
                  className="category-image-delete-btn" 
                  onClick={() => handleDeleteCategoryImage(selectedCategory)}
                  title="Delete profile picture"
                >
                  🗑
                </button>
              </div>
            ) : (
              <div className="category-image-placeholder">
                <span>{selectedCategory.charAt(0)}</span>
              </div>
            )}
            
            <div className="category-image-upload-controls">
              <label className="category-image-upload-label">
                <span>📁 {categoryImages[selectedCategory]?.url ? 'Change' : 'Upload'} Profile Picture</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleCategoryImageUpload(e, selectedCategory)} 
                  style={{ display: 'none' }} 
                  disabled={uploadingCategoryImage}
                />
              </label>
              {uploadingCategoryImage && <p className="upload-status">Uploading...</p>}
              {categoryImageUploadError && <p className="upload-error">{categoryImageUploadError}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="admin-panel-header">
        <span>{filteredPortfolio.length} items {selectedCategory !== 'All' ? `in ${selectedCategory}` : 'total'}</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Photo</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input placeholder="Title (optional)" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <select className="admin-select" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
            <option value="">Select Category</option>
            {portfolioCategories.filter(c => c !== 'All').map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="upload-section">
            <label className="upload-label">
              <span>📁 Upload from device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span className="upload-or">or</span>
            <input
              placeholder="Paste image URL"
              value={form.url.startsWith('data:') ? '(uploaded file)' : form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              className="url-input"
            />
          </div>
          <div className="form-checks">
            <label><input type="checkbox" checked={form.tall} onChange={e => setForm(p => ({ ...p, tall: e.target.checked, wide: false }))} /> Tall</label>
            <label><input type="checkbox" checked={form.wide} onChange={e => setForm(p => ({ ...p, wide: e.target.checked, tall: false }))} /> Wide</label>
          </div>
          {form.url && (
            <div className="upload-preview">
              <img src={form.url} alt="preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {uploading && <p className="upload-status">Uploading to Cloudinary...</p>}
          {uploadError && <p className="upload-error">{uploadError}</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={uploading}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Photo?</h3>
            <p>Are you sure you want to delete "{confirmDelete.title || 'this photo'}"?</p>
            <div className="confirm-dialog-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="admin-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-grid">
        {filteredPortfolio.map(item => (
          <div key={item.id} className="admin-card">
            <img src={item.url} alt={item.title} onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }} />
            <div className="admin-card-info">
              <h4>{item.title || 'Untitled'}</h4>
              <span className="admin-badge">{item.category}</span>
              {item.tall && <span className="admin-badge admin-badge--spaced">Tall</span>}
              {item.wide && <span className="admin-badge admin-badge--spaced">Wide</span>}
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(item)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setConfirmDelete(item)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── SERVICES ─── */
function ServicesPanel() {
  const { services, setServices } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ icon: '', title: '', description: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const openAdd = () => { setForm({ icon: '', title: '', description: '' }); setEditing(null); setAdding(true) }
  const openEdit = (s) => { setForm({ icon: s.icon, title: s.title, description: s.description }); setEditing(s.id); setAdding(true) }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setServices(services.map(s => s.id === editing ? { ...s, ...form } : s))
    } else {
      setServices([...services, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  const handleDelete = (item) => {
    setServices(services.filter(s => s.id !== item.id))
    setConfirmDelete(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{services.length} services</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Service</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input placeholder="Icon label (e.g. 05)" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} required />
          <input placeholder="Service Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          <textarea className="admin-textarea" placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows="3" required />
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn">{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Service?</h3>
            <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
            <div className="confirm-dialog-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="admin-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-list">
        {services.map(s => (
          <div key={s.id} className="admin-list-item">
            <div className="admin-list-icon">{s.icon}</div>
            <div className="admin-list-body">
              <h4>{s.title}</h4>
              <p>{s.description}</p>
            </div>
            <div className="admin-list-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(s)}>✏️</button>
              <button className="admin-delete-btn-inline" onClick={() => setConfirmDelete(s)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── TESTIMONIALS ─── */
function TestimonialsPanel() {
  const { testimonials, setTestimonials } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ author: '', role: '', text: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const openAdd = () => { setForm({ author: '', role: '', text: '' }); setEditing(null); setAdding(true) }
  const openEdit = (t) => { setForm({ author: t.author, role: t.role, text: t.text }); setEditing(t.id); setAdding(true) }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setTestimonials(testimonials.map(t => t.id === editing ? { ...t, ...form } : t))
    } else {
      setTestimonials([...testimonials, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  const handleDelete = (item) => {
    setTestimonials(testimonials.filter(t => t.id !== item.id))
    setConfirmDelete(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{testimonials.length} testimonials</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Testimonial</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input placeholder="Client Name" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} required />
          <input placeholder="Role / Company" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} required />
          <textarea className="admin-textarea" placeholder="Testimonial text" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows="3" required />
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn">{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Testimonial?</h3>
            <p>Are you sure you want to delete the testimonial from "{confirmDelete.author}"?</p>
            <div className="confirm-dialog-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="admin-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-list">
        {testimonials.map(t => (
          <div key={t.id} className="admin-list-item">
            <div className="admin-list-body">
              <h4>{t.author} <small>— {t.role}</small></h4>
              <p>"{t.text}"</p>
            </div>
            <div className="admin-list-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(t)}>✏️</button>
              <button className="admin-delete-btn-inline" onClick={() => setConfirmDelete(t)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── HERO PHOTOS ─── */
function HeroPhotosPanel() {
  const { heroPhotos, setHeroPhotos } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ url: '', publicId: '', alt: '', rotate: '0deg' })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const ROTATIONS = ['0deg', '3deg', '-4deg', '2deg', '-3deg', '4deg', '-2deg', '5deg', '-5deg']

  const openAdd = () => { setForm({ url: '', publicId: '', alt: '', rotate: '3deg' }); setEditing(null); setAdding(true) }
  const openEdit = (p) => { setForm({ url: p.url, publicId: p.publicId ?? '', alt: p.alt, rotate: p.rotate }); setEditing(p.id); setAdding(true) }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const { url, publicId } = await uploadToCloudinary(file)
      setForm(prev => ({ ...prev, url, publicId }))
    } catch (err) {
      setUploadError(err.message ?? 'Upload failed')
    }
    setUploading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setHeroPhotos(heroPhotos.map(p => p.id === editing ? { ...p, ...form } : p))
    } else {
      setHeroPhotos([...heroPhotos, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  const handleDelete = async (photo) => {
    setHeroPhotos(heroPhotos.filter(p => p.id !== photo.id))
    if (photo.publicId) await deleteFromCloudinary(photo.publicId)
    setConfirmDelete(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{heroPhotos.length} polaroid photos (shown on hero section)</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Photo</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <div className="upload-section">
            <label className="upload-label">
              <span>📁 Upload from device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span className="upload-or">or</span>
            <input
              placeholder="Paste image URL"
              value={form.url.startsWith('data:') ? '(uploaded file)' : form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              className="url-input"
            />
          </div>
          <input placeholder="Alt text (optional)" value={form.alt} onChange={e => setForm(p => ({ ...p, alt: e.target.value }))} />
          <select className="admin-select" value={form.rotate} onChange={e => setForm(p => ({ ...p, rotate: e.target.value }))}>
            {ROTATIONS.map(r => <option key={r} value={r}>{r} rotation</option>)}
          </select>
          {form.url && (
            <div className="upload-preview">
              <img src={form.url} alt="preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {uploading && <p className="upload-status">Uploading to Cloudinary...</p>}
          {uploadError && <p className="upload-error">{uploadError}</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={uploading}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Photo?</h3>
            <p>Are you sure you want to delete this hero photo?</p>
            <div className="confirm-dialog-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="admin-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-grid">
        {heroPhotos.map(photo => (
          <div key={photo.id} className="admin-card">
            <div className="polaroid-preview" style={{ transform: `rotate(${photo.rotate})` }}>
              <img src={photo.url} alt={photo.alt} onError={e => { e.target.src = 'https://via.placeholder.com/200?text=No+Image' }} />
            </div>
            <div className="admin-card-info">
              <h4>{photo.alt || 'Untitled'}</h4>
              <span className="admin-badge">{photo.rotate}</span>
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(photo)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setConfirmDelete(photo)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── GALLERY ─── */
function GalleryPanel() {
  const { galleryItems, setGalleryItems } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ url: '', publicId: '', text: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const openAdd = () => { setForm({ url: '', publicId: '', text: '' }); setEditing(null); setAdding(true) }
  const openEdit = (g) => { setForm({ url: g.url, publicId: g.publicId ?? '', text: g.text }); setEditing(g.id); setAdding(true) }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const { url, publicId } = await uploadToCloudinary(file)
      setForm(prev => ({ ...prev, url, publicId }))
    } catch (err) {
      setUploadError(err.message ?? 'Upload failed')
    }
    setUploading(false)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (editing) {
      setGalleryItems(galleryItems.map(g => g.id === editing ? { ...g, ...form } : g))
    } else {
      setGalleryItems([...galleryItems, { id: Date.now(), ...form }])
    }
    setAdding(false); setEditing(null)
  }

  const handleDelete = async (item) => {
    setGalleryItems(galleryItems.filter(g => g.id !== item.id))
    if (item.publicId) await deleteFromCloudinary(item.publicId)
    setConfirmDelete(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{galleryItems.length} gallery items (shown in circular gallery)</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Photo</button>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <div className="upload-section">
            <label className="upload-label">
              <span>📁 Upload from device</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <span className="upload-or">or</span>
            <input
              placeholder="Paste image URL"
              value={form.url.startsWith('data:') ? '(uploaded file)' : form.url}
              onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              className="url-input"
            />
          </div>
          <input placeholder="Label (optional)" value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} />
          {form.url && (
            <div className="upload-preview">
              <img src={form.url} alt="preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
          {uploading && <p className="upload-status">Uploading to Cloudinary...</p>}
          {uploadError && <p className="upload-error">{uploadError}</p>}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn" disabled={uploading}>{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Gallery Photo?</h3>
            <p>Are you sure you want to delete "{confirmDelete.text || 'this photo'}"?</p>
            <div className="confirm-dialog-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="admin-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-grid">
        {galleryItems.map(item => (
          <div key={item.id} className="admin-card">
            <img src={item.url} alt={item.text} onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image' }} />
            <div className="admin-card-info">
              <h4>{item.text || 'Untitled'}</h4>
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(item)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setConfirmDelete(item)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── ABOUT US ─── */
function AboutUsPanel() {
  const { aboutData, setAboutData } = useStudio()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: aboutData?.name || "I'm Sekhar",
    description: aboutData?.description || '',
    weddingsShot: aboutData?.weddingsShot || '500',
    yearsExperience: aboutData?.yearsExperience || '25',
    happyMemories: aboutData?.happyMemories || '300k',
  })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    setUploading(true)
    setUploadError('')
    try {
      const { url, publicId } = await uploadToCloudinary(file)
      
      // Delete old photo if exists
      if (aboutData?.photo?.publicId) {
        await deleteFromCloudinary(aboutData.photo.publicId)
      }
      
      setAboutData({
        ...aboutData,
        photo: { url, publicId }
      })
    } catch (err) {
      setUploadError(err.message ?? 'Upload failed')
    }
    setUploading(false)
  }

  const handleDeletePhoto = async () => {
    if (window.confirm('Delete about page photo?')) {
      if (aboutData?.photo?.publicId) {
        await deleteFromCloudinary(aboutData.photo.publicId)
      }
      setAboutData({
        ...aboutData,
        photo: null
      })
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    setAboutData({
      ...aboutData,
      ...form
    })
    setEditing(false)
  }

  const handleEdit = () => {
    setForm({
      name: aboutData?.name || "I'm Sekhar",
      description: aboutData?.description || '',
      weddingsShot: aboutData?.weddingsShot || '500',
      yearsExperience: aboutData?.yearsExperience || '25',
      happyMemories: aboutData?.happyMemories || '300k',
    })
    setEditing(true)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>About Us Page Content</span>
        <span className="admin-hint">This content appears on /about page</span>
      </div>

      {/* Photo Upload Section */}
      <div className="about-photo-section">
        <h3 className="section-heading">Profile Photo (Only 1 photo allowed)</h3>
        <div className="about-photo-container">
          {aboutData?.photo?.url ? (
            <div className="about-photo-preview">
              <img src={aboutData.photo.url} alt="About" />
              <button 
                className="about-photo-delete-btn" 
                onClick={handleDeletePhoto}
                title="Delete photo"
              >
                🗑
              </button>
            </div>
          ) : (
            <div className="about-photo-placeholder">
              <span>📷</span>
              <p>No photo uploaded</p>
            </div>
          )}
          
          <div className="about-photo-upload-controls">
            <label className="about-photo-upload-label">
              <span>📁 {aboutData?.photo?.url ? 'Change' : 'Upload'} Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                style={{ display: 'none' }} 
                disabled={uploading}
              />
            </label>
            {uploading && <p className="upload-status">Uploading...</p>}
            {uploadError && <p className="upload-error">{uploadError}</p>}
            <p className="upload-hint">Recommended: Portrait orientation, 800x1000px or larger</p>
          </div>
        </div>
      </div>

      {/* Text Content Section */}
      <div className="about-text-section">
        <h3 className="section-heading">About Content</h3>
        
        {editing ? (
          <form className="admin-add-form" onSubmit={handleSave}>
            <input 
              placeholder="Name (e.g., I'm Sekhar)" 
              value={form.name} 
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} 
              required 
            />
            <textarea 
              className="admin-textarea" 
              placeholder="Description / Bio" 
              value={form.description} 
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))} 
              rows="6" 
              required 
            />
            <div className="stats-form-grid">
              <input 
                placeholder="Weddings Shot (e.g., 500)" 
                value={form.weddingsShot} 
                onChange={e => setForm(p => ({ ...p, weddingsShot: e.target.value }))} 
                required 
              />
              <input 
                placeholder="Years Experience (e.g., 25)" 
                value={form.yearsExperience} 
                onChange={e => setForm(p => ({ ...p, yearsExperience: e.target.value }))} 
                required 
              />
              <input 
                placeholder="Happy Memories (e.g., 300k)" 
                value={form.happyMemories} 
                onChange={e => setForm(p => ({ ...p, happyMemories: e.target.value }))} 
                required 
              />
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-save-btn">Save Changes</button>
              <button type="button" className="admin-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="about-content-display">
            <div className="about-display-item">
              <label>Name:</label>
              <p>{aboutData?.name || "I'm Sekhar"}</p>
            </div>
            <div className="about-display-item">
              <label>Description:</label>
              <p>{aboutData?.description || 'No description added yet'}</p>
            </div>
            <div className="about-stats-display">
              <div className="stat-display">
                <strong>{aboutData?.weddingsShot || '500'}+</strong>
                <span>Weddings Shot</span>
              </div>
              <div className="stat-display">
                <strong>{aboutData?.yearsExperience || '25'}+</strong>
                <span>Years Experience</span>
              </div>
              <div className="stat-display">
                <strong>{aboutData?.happyMemories || '300k'}+</strong>
                <span>Happy Memories</span>
              </div>
            </div>
            <button className="admin-edit-btn" onClick={handleEdit}>✏️ Edit Content</button>
          </div>
        )}
      </div>
    </div>
  )
}


/* ─── YOUTUBE ─── */
function YouTubePanel() {
  const { youtubeVideos, setYoutubeVideos } = useStudio()
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ embedUrl: '', title: '', description: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)

  const openAdd = () => { setForm({ embedUrl: '', title: '', description: '' }); setEditing(null); setAdding(true) }
  const openEdit = (video) => { setForm({ embedUrl: video.embedUrl, title: video.title, description: video.description }); setEditing(video.id); setAdding(true) }

  const extractEmbedUrl = (input) => {
    // If it's already an embed URL, return it
    if (input.includes('/embed/')) return input
    
    // Extract video ID from various YouTube URL formats
    let videoId = null
    if (input.includes('youtu.be/')) {
      videoId = input.split('youtu.be/')[1]?.split('?')[0]
    } else if (input.includes('youtube.com/watch')) {
      const url = new URL(input)
      videoId = url.searchParams.get('v')
    } else if (input.includes('youtube.com/embed/')) {
      videoId = input.split('/embed/')[1]?.split('?')[0]
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : input
  }

  const handleSave = (e) => {
    e.preventDefault()
    const embedUrl = extractEmbedUrl(form.embedUrl)
    
    if (editing) {
      setYoutubeVideos(youtubeVideos.map(v => v.id === editing ? { ...v, ...form, embedUrl } : v))
    } else {
      setYoutubeVideos([...youtubeVideos, { id: Date.now(), ...form, embedUrl }])
    }
    setAdding(false); setEditing(null)
  }

  const handleDelete = (video) => {
    setYoutubeVideos(youtubeVideos.filter(v => v.id !== video.id))
    setConfirmDelete(null)
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <span>{youtubeVideos.length} YouTube videos</span>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Video</button>
      </div>

      <div className="admin-info-box">
        <h4>📹 How to add YouTube videos:</h4>
        <ol>
          <li>Go to your YouTube video</li>
          <li>Click "Share" → "Embed"</li>
          <li>Copy the iframe src URL (e.g., https://www.youtube.com/embed/VIDEO_ID)</li>
          <li>Or simply paste the regular YouTube video URL</li>
        </ol>
      </div>

      {adding && (
        <form className="admin-add-form" onSubmit={handleSave}>
          <input 
            placeholder="YouTube URL or Embed URL" 
            value={form.embedUrl} 
            onChange={e => setForm(p => ({ ...p, embedUrl: e.target.value }))} 
            required 
          />
          <input 
            placeholder="Title (e.g., Pravalika & Prasad | Pre-Wedding)" 
            value={form.title} 
            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} 
            required 
          />
          <textarea 
            className="admin-textarea" 
            placeholder="Description (optional)" 
            value={form.description} 
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))} 
            rows="3" 
          />
          {form.embedUrl && (
            <div className="youtube-preview">
              <p className="youtube-preview-label">Preview:</p>
              <div className="youtube-preview-wrapper">
                <iframe
                  src={extractEmbedUrl(form.embedUrl)}
                  title="YouTube preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-preview-iframe"
                ></iframe>
              </div>
            </div>
          )}
          <div className="admin-form-actions">
            <button type="submit" className="admin-save-btn">{editing ? 'Update' : 'Add'}</button>
            <button type="button" className="admin-cancel-btn" onClick={() => { setAdding(false); setEditing(null) }}>Cancel</button>
          </div>
        </form>
      )}

      {confirmDelete && (
        <div className="confirm-dialog-overlay">
          <div className="confirm-dialog">
            <h3>Delete Video?</h3>
            <p>Are you sure you want to delete "{confirmDelete.title}"?</p>
            <div className="confirm-dialog-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="admin-cancel-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="youtube-admin-grid">
        {youtubeVideos.map(video => (
          <div key={video.id} className="youtube-admin-card">
            <div className="youtube-admin-thumbnail">
              <iframe
                src={video.embedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="youtube-admin-iframe"
              ></iframe>
            </div>
            <div className="youtube-admin-info">
              <h4>{video.title}</h4>
              {video.description && <p>{video.description}</p>}
            </div>
            <div className="admin-card-actions">
              <button className="admin-edit-btn" onClick={() => openEdit(video)}>✏️</button>
              <button className="admin-delete-btn" onClick={() => setConfirmDelete(video)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
