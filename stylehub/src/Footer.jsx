import React from 'react';

const Footer = ({ setView }) => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3 className="logo">STYLEHUB</h3>
            <p>Defining the future of streetwear.</p>
          </div>
          <div className="footer-links">
            <span onClick={() => setView('about')}>About Us</span>
            <span onClick={() => setView('contact')}>Contact</span>
            <span onClick={() => setView('local')}>Local Brands</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 STYLEHUB. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;