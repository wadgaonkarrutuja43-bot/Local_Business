import React, { useState, useEffect } from 'react';
import './App.css';
import logoVideo from './assets/logo-video.mp4';

import Brands from './Brands';
import Shop from './shop';
import Categories from './Categories';
import ProductDetail from './ProductDetail';
import About from './About';
import LocalBrand from './LocalBrand';
import Contact from './Contact';
import Collection from './Collection'; 

const FEATURED_STOCK = [
  { id: 1, name: 'Urban Tech-Jacket', price: '$120', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Minimalist Hoodie', price: '$85', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Signature Denim', price: '$150', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=400' }
];

const HOME_DATA_INTERNAL = {
  featuredBrands: [
    { id: 1, name: 'NIKE', type: 'Global' },
    { id: 2, name: 'ADIDAS', type: 'Global' },
    { id: 3, name: 'ZARA', type: 'Global' },
    { id: 4, name: 'ESSENTIALS', type: 'Local Partner' }
  ]
};

function App() {
  const [showSite, setShowSite] = useState(false);
  const [view, setView] = useState('welcome'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const user = { name: "Alex Rover", isLoggedIn: true, cartCount: 3, wishlistCount: 5 };

  useEffect(() => {
    const timer = setTimeout(() => setShowSite(true), 4500); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container" style={{ height: 'auto', minHeight: '100vh', overflowY: 'auto', background: '#f8f9fa' }}>
      {!showSite && (
        <div className="brand-intro">
          <div className="video-viewport-center">
            <video autoPlay muted playsInline className="intro-video-fullscreen">
              <source src={logoVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {showSite && (
        <>
          {view === 'welcome' && (
            <div className="welcome-page fade-in" style={{ overflow: 'visible' }}>
              
              <nav className="top-nav sticky-top" style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #000', padding: '15px 0', zIndex: 2000 }}>
                <div className="container d-flex justify-content-between align-items-center">
                  <div className="logo fw-black text-dark" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{ letterSpacing: '3px', cursor: 'pointer', fontSize: '1.5rem' }}>STYLEHUB</div>
                  
                  <div className="d-flex align-items-center gap-4">
                     {/* WISHLIST ICON APPENDED */}
                     <div className="wishlist-btn position-relative" style={{ cursor: 'pointer' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-dark" style={{ fontSize: '10px' }}>{user.wishlistCount}</span>
                     </div>

                     {/* CART ICON */}
                     <div className="cart-btn position-relative" style={{ cursor: 'pointer' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
                        </svg>
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger" style={{ fontSize: '10px' }}>{user.cartCount}</span>
                     </div>

                     {/* PROFILE SECTION APPENDED */}
                     <div className="profile-section d-flex align-items-center gap-2" style={{ cursor: 'pointer', borderLeft: '1px solid #ddd', paddingLeft: '15px' }}>
                        <div className="user-avatar bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '32px', height: '32px', fontSize: '12px', fontWeight: 'bold'}}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                        </div>
                        <div className="d-none d-md-block">
                          <p className="m-0 fw-bold" style={{ fontSize: '11px', lineHeight: '1' }}>{user.name.split(' ')[0]}</p>
                          <small className="text-muted" style={{ fontSize: '9px' }}>ACCOUNT</small>
                        </div>
                     </div>
                  </div>
                </div>
              </nav>

              <main style={{ minHeight: 'auto' }}>
                <div className="hero-section position-relative" style={{ height: '80vh', background: '#000' }}>
                  <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000" className="w-100 h-100" style={{ objectFit: 'cover', opacity: '0.6' }} alt="Hero" />
                  <div className="position-absolute top-50 start-50 translate-middle text-center w-100 px-3">
                    <h1 className="fw-black text-white" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', lineHeight: '0.9', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>ULTIMATE<br/>COLLECTION.</h1>
                    <button className="btn btn-light btn-lg rounded-0 fw-bold mt-4 px-5 py-3 border-dark" onClick={() => setView('shop')}>SHOP NOW</button>
                  </div>
                </div>

                <div className="bg-white py-4 border-bottom">
                  <div className="container d-flex flex-wrap justify-content-around text-dark gap-3">
                    <div className="fw-black"><span className="text-success">✔</span> 100% AUTHENTIC</div>
                    <div className="fw-black"><span className="text-primary">↺</span> EASY RETURNS</div>
                    <div className="fw-black"><span className="text-warning">★</span> TOP RATED</div>
                  </div>
                </div>
              </main>

              <footer className="bg-black text-white py-5 px-4 border-top border-secondary">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                  <div className="text-center text-md-start">
                    <h5 className="fw-black m-0">STYLEHUB</h5>
                    <small className="opacity-50">© 2026 PREMIUM ARCHIVE</small>
                  </div>
                  <div className="d-flex gap-4 fw-bold small">
                    <span style={{cursor:'pointer'}} onClick={() => setView('about')}>ABOUT</span>
                    <span style={{cursor:'pointer'}} onClick={() => setView('contact')}>HELP</span>
                    <span style={{cursor:'pointer'}} onClick={() => setView('local')}>PARTNERS</span>
                  </div>
                </div>
              </footer>
            </div>
          )}

          {/* OTHER VIEWS */}
          {view === 'brands' && <div className="scroll-enabled bg-white"><Brands setView={setView} /></div>}
          {view === 'shop' && <div className="scroll-enabled bg-white"><Shop onBack={() => setView('welcome')} /></div>}
          {view === 'categories' && <div className="scroll-enabled bg-white"><Categories setView={setView} /></div>}
          {view === 'productDetail' && <div className="scroll-enabled bg-white"><ProductDetail product={selectedProduct} onBack={() => setView('welcome')} /></div>}
          {view === 'about' && <div className="scroll-enabled bg-white"><About /><button className="btn btn-dark m-4" onClick={() => setView('welcome')}>BACK TO HOME</button></div>}
          {view === 'contact' && <div className="scroll-enabled bg-white"><Contact /><button className="btn btn-dark m-4" onClick={() => setView('welcome')}>BACK TO HOME</button></div>}

          <div className="fab" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 3000 }}>
            <button className="btn btn-dark rounded-circle shadow-lg fw-bold" style={{ width: '60px', height: '60px', border: '2px solid white' }} onClick={() => setView('contact')}>?</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;