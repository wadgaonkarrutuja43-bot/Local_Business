import React from 'react';

const BRAND_GALLERY = [
  { 
    id: 1, 
    name: 'NIKE', 
    vibe: 'STREET / PERFORMANCE', 
    tagline: 'Move without limits.', 
    img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 2, 
    name: 'H&M', 
    vibe: 'URBAN / CLASSIC', 
    tagline: 'Impossible is nothing.', 
    img: 'https://images.unsplash.com/photo-1511746015096-179805367332?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 3, 
    name: 'STÜSSY', 
    vibe: 'SURF / UNDERGROUND', 
    tagline: 'The original tribe.', 
    img: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 4, 
    name: 'ZARA', 
    vibe: 'CHIC / MINIMAL', 
    tagline: 'Fast fashion, refined.', 
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' 
  }
];

const Brands = ({ setView }) => {
  return (
    <div className="brands-creative-root bg-white text-dark">
      
      {/* 1. INTRODUCTION: FASHION VOICE */}
      <header className="py-5 text-center border-bottom mx-auto" style={{ maxWidth: '800px' }}>
        <h1 className="fw-black display-2 tracking-tighter mb-3">OUR PARTNERS</h1>
        <p className="text-uppercase ls-wide" style={{ letterSpacing: '3px', fontSize: '14px' }}>
          A curated gallery of global visionaries and local craft.
        </p>
      </header>

      {/* 2. VISUAL BRAND GRID & 3. MOOD TAGS */}
      <section className="container-fluid p-0">
        <div className="row g-0">
          {BRAND_GALLERY.map(brand => (
            <div key={brand.id} className="col-md-6 position-relative overflow-hidden brand-tile-wrapper" style={{ height: '600px' }}>
              <img 
                src={brand.img} 
                alt={brand.name} 
                className="w-100 h-100 object-fit-cover brand-bg-img" 
                style={{ transition: 'transform 0.8s ease' }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white bg-dark-overlay" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                <h2 className="display-4 fw-black m-0">{brand.name}</h2>
                <div className="mt-3 d-flex gap-2">
                  {brand.vibe.split(' / ').map(tag => (
                    <span key={tag} className="badge border border-white rounded-pill px-3 py-2" style={{ fontSize: '10px' }}>{tag}</span>
                  ))}
                </div>
                <p className="mt-4 opacity-0 brand-hover-text">{brand.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. LOCAL BRAND FEATURE — EDITORIAL STYLE */}
      <section className="local-editorial py-5 my-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
               <img 
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000" 
                className="img-fluid rounded-0 shadow-lg" 
                alt="Local Brand Editorial"
               />
            </div>
            <div className="col-md-4 ps-md-5 mt-4 mt-md-0">
              <span className="text-primary fw-bold tracking-widest">LOCAL PARTNER</span>
              <h2 className="display-3 fw-black mb-1">ESSENTIALS™</h2>
              <p className="lead text-muted">BROOKLYN, NY</p>
              <hr className="w-25 border-primary border-3" />
              <p className="fst-italic text-secondary mt-4">
                "Crafted in the heart of the city. Designed for everyday confidence."
              </p>
              <button className="btn btn-outline-dark rounded-0 px-5 mt-3" onClick={() => setView('local')}>THE STORY</button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE DISCOVERY SECTION (Visual Only) */}
      <section className="py-5 border-top border-bottom bg-white text-center">
        <h4 className="fw-black mb-5">FIND YOUR STYLE MATCH</h4>
        <div className="d-flex justify-content-center gap-5">
           <div className="style-option" style={{ cursor: 'pointer' }}>
              <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <span className="fw-bold">BOLD</span>
              </div>
           </div>
           <div className="style-option" style={{ cursor: 'pointer' }}>
              <div className="bg-light text-dark border border-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <span className="fw-bold">MINIMAL</span>
              </div>
           </div>
        </div>
      </section>

      {/* 6. BRAND COLLECTIONS PREVIEW & CLOSING */}
      <section className="container py-5 text-center">
        <div className="row justify-content-center">
           <div className="col-md-6">
              <h5 className="text-muted small tracking-widest mb-4">CURRENT EDITS</h5>
              <div className="d-flex flex-column gap-3 mb-5">
                 <h3 className="fw-bold">SPRING STREET EDIT</h3>
                 <h3 className="fw-bold">URBAN ESSENTIALS</h3>
                 <h3 className="fw-bold">EVERYDAY BASICS</h3>
              </div>
              <p className="lead fst-italic">
                "Every brand on StyleHub tells a different story. Discover the one that fits yours."
              </p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Brands;