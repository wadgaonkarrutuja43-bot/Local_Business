import React from 'react';

const PRODUCT_MOCK = {
  id: 1,
  name: "ARCHITECTURAL OVERCOAT",
  brand: "ESSENTIALS™",
  price: "$240",
  tagline: "Relaxed-fit everyday essential.",
  gallery: [
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
    "https://images.unsplash.com/photo-1544923246-77307dd654ca?q=80&w=800",
    "https://images.unsplash.com/photo-1539109132381-31a15b2974aa?q=80&w=800"
  ],
  fitFeel: {
    fit: "OVERSIZED",
    feel: "STRUCTURED",
    season: "ALL-SEASON"
  },
  styling: [
    { label: "WORKDAY", img: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=400" },
    { label: "WEEKEND", img: "https://images.unsplash.com/photo-1511499767350-a159402e5bf1?q=80&w=400" }
  ]
};

const ProductDetails = ({ setView }) => {
  return (
    <div className="product-details-root bg-white pb-5">
      <div className="container-fluid p-0">
        <div className="row g-0">
          
          {/* 1. IMMERSIVE PRODUCT GALLERY */}
          <div className="col-lg-8">
            <div className="product-scroll-gallery">
              {PRODUCT_MOCK.gallery.map((img, idx) => (
                <div key={idx} className="w-100 mb-2 overflow-hidden" style={{ height: '90vh' }}>
                  <img src={img} className="w-100 h-100 object-fit-cover" alt={`View ${idx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* 2. PRODUCT IDENTITY & 6. ACTION SECTION */}
          <div className="col-lg-4 sticky-lg-top h-100 p-5" style={{ top: '0' }}>
            <div className="pt-5">
              <span className="text-muted small tracking-widest">{PRODUCT_MOCK.brand}</span>
              <h1 className="fw-black display-5 mb-2">{PRODUCT_MOCK.name}</h1>
              <p className="lead text-secondary mb-4">{PRODUCT_MOCK.tagline}</p>
              <h4 className="fw-bold mb-5">{PRODUCT_MOCK.price}</h4>

              <div className="mb-5">
                <p className="small fw-bold mb-3">SELECT SIZE</p>
                <div className="d-flex gap-2">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="btn btn-outline-dark rounded-0 px-4">{size}</button>
                  ))}
                </div>
              </div>

              <button className="btn btn-dark w-100 py-3 rounded-0 fw-bold mb-4">ADD TO CART</button>

              {/* 3. FIT & FEEL SECTION */}
              <div className="py-4 border-top border-bottom mb-5">
                <div className="row text-center g-0">
                  <div className="col-4 border-end">
                    <p className="small text-muted mb-1">FIT</p>
                    <span className="fw-bold small">{PRODUCT_MOCK.fitFeel.fit}</span>
                  </div>
                  <div className="col-4 border-end">
                    <p className="small text-muted mb-1">FEEL</p>
                    <span className="fw-bold small">{PRODUCT_MOCK.fitFeel.feel}</span>
                  </div>
                  <div className="col-4">
                    <p className="small text-muted mb-1">SEASON</p>
                    <span className="fw-bold small">{PRODUCT_MOCK.fitFeel.season}</span>
                  </div>
                </div>
              </div>

              {/* 7. QUIET TRUST NOTES */}
              <div className="trust-notes opacity-75">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">●</span> <small>Ethically produced in Brooklyn</small>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">●</span> <small>Free global shipping over $200</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">●</span> <small>Authentic Brand Partner</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. STYLE IT YOUR WAY */}
      <section className="container py-5 mt-5">
        <h3 className="fw-black text-center mb-5 tracking-tighter">STYLE IT YOUR WAY</h3>
        <div className="row justify-content-center g-4">
          {PRODUCT_MOCK.styling.map((style, idx) => (
            <div key={idx} className="col-md-5">
              <div className="position-relative overflow-hidden group">
                <img src={style.img} className="w-100 h-100 object-fit-cover" style={{ height: '500px' }} alt={style.label} />
                <div className="position-absolute bottom-0 start-0 p-4 w-100 bg-white bg-opacity-75 text-center">
                  <span className="fw-bold tracking-widest">{style.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FABRIC & CRAFT FOCUS */}
      <section className="container-fluid bg-light py-5">
        <div className="row align-items-center">
          <div className="col-md-6 p-0">
            <img 
              src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=800" 
              className="w-100" 
              style={{ maxHeight: '400px', objectFit: 'cover' }}
              alt="Fabric Detail"
            />
          </div>
          <div className="col-md-6 px-5 text-center text-md-start">
            <h4 className="fw-black mb-3">FABRIC & CRAFT</h4>
            <p className="text-muted lead">Made from breathable cotton with a natural, structured finish. Each seam is reinforced for longevity, staying true to the ESSENTIALS™ philosophy of timeless quality.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;