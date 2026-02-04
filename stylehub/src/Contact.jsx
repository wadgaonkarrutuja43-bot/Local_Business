import React from 'react';

const Contact = () => {
  return (
    <div className="container py-5 scroll-enabled">
      <h2 className="fw-black tracking-tighter mb-5 text-center">GET IN TOUCH</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <input type="text" className="form-control mb-3 p-3" placeholder="YOUR NAME" />
          <input type="email" className="form-control mb-3 p-3" placeholder="EMAIL ADDRESS" />
          <textarea className="form-control mb-3 p-3" rows="5" placeholder="MESSAGE"></textarea>
          <button className="btn-solid w-100 py-3">SEND MESSAGE</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;