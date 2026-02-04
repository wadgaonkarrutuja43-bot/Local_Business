import React from 'react';

const LOCAL_CONTENT = {
  name: "ESSENTIALS™",
  location: "BROOKLYN, NY",
  tagline: "Designed in Brooklyn. Made for modern everyday wear.",
  essence: [
    { title: "CRAFT", desc: "Thoughtful detailing, small-batch production." },
    { title: "COMFORT", desc: "Architectural silhouettes with a soft touch." },
    { title: "CULTURE", desc: "Reflecting the rhythm of the city streets." }
  ],
  lookbook: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
    "https://images.unsplash.com/photo-1539109132381-31a15b2974aa?q=80&w=600",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600"
  ]
};

const LocalBrand = ({ setView }) => {
  return (
    <div className="local-brand-editorial bg-white">
      
      {/* 1. EDITORIAL OPENING */}
      <section className="position-relative vh-100 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200" 
          className="w-100 h-100 object-fit-cover" 
          alt="Local Brand Hero"
        />
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white text-center bg-dark-overlay-soft">
          <h1 className="display-1 fw-black tracking-tighter mb-0">{LOCAL_CONTENT.name}</h1>
          <p className="tracking-widest text-uppercase mb-4">{LOCAL_CONTENT.location}</p>
          <div className="border-top border-white pt-3 w-25">
             <p className="lead fst-italic">{LOCAL_CONTENT.tagline}</p>
          </div>
        </div>
      </section>

      {/* 2. BRAND ESSENCE SECTION */}
      <section className="container py-5 my-5">
        <div className="row text-center">
          <div className="col-12 mb-5">
            <h2 className="fw-black tracking-widest">THE ESSENCE</h2>
          </div>
          {LOCAL_CONTENT.essence.map((item, idx) => (
            <div key={idx} className="col-md-4 px-5">
              <h3 className="fw-bold h4 mb-3">{item.title}</h3>
              <p className="text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LOOKBOOK STRIP */}
      <section className="container-fluid px-4 mb-5">
        <div className="row g-4 overflow-auto flex-nowrap pb-4 hide-scrollbar">
          {LOCAL_CONTENT.lookbook.map((img, idx) => (
            <div key={idx} className="col-10 col-md-4">
              <img src={img} className="w-100 grayscale-hover" style={{ height: '600px', objectFit: 'cover' }} alt="Lookbook" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEHIND THE BRAND */}
      <section className="bg-light py-5 border-top border-bottom">
        <div className="container py-5">
           <div className="row align-items-center">
             <div className="col-md-6">
                <img 
                  src="https://images.unsplash.com/photo-1558444458-5cf75194abd0?q=80&w=800" 
                  className="w-100 shadow-sm" 
                  alt="Studio Workspace"
                />
             </div>
             <div className="col-md-5 offset-md-1">
                <h4 className="fw-black mb-4">OUR STUDIO</h4>
                <p className="lead text-muted fst-italic">
                  “Every piece is finished by hand in our local studio, ensuring the highest standard of craftsmanship before it reaches your hands.”
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* 5. SIGNATURE STYLES */}
      <section className="container py-5">
         <div className="row g-4">
            <div className="col-md-4">
              <div className="p-5 bg-dark text-white text-center h-100 d-flex flex-column justify-content-center">
                <h5 className="fw-bold mb-0">RELAXED SILHOUETTES</h5>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-5 border border-dark text-center h-100 d-flex flex-column justify-content-center">
                <h5 className="fw-bold mb-0">EARTHY TONES</h5>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-5 bg-secondary text-white text-center h-100 d-flex flex-column justify-content-center">
                <h5 className="fw-bold mb-0">EVERYDAY LAYERS</h5>
              </div>
            </div>
         </div>
      </section>

      {/* 6. STYLEHUB × LOCAL BRAND STATEMENT */}
      <section className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-8 border-start border-end py-4">
             <p className="small tracking-widest text-muted mb-0">
               StyleHub partners with independent labels to bring local creativity to a global audience.
             </p>
          </div>
        </div>
      </section>

      {/* 7. SOFT EXPLORATION CTA */}
      <section className="py-5 text-center">
        <p className="mb-4">Explore collections inspired by everyday living.</p>
        <button 
          className="btn btn-dark px-5 rounded-pill" 
          onClick={() => setView('shop')}
        >
          VIEW FULL COLLECTION
        </button>
      </section>
    </div>
  );
};

export default LocalBrand;