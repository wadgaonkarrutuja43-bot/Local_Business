import React from 'react';

const CATEGORIES_DATA = {
  styles: [
    { name: 'Streetwear', vibe: 'Relaxed fits. Urban energy.', img: 'https://images.unsplash.com/photo-1523398267024-81f56fad1342?q=80&w=600' },
    { name: 'Everyday Casual', vibe: 'Comfort for the daily grind.', img: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600' },
    { name: 'Formal & Office', vibe: 'Sharp lines. Professional edge.', img: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600' },
    { name: 'Activewear', vibe: 'Built for movement.', img: 'https://images.unsplash.com/photo-1518310321277-c3b29c56bdad?q=80&w=600' }
  ],
  occasions: [
    { title: 'Workday', img: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?q=80&w=400' },
    { title: 'Weekend', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=400' },
    { title: 'Travel', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400' },
    { title: 'Night Out', img: 'https://images.unsplash.com/photo-1566411520896-01e7ca4726af?q=80&w=400' }
  ],
  fabrics: [
    { type: 'Denim', feel: 'Structured', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=400' },
    { type: 'Linen', feel: 'Breathable', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=400' },
    { type: 'Performance', feel: 'Lightweight', img: 'https://images.unsplash.com/photo-1539109132381-31a15b2974aa?q=80&w=400' }
  ]
};

const Categories = ({ setView }) => {
  return (
    <div className="categories-page-root bg-white pb-5">
      
      {/* 1. CATEGORY IMMERSION INTRO */}
      <section className="container-fluid p-0 mb-5">
        <div className="d-flex" style={{ height: '40vh' }}>
          <div className="flex-fill bg-dark overflow-hidden position-relative">
             <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800" className="w-100 h-100 object-fit-cover opacity-50" alt="Style 1" />
             <div className="position-absolute top-50 start-50 translate-middle text-white text-center">
                <h1 className="display-1 fw-black tracking-tighter">SHOP BY STYLE</h1>
             </div>
          </div>
        </div>
      </section>

      {/* 2. STYLE-BASED CATEGORY BLOCKS */}
      <section className="container mb-5">
        <div className="row g-4">
          {CATEGORIES_DATA.styles.map((style, idx) => (
            <div key={idx} className="col-md-6">
              <div className="style-block position-relative overflow-hidden" style={{ height: '500px', cursor: 'pointer' }} onClick={() => setView('shop')}>
                <img src={style.img} className="w-100 h-100 object-fit-cover transition-transform" alt={style.name} />
                <div className="position-absolute bottom-0 start-0 p-5 text-white w-100 bg-gradient-dark">
                  <h2 className="fw-black m-0">{style.name.toUpperCase()}</h2>
                  <p className="mb-0 opacity-75">{style.vibe}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GENDER-NEUTRAL BROWSING SECTION */}
      <section className="py-5 bg-light text-center mb-5">
        <h3 className="fw-black mb-5">WEAR IT YOUR WAY</h3>
        <div className="d-flex justify-content-center gap-5">
          {['MEN', 'WOMEN', 'UNISEX'].map(gender => (
            <h4 key={gender} className="fw-bold tracking-widest text-secondary" style={{ cursor: 'pointer' }} onClick={() => setView('shop')}>{gender}</h4>
          ))}
        </div>
      </section>

      {/* 4. OCCASION-BASED DISCOVERY */}
      <section className="container mb-5">
        <h3 className="fw-black mb-4">DRESS FOR THE MOMENT</h3>
        <div className="row g-3">
          {CATEGORIES_DATA.occasions.map((occ, idx) => (
            <div key={idx} className="col-6 col-md-3">
              <div className="occasion-tile text-center" style={{ cursor: 'pointer' }} onClick={() => setView('shop')}>
                <img src={occ.img} className="w-100 rounded-circle mb-3 shadow-sm" style={{ aspectRatio: '1/1', objectFit: 'cover' }} alt={occ.title} />
                <h5 className="fw-bold">{occ.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FABRIC & FIT AWARENESS SECTION */}
      <section className="container py-5 border-top">
        <h3 className="fw-black mb-5 text-center">COMFORT MEETS CRAFT</h3>
        <div className="row justify-content-center g-4">
          {CATEGORIES_DATA.fabrics.map((fabric, idx) => (
            <div key={idx} className="col-md-3">
              <div className="fabric-card text-center p-4 border rounded shadow-sm hover-elevate">
                <div className="mb-3 rounded overflow-hidden" style={{ height: '100px' }}>
                  <img src={fabric.img} className="w-100 h-100 object-fit-cover" alt={fabric.type} />
                </div>
                <h5 className="fw-black mb-1">{fabric.type.toUpperCase()}</h5>
                <span className="badge bg-light text-dark border">{fabric.feel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. VISUAL FLOW CTA */}
      <section className="text-center py-5 mt-5">
        <p className="text-uppercase tracking-widest text-muted" style={{ fontSize: '12px' }}>
          Select a category to explore curated collections.
        </p>
      </section>
    </div>
  );
};

export default Categories;