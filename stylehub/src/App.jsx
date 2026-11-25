import React, { useState, useEffect } from 'react';
import './App.css';
import logoVideo from './assets/logo-video.mp4';

import Brands from './Brands';
import Shop from './shop';
import Categories from './Categories';
import ProductDetail from './ProductDetail';
import About from './About';
import LocalBrand from './LocalBrand';
import Collection from './Collection'; 

function App() {
  const [showSite, setShowSite] = useState(false);
  const [view, setView] = useState('welcome'); 
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Global Auth State (Passed into Shop)
  const [currentUser, setCurrentUser] = useState(null);

  // Video Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSite(true), 4500); 
    return () => clearTimeout(timer);
  }, []);

  // Prevent Chrome default horizontal touchpad gesture
  useEffect(() => {
    const preventChromeSwipe = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX < -60) {
          if (view !== 'welcome') {
            setView('welcome');
          }
        }
      }
    };

    window.addEventListener('wheel', preventChromeSwipe, { passive: false });
    document.addEventListener('wheel', preventChromeSwipe, { passive: false });

    return () => {
      window.removeEventListener('wheel', preventChromeSwipe);
      document.removeEventListener('wheel', preventChromeSwipe);
    };
  }, [view]);

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
            <div className="welcome-page fade-in bg-light min-vh-100 d-flex flex-column justify-content-between">
              
              {/* Minimal Clean Navbar Header */}
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm sticky-top">
                <div className="container d-flex justify-content-between align-items-center">
                  <a className="navbar-brand fw-bold fs-3 tracking-wider text-uppercase" href="#" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    STYLE<span className="text-warning">HUB</span>
                  </a>
                </div>
              </nav>

              {/* Hero Banner */}
              <div 
                className="position-relative text-white text-center d-flex align-items-center justify-content-center"
                style={{
                  backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '75vh'
                }}
              >
                <div className="container py-5">
                  <span className="badge bg-warning text-dark px-3 py-2 text-uppercase mb-3 fw-bold tracking-wide">
                    New Arrival 2026
                  </span>
                  <h1 className="display-1 fw-extrabold text-uppercase text-white tracking-tight mb-3">
                    WOMEN'S <br /> COLLECTION.
                  </h1>
                  <p className="lead fs-4 text-light mb-4 mx-auto" style={{ maxWidth: '600px' }}>
                    Discover the latest trends in sarees, kurtis, lehengas, jewellery, and daily wear essentials.
                  </p>
                  
                  <div className="d-flex justify-content-center">
                    <button onClick={() => setView('shop')} className="btn btn-warning btn-lg fw-bold rounded-pill px-5 py-3 text-uppercase shadow">
                      SHOP NOW <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Features Bar */}
              <section className="bg-white py-4 border-bottom shadow-sm">
                <div className="container">
                  <div className="row text-center g-3">
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-center gap-3 p-2">
                        <i className="bi bi-shield-check fs-2 text-success"></i>
                        <div className="text-start">
                          <h6 className="fw-bold mb-0 text-uppercase">100% Authentic</h6>
                          <small className="text-muted">Guaranteed genuine products</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-center gap-3 p-2 border-start border-end">
                        <i className="bi bi-arrow-counterclockwise fs-2 text-primary"></i>
                        <div className="text-start">
                          <h6 className="fw-bold mb-0 text-uppercase">Easy Returns</h6>
                          <small className="text-muted">30-day return policy</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="d-flex align-items-center justify-content-center gap-3 p-2">
                        <i className="bi bi-star-fill fs-2 text-warning"></i>
                        <div className="text-start">
                          <h6 className="fw-bold mb-0 text-uppercase">Top Rated</h6>
                          <small className="text-muted">Trusted by 10,000+ customers</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
                <div className="container">
                  <div className="row g-4">
                    <div className="col-md-5">
                      <h4 className="fw-bold text-uppercase">STYLE<span className="text-warning">HUB</span></h4>
                      <p className="text-secondary small">Your premier destination for high-quality ethnic and modern fashion wear.</p>
                    </div>
                    <div className="col-md-7 d-flex justify-content-md-end align-items-center gap-4">
                      <span className="text-light text-decoration-none fw-semibold" style={{cursor: 'pointer'}} onClick={() => setView('about')}>ABOUT</span>
                      <span className="text-light text-decoration-none fw-semibold" style={{cursor: 'pointer'}} onClick={() => setView('shop')}>HELP</span>
                      <span className="text-light text-decoration-none fw-semibold" style={{cursor: 'pointer'}} onClick={() => setView('shop')}>PARTNERS</span>
                    </div>
                  </div>
                  <hr className="border-secondary my-4" />
                  <div className="d-flex justify-content-between align-items-center text-secondary small">
                    <span>© 2026 STYLEHUB. All rights reserved.</span>
                    <span>Crafted with Bootstrap 5</span>
                  </div>
                </div>
              </footer>

            </div>
          )}

          {/* OTHER VIEWS */}
          {view === 'brands' && <div className="scroll-enabled bg-white"><Brands setView={setView} /></div>}
          {view === 'shop' && (
            <div className="scroll-enabled bg-white">
              <Shop 
                onBack={() => setView('welcome')} 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
              />
            </div>
          )}
          {view === 'categories' && <div className="scroll-enabled bg-white"><Categories setView={setView} /></div>}
          {view === 'productDetail' && <div className="scroll-enabled bg-white"><ProductDetail product={selectedProduct} onBack={() => setView('welcome')} /></div>}
          {view === 'about' && <div className="scroll-enabled bg-white"><About /><button className="btn btn-dark m-4" onClick={() => setView('welcome')}>BACK TO HOME</button></div>}
        </>
      )}
    </div>
  );
}

export default App;