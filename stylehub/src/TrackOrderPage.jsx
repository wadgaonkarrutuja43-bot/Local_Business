import React, { useState } from 'react';

export default function TrackOrderPage({ onBack }) {
  const [orderIdInput, setOrderIdInput] = useState('SH861908');
  const [trackedOrder, setTrackedOrder] = useState({
    id: 'SH861908',
    item: 'Peach Embroidered Georgette Lehenga Choli (Size: M)',
    status: 'Out for Delivery',
    currentStep: 4,
    estimatedArrival: 'Today by 6:30 PM',
    deliveryAddress: 'Flat 402, Royal Palms, MG Road, Mumbai - 400001',
    courierPartner: 'BlueDart Express Logistics (AWB: BD749281042)',
    customerPhone: '+91 9284899881',
    deliveryOtp: '4829',
    checkpoints: [
      { time: 'Today, 09:15 AM', text: 'Out for delivery with assigned delivery executive.' },
      { time: 'Yesterday, 07:30 PM', text: 'Arrived at Local Sort Facility (Mumbai Hub).' },
      { time: 'Aug 17, 03:40 PM', text: 'Package processed and dispatched from Central Warehouse.' },
      { time: 'Aug 16, 11:20 AM', text: 'Order confirmed and verified.' }
    ]
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const clean = orderIdInput.replace(/#/g, '').trim().toUpperCase();
    if (clean === 'SH861908') {
      setTrackedOrder({
        id: 'SH861908',
        item: 'Peach Embroidered Georgette Lehenga Choli (Size: M)',
        status: 'Out for Delivery',
        currentStep: 4,
        estimatedArrival: 'Today by 6:30 PM',
        deliveryAddress: 'Flat 402, Royal Palms, MG Road, Mumbai - 400001',
        courierPartner: 'BlueDart Express Logistics (AWB: BD749281042)',
        customerPhone: '+91 9284899881',
        deliveryOtp: '4829',
        checkpoints: [
          { time: 'Today, 09:15 AM', text: 'Out for delivery with assigned delivery executive.' },
          { time: 'Yesterday, 07:30 PM', text: 'Arrived at Local Sort Facility (Mumbai Hub).' },
          { time: 'Aug 17, 03:40 PM', text: 'Package processed and dispatched from Central Warehouse.' },
          { time: 'Aug 16, 11:20 AM', text: 'Order confirmed and verified.' }
        ]
      });
    } else {
      setTrackedOrder({
        id: clean,
        item: 'Handcrafted Ethnic Garment',
        status: 'In Transit',
        currentStep: 3,
        estimatedArrival: 'In 2-3 business days',
        deliveryAddress: 'Registered Delivery Address on file',
        courierPartner: 'Express Surface Logistics',
        customerPhone: '+91 9284899881',
        deliveryOtp: '5192',
        checkpoints: [
          { time: 'Today, 10:00 AM', text: 'In transit to destination sorting hub.' },
          { time: 'Yesterday, 04:30 PM', text: 'Order packed and dispatched from merchant facility.' }
        ]
      });
    }
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <button className="btn btn-outline-dark btn-sm rounded-0 mb-4 fw-semibold" onClick={onBack}>
        ← Back to Store
      </button>

      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <h2 className="fw-bold text-dark mb-1">Track Your Order</h2>
        <p className="text-secondary small mb-4">Enter your order ID to check real-time progress and your delivery handover OTP.</p>

        <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
          <input 
            type="text" 
            className="form-control form-control-lg rounded-0 font-monospace text-uppercase" 
            placeholder="e.g. SH861908" 
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-maroon px-4 fw-bold text-uppercase rounded-0 text-white">
            Track
          </button>
        </form>

        {trackedOrder && (
          <div className="border p-4 bg-white shadow-sm rounded-1">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <div>
                <small className="text-muted d-block">ORDER ID</small>
                <strong className="text-maroon fs-5 font-monospace">#{trackedOrder.id}</strong>
              </div>
              <span className={`badge px-3 py-2 fs-6 ${trackedOrder.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                {trackedOrder.status}
              </span>
            </div>

            {/* Handover OTP Box for Customer */}
            {trackedOrder.status !== 'Delivered' && (
              <div className="p-3 bg-light border border-warning rounded-1 mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <strong className="text-dark small d-block">Doorstep Delivery Handover OTP:</strong>
                  <small className="text-muted">Registered Phone: <strong>{trackedOrder.customerPhone}</strong></small>
                </div>
                <span className="badge bg-dark fs-4 font-monospace px-3 py-2 text-warning letter-spacing-2">
                  {trackedOrder.deliveryOtp}
                </span>
              </div>
            )}

            {/* 5-Step Visual Stepper */}
            <div className="d-flex justify-content-between text-center my-4 position-relative">
              {['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                const isDone = idx + 1 <= trackedOrder.currentStep;
                return (
                  <div key={step} style={{ width: '20%' }}>
                    <div className={`mx-auto rounded-circle d-flex align-items-center justify-content-center fw-bold mb-1 ${isDone ? 'bg-success text-white' : 'bg-light text-muted border'}`} style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                      {isDone ? '✓' : idx + 1}
                    </div>
                    <small className={`d-block ${isDone ? 'fw-bold text-dark' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                      {step}
                    </small>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-light rounded-1 mb-4 small">
              <p className="m-0 mb-1"><strong>Item:</strong> {trackedOrder.item}</p>
              <p className="m-0 mb-1"><strong>Destination:</strong> {trackedOrder.deliveryAddress}</p>
              <p className="m-0 mb-1"><strong>Expected Arrival:</strong> <span className="text-success fw-bold">{trackedOrder.estimatedArrival}</span></p>
              <p className="m-0"><strong>Courier:</strong> {trackedOrder.courierPartner}</p>
            </div>

            <h6 className="fw-bold text-dark mb-3 small text-uppercase">Logistics Transit History</h6>
            <div className="ps-3 border-start">
              {trackedOrder.checkpoints.map((cp, idx) => (
                <div key={idx} className="mb-3 ps-2">
                  <strong className="text-dark small d-block">{cp.text}</strong>
                  <small className="text-muted font-monospace">{cp.time}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .btn-maroon { background-color: #660018; color: #ffffff; }
        .btn-maroon:hover { background-color: #4d0012; color: #ffffff; }
        .text-maroon { color: #660018 !important; }
        .letter-spacing-2 { letter-spacing: 3px; }
      `}</style>
    </div>
  );
}