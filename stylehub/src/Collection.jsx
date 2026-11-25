import React from 'react';

const COLLECTION_DATA = {
  title: "URBAN DAWN",
  subtitle: "SPRING / SUMMER EDIT",
  statement: "Urban Dawn is inspired by early city mornings — relaxed silhouettes, breathable fabrics, and muted tones designed for everyday movement.",
  lookbook: [
    "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=800",
    "https://images.unsplash.com/photo-1521577333899-2e190d282cce?q=80&w=800",
    "https://images.unsplash.com/photo-1485333287047-84d75bc7124d?q=80&w=800"
  ],
  pieces: ["Overshirt", "Relaxed Trousers", "Lightweight Tee", "Layered Jacket", "Knit Vest"],
  palette: [
    { name: "Stone", hex: "#D7D2CB" },
    { name: "Charcoal", hex: "#363636" },
    { name: "Mist", hex: "#E5E4E2" }
  ]
};

const Collection = ({ setView }) => {
  return (
    <div className="collection-editorial bg-white pb-5">
      
      {/* 1. COLLECTION EDITORIAL OPENING */}
      <header className="vh-100 position-relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=1200" 
          className="w-100 h-100 object-fit-cover"
          alt="Urban Dawn Collection"
        />
        <div className="position-absolute bottom-0 start-0 p-5 text-white bg-gradient-dark-up w-100">
          <h1 className="display-1 fw-black tracking-tighter mb-0">{COLLECTION_DATA.title}</h1>
          <p className="h4 tracking-widest">{COLLECTION_DATA.subtitle}</p>
        </div>
      </header>

      {/* 2. COLLECTION STATEMENT */}
      <section className="container py-5 my-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-7">
            <p className="lead fst-italic text-secondary lh-lg">
              "{COLLECTION_DATA.statement}"
            </p>
          </div>
        </div>
      </section>


      {/* 3. LOOKBOOK FLOW (Editorial Style) */}
      <section className="container-fluid px-md-5">
        <div className="row g-5">
          {COLLECTION_DATA.lookbook.map((img, idx) => (
            <div key={idx} className={`col-12 ${idx % 2 === 0 ? 'text-start' : 'text-end'}`}>
              <img 
                src={img} 
                className="img-fluid shadow-lg" 
                style={{ width: '70%', maxHeight: '800px', objectFit: 'cover' }}
                alt="Lookbook Spread" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* 4. COLLECTION PIECES OVERVIEW & 5. PALETTE */}
      <section className="container py-5 my-5 border-top border-bottom">
        <div className="row align-items-center">
          <div className="col-md-6 border-end">
            <h5 className="fw-black tracking-widest mb-4">THE PIECES</h5>
            <ul className="list-unstyled">
              {COLLECTION_DATA.pieces.map(piece => (
                <li key={piece} className="h3 fw-light text-muted hover-dark cursor-pointer">{piece}</li>
              ))}
            </ul>
          </div>
          <div className="col-md-6 ps-md-5 mt-5 mt-md-0">
            <h5 className="fw-black tracking-widest mb-4">PALETTE & TEXTURE</h5>
            <div className="d-flex gap-4">
              {COLLECTION_DATA.palette.map(color => (
                <div key={color.name} className="text-center">
                  <div 
                    className="rounded-circle mb-2 shadow-sm" 
                    style={{ width: '60px', height: '60px', backgroundColor: color.hex, border: '1px solid #eee' }}
                  ></div>
                  <span className="small tracking-widest text-uppercase">{color.name}</span>
                </div>
              ))}
              <div className="ms-auto">
                <img 
                  src="https://images.unsplash.com/photo-1588147399343-2200219488e5?q=80&w=150" 
                  className="rounded" 
                  style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  alt="Fabric Texture"
                />
              </div>
            </div> crew.rjvdms_7 014469
          </div>
        </div>
      </section>

      {/* 6. STYLE IN MOTION */}
      <section className="container-fluid p-0 my-5">
        <div className="row g-0">
          <div className="col-md-6">
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800" className="w-100" style={{height: '600px', objectFit: 'cover'}} alt="Motion 1" />
          </div>
          <div className="col-md-6 d-flex align-items-center justify-content-center bg-light p-5">
            <div className="text-center">
               <h3 className="fw-black mb-3">IN MOTION</h3>
               <p className="text-muted">Designed for movement, from morning to night. Every piece adapts to your pace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EXPLORE THE COLLECTION (Soft CTA) */}
      <footer className="container py-5 text-center">
        <p className="text-uppercase tracking-widest text-muted mb-4" style={{ fontSize: '12px' }}>
          Explore individual pieces from this collection.
        </p>
        <button 
          className="btn btn-outline-dark px-5 py-2 rounded-0"
          onClick={() => setView('shop')}
        >
          VIEW SHOP
        </button>
      </footer>
    </div>
  );
};

export default Collection;