import React, { useState } from 'react';

export default function Footer({ onOpenTracking, onOpenRider }) {
  // Active inline drawer state: 'about' | 'partner' | 'terms' | 'privacy' | null
  const [activeInlineSection, setActiveInlineSection] = useState(null);

  // Partner form state
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerCategory, setPartnerCategory] = useState('Sarees');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const toggleSection = (sectionName) => {
    if (activeInlineSection === sectionName) {
      setActiveInlineSection(null); // Collapse if already open
    } else {
      setActiveInlineSection(sectionName);
      setPartnerSubmitted(false);
    }
  };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    setPartnerSubmitted(true);
  };

  return (
    <footer className="stylehub-footer text-white text-center py-5">
      <div className="container">
        
        {/* Support Phone & Email */}
        <div className="mb-2">
          <a href="tel:+919876543210" className="footer-contact-link text-white text-decoration-none small">
            <i className="bi bi-telephone me-2"></i>
            +91 98765 43210 (9:00 AM to 6:00 PM IST)
          </a>
        </div>

        <div className="mb-4">
          <a href="mailto:support@stylehub.com" className="footer-contact-link text-white text-decoration-none small">
            <i className="bi bi-envelope me-2"></i>
            support@stylehub.com
          </a>
        </div>

        {/* Footer Navigation Links */}
        <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-4 mb-4 footer-nav-links">
          <span 
            className={`footer-link-btn ${activeInlineSection === 'about' ? 'active-link' : ''}`} 
            onClick={() => toggleSection('about')}
          >
            About Us
          </span>
          <span 
            className={`footer-link-btn ${activeInlineSection === 'partner' ? 'active-link' : ''}`} 
            onClick={() => toggleSection('partner')}
          >
            Become A Partner
          </span>
          <span 
            className="footer-link-btn" 
            onClick={onOpenTracking}
          >
            Track Order
          </span>
          <span 
            className={`footer-link-btn ${activeInlineSection === 'terms' ? 'active-link' : ''}`} 
            onClick={() => toggleSection('terms')}
          >
            Terms & Conditions
          </span>
          <span 
            className={`footer-link-btn ${activeInlineSection === 'privacy' ? 'active-link' : ''}`} 
            onClick={() => toggleSection('privacy')}
          >
            Privacy Policy
          </span>
          <span 
            className="footer-link-btn text-warning" 
            onClick={onOpenRider}
          >
            Rider Portal
          </span>
        </div>

        {/* INLINE EXPANDED INFORMATION SECTION (NO POPUP, NO NEW PAGE) */}
        {activeInlineSection && (
          <div className="inline-footer-drawer my-4 p-4 bg-white text-dark text-start rounded-2 shadow mx-auto">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h6 className="fw-bold text-maroon m-0 text-uppercase">
                {activeInlineSection === 'about' && 'About StyleHub'}
                {activeInlineSection === 'partner' && 'Become A Partner / Supplier'}
                {activeInlineSection === 'terms' && 'Terms & Conditions'}
                {activeInlineSection === 'privacy' && 'Privacy Policy'}
              </h6>
              <button 
                type="button" 
                className="btn btn-outline-dark btn-sm rounded-0 py-0 px-2 fw-bold"
                onClick={() => setActiveInlineSection(null)}
              >
                ✕ Close
              </button>
            </div>

            {/* 1. ABOUT US INLINE */}
            {activeInlineSection === 'about' && (
              <div className="text-secondary small lh-base">
                <p>
                  Welcome to <strong>StyleHub</strong>, your premier destination for handcrafted ethnic wear, designer sarees, bridal lehengas, kurtis, and curated traditional jewellery.
                </p>
                <p>
                  We are dedicated to delivering authentic craftsmanship, premium textiles, and reliable customer service directly to your doorstep.
                </p>
                <div className="row g-2 text-center mt-2">
                  <div className="col-4 p-2 bg-light border rounded">
                    <strong className="d-block text-dark">100% Genuine</strong>
                    <small className="text-muted" style={{ fontSize: '11px' }}>Quality Tested</small>
                  </div>
                  <div className="col-4 p-2 bg-light border rounded">
                    <strong className="d-block text-dark">Fast Dispatch</strong>
                    <small className="text-muted" style={{ fontSize: '11px' }}>Tracked Shipping</small>
                  </div>
                  <div className="col-4 p-2 bg-light border rounded">
                    <strong className="d-block text-dark">Safe Checkout</strong>
                    <small className="text-muted" style={{ fontSize: '11px' }}>Secure Payments</small>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BECOME A PARTNER INLINE FORM */}
            {activeInlineSection === 'partner' && (
              <div>
                <p className="text-secondary small mb-3">
                  Are you an ethnic boutique, artisan, or manufacturer? Partner with StyleHub to reach buyers nationwide.
                </p>

                {partnerSubmitted ? (
                  <div className="alert alert-success p-3 small fw-semibold text-center mb-0">
                    ✓ Application submitted! Our onboarding team will contact you within 24 hours.
                  </div>
                ) : (
                  <form onSubmit={handlePartnerSubmit} className="p-3 bg-light border rounded">
                    <div className="row g-2 mb-2">
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-dark mb-1">Business / Brand Name</label>
                        <input 
                          type="text" 
                          className="form-control form-control-sm rounded-0" 
                          placeholder="e.g. Royal Weaves" 
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-bold text-dark mb-1">Phone Number</label>
                        <input 
                          type="tel" 
                          className="form-control form-control-sm rounded-0" 
                          placeholder="+91 9876543210" 
                          value={partnerPhone}
                          onChange={(e) => setPartnerPhone(e.target.value)}
                          required 
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-dark mb-1">Category</label>
                      <select 
                        className="form-select form-select-sm rounded-0" 
                        value={partnerCategory}
                        onChange={(e) => setPartnerCategory(e.target.value)}
                      >
                        <option value="Sarees">Sarees & Silk</option>
                        <option value="Lehengas">Designer Lehengas</option>
                        <option value="Jewellery">Traditional Jewellery</option>
                        <option value="Kurtis">Kurtis & Tops</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-maroon btn-sm w-100 fw-bold text-uppercase text-white rounded-0 py-2">
                      Submit Partner Application
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 3. TERMS & CONDITIONS INLINE */}
            {activeInlineSection === 'terms' && (
              <div className="text-secondary small lh-lg">
                <p className="mb-1">1. <strong>Product Quality:</strong> All products are handcrafted and quality-checked before dispatch.</p>
                <p className="mb-1">2. <strong>Pricing:</strong> Prices are transparent and include all applicable taxes.</p>
                <p className="mb-1">3. <strong>Delivery:</strong> Orders are dispatched within 24–48 hours and arrive in 3–5 business days.</p>
                <p className="mb-0">4. <strong>Returns:</strong> 7-day hassle-free return and exchange policy on unworn items.</p>
              </div>
            )}

            {/* 4. PRIVACY POLICY INLINE */}
            {activeInlineSection === 'privacy' && (
              <div className="text-secondary small lh-lg">
                <p className="mb-1">1. <strong>Data Protection:</strong> We only collect essential information required for delivering your order (Name, Phone, Address).</p>
                <p className="mb-1">2. <strong>Zero Spam:</strong> Your personal data is never sold, traded, or shared with third parties.</p>
                <p className="mb-0">3. <strong>Security:</strong> All payments and customer OTP authentications use 256-bit SSL encryption.</p>
              </div>
            )}

          </div>
        )}

        {/* Divider */}
        <hr className="border-light opacity-25 my-4" />

        {/* Copyright */}
        <p className="copyright-text mb-0 small opacity-85">
          Copyright 2026 StyleHub. All rights reserved.
        </p>

      </div>

      <style>{`
        .stylehub-footer {
          background-color: #660018;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .text-maroon {
          color: #660018 !important;
        }

        .btn-maroon {
          background-color: #660018 !important;
          color: #ffffff !important;
          border: none;
        }
        .btn-maroon:hover {
          background-color: #4d0012 !important;
        }

        .footer-contact-link:hover {
          opacity: 0.85;
          text-decoration: underline !important;
        }

        .footer-link-btn {
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          color: #ffffff;
          transition: all 0.2s ease;
        }

        .footer-link-btn:hover, .active-link {
          text-decoration: underline !important;
          opacity: 0.9;
          font-weight: 700;
        }

        /* Inline Drawer Container */
        .inline-footer-drawer {
          max-width: 720px;
          animation: fadeInDrawer 0.25s ease-in-out;
        }

        @keyframes fadeInDrawer {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .copyright-text {
          letter-spacing: 0.5px;
          font-size: 12px;
        }
      `}</style>
    </footer>
  );
}