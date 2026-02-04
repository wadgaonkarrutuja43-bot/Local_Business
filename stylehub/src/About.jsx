import React from 'react';

const About = () => {
  return (
    <div className="container py-5 scroll-enabled">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="fw-black tracking-tighter mb-4">WE ARE STYLEHUB.</h1>
          <p className="fs-5">The marketplace is saturated with noise. We provide the signal. Founded in 2024, our mission is to curate only the most essential streetwear pieces for those who value quality over hype.</p>
        </div>
        <div className="col-lg-6">
          <div className="p-5 bg-dark text-white rounded-4">
             <h4 className="fw-bold mb-3">OUR STATS</h4>
             <p>150+ Brands Curated</p>
             <p>Worldwide Shipping</p>
             <p>24/7 Expert Support</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;