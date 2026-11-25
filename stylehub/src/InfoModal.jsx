import React, { useState, useEffect } from 'react';

export default function InfoModal({ activeSection, onClose }) {
  // Sync tab whenever activeSection prop changes from any footer click
  const [modalTab, setModalTab] = useState(activeSection || 'tracking');

  useEffect(() => {
    if (activeSection) {
      setModalTab(activeSection);
    }
  }, [activeSection]);

  // Customer Tracking Search States
  const [searchOrderId, setSearchOrderId] = useState('SH861908');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Delivery Executive Secure Handover States
  const [riderOrderId, setRiderOrderId] = useState('');
  const [activeRiderOrder, setActiveRiderOrder] = useState(null);
  const [generatedDeliveryOtp, setGeneratedDeliveryOtp] = useState('');
  const [enteredDeliveryOtp, setEnteredDeliveryOtp] = useState('');
  const [otpSmsNotification, setOtpSmsNotification] = useState('');
  const [riderDeliverySuccess, setRiderDeliverySuccess] = useState(false);

  // Vendor / Partner Form
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerCategory, setPartnerCategory] = useState('Ethnic Wear');
  const [partnerMsg, setPartnerMsg] = useState('');

  // Contact / Help Form
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Logistics & Tracking Database
  const [ordersDatabase, setOrdersDatabase] = useState({
    'SH861908': {
      id: 'SH861908',
      customerName: 'Rutuja S.',
      customerPhone: '+91 98765 43210',
      item: 'Peach Embroidered Georgette Lehenga Choli (Size: M)',
      total: '₹4,092.00',
      status: 'Out for Delivery',
      currentStep: 4, // 1: Confirmed, 2: Packed, 3: Shipped, 4: Out for Delivery, 5: Delivered
      isDelayed: false,
      delayReason: '',
      courierPartner: 'BlueDart Express Logistics',
      awbNumber: 'BD749281042',
      deliveryAgent: {
        name: 'Rajesh Sharma',
        badge: 'Verified Logistics Partner'
      },
      estimatedArrival: 'Today by 6:30 PM',
      deliveryAddress: 'Flat 402, Royal Palms, MG Road, Mumbai, Maharashtra - 400001',
      checkpoints: [
        { time: 'Today, 09:15 AM', location: 'Local Distribution Facility (Mumbai Hub)', status: 'Out for Delivery with Rider Rajesh Sharma' },
        { time: 'Yesterday, 07:30 PM', location: 'Western Regional Sort Center (Pune)', status: 'In Transit — Transferred to Last-Mile Facility' },
        { time: 'Aug 17, 03:40 PM', location: 'Central Warehouse (Surat)', status: 'Package Quality Checked & Dispatched' },
        { time: 'Aug 16, 11:20 AM', location: 'StyleHub Merchant Facility', status: 'Order Placed & Confirmed' }
      ]
    },
    'SH742109': {
      id: 'SH742109',
      customerName: 'Pooja Verma',
      customerPhone: '+91 98111 22334',
      item: 'Grand Bridal Kemp Stone Haram Combo Set',
      total: '₹1,499.00',
      status: 'Delayed in Transit',
      currentStep: 3,
      isDelayed: true,
      delayReason: 'Heavy rainfall and highway transport regulation between Central Hub & Local Sort Facility. Package safe in transit warehouse.',
      courierPartner: 'Delhivery Surface Logistics',
      awbNumber: 'DEL993810214',
      deliveryAgent: {
        name: 'Amit Kumar',
        badge: 'Transit Driver'
      },
      estimatedArrival: 'Revised: Tomorrow, 2:00 PM',
      deliveryAddress: 'House 24, Park Avenue, Kothrud, Pune - 411038',
      checkpoints: [
        { time: 'Today, 06:45 AM', location: 'National Highway Sort Hub', status: 'Transit Alert: Delayed due to weather-regulated transport advisory' },
        { time: 'Yesterday, 08:20 PM', location: 'Primary Logistics Hub (Mumbai)', status: 'Departed Facility towards Pune Sort Station' },
        { time: 'Aug 17, 02:00 PM', location: 'StyleHub Boutique Hub', status: 'Order Dispatched' }
      ]
    }
  });

  if (!activeSection) return null;

  // 1. Order Tracking Handler
  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const cleanId = searchOrderId.replace(/#/g, '').trim().toUpperCase();

    if (ordersDatabase[cleanId]) {
      setTrackedOrder(ordersDatabase[cleanId]);
    } else {
      setTrackedOrder({
        id: cleanId,
        customerName: 'Verified Customer',
        customerPhone: '+91 98765 00000',
        item: 'Handcrafted Ethnic Garment',
        total: 'Paid & Verified',
        status: 'In Transit',
        currentStep: 3,
        isDelayed: false,
        courierPartner: 'Express Delivery Logistics',
        awbNumber: `AWB${Math.floor(10000000 + Math.random() * 90000000)}`,
        deliveryAgent: {
          name: 'Suresh Patil',
          badge: 'Verified Logistics Agent'
        },
        estimatedArrival: 'In 2-3 Business Days',
        deliveryAddress: 'Registered Delivery Address on File',
        checkpoints: [
          { time: 'Today, 10:00 AM', location: 'Regional Transit Hub', status: 'Package in Transit to Local Hub' },
          { time: 'Yesterday, 04:30 PM', location: 'Central Sorting Center', status: 'Item Quality Checked & Dispatched' }
        ]
      });
    }
  };

  // 2. Rider Handover & OTP Generation
  const handleRiderFetchOrder = (e) => {
    e.preventDefault();
    const cleanId = riderOrderId.replace(/#/g, '').trim().toUpperCase();
    const found = ordersDatabase[cleanId];

    if (found) {
      setActiveRiderOrder(found);
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedDeliveryOtp(generatedOtp);
      setRiderDeliverySuccess(false);
      setEnteredDeliveryOtp('');

      setOtpSmsNotification(`📲 Customer Mobile Alert (${found.customerPhone}): "Your StyleHub Delivery Verification OTP for Order #${found.id} is ${generatedOtp}. Share this OTP with the delivery agent to collect your parcel."`);
    } else {
      alert(`Order #${cleanId} not found in delivery queue. Try SH861908 or SH742109.`);
    }
  };

  // 3. Rider Verify OTP
  const handleVerifyDeliveryOtp = (e) => {
    e.preventDefault();
    if (enteredDeliveryOtp.trim() === generatedDeliveryOtp) {
      const updatedOrder = {
        ...activeRiderOrder,
        status: 'Delivered',
        currentStep: 5,
        isDelayed: false,
        checkpoints: [
          {
            time: 'Just Now',
            location: 'Customer Doorstep (Verified via OTP)',
            status: `Package successfully delivered to ${activeRiderOrder.customerName}. Customer OTP verified.`
          },
          ...activeRiderOrder.checkpoints
        ]
      };

      setOrdersDatabase({
        ...ordersDatabase,
        [activeRiderOrder.id]: updatedOrder
      });

      if (trackedOrder?.id === activeRiderOrder.id) {
        setTrackedOrder(updatedOrder);
      }

      setRiderDeliverySuccess(true);
      setOtpSmsNotification('');
    } else {
      alert('❌ Invalid OTP! Please enter the 4-digit PIN sent to the customer\'s registered phone.');
    }
  };

  return (
    <div className="info-modal-backdrop d-flex align-items-center justify-content-center p-2 p-md-3" tabIndex="-1">
      
      {/* Real-time SMS Toast simulation */}
      {otpSmsNotification && (
        <div className="delivery-sms-alert-toast shadow-lg">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="toast-dot-pulsing"></span>
            <strong className="text-warning small text-uppercase">Customer Mobile SMS Alert</strong>
          </div>
          <p className="m-0 small text-white">{otpSmsNotification}</p>
        </div>
      )}

      <div className="info-modal-card shadow-2xl border bg-white">
        
        {/* Header Navigation */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-maroon text-white">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shield-check text-warning fs-5"></i>
            <h6 className="m-0 fw-bold text-uppercase tracking-wider text-white">
              StyleHub Information & Order Desk
            </h6>
          </div>
          <button type="button" className="btn-close-white" onClick={onClose}>✕</button>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="bg-light border-bottom px-4 py-2 d-flex flex-wrap gap-2">
          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'tracking' ? 'btn-maroon text-white' : 'btn-outline-secondary bg-white'}`}
            onClick={() => { setModalTab('tracking'); setTrackedOrder(null); }}
          >
            <i className="bi bi-geo-alt me-1"></i> Track Order
          </button>
          
          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'rider' ? 'btn-dark text-warning' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setModalTab('rider')}
          >
            <i className="bi bi-shield-lock me-1"></i> Rider OTP Portal
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'help' || modalTab === 'contact' ? 'btn-maroon text-white' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setModalTab('help')}
          >
            <i className="bi bi-headset me-1"></i> Help & Support
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'about' ? 'btn-maroon text-white' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setModalTab('about')}
          >
            About Us
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'vendor' ? 'btn-maroon text-white' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setModalTab('vendor')}
          >
            Become A Partner
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'tc' ? 'btn-maroon text-white' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setModalTab('tc')}
          >
            T&C
          </button>

          <button 
            type="button" 
            className={`btn btn-sm rounded-0 fw-bold ${modalTab === 'privacy' ? 'btn-maroon text-white' : 'btn-outline-secondary bg-white'}`}
            onClick={() => setModalTab('privacy')}
          >
            Privacy Policy
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-4 info-modal-scroll-area">
          
          {/* ============================================================== */}
          {/* 1. REAL-TIME CUSTOMER ORDER TRACKING VIEW                      */}
          {/* ============================================================== */}
          {modalTab === 'tracking' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="fw-bold text-dark m-0">Live Order Tracking</h5>
                <button 
                  type="button" 
                  className="btn btn-outline-dark btn-sm rounded-0"
                  onClick={() => setModalTab('help')}
                >
                  <i className="bi bi-headset me-1"></i> Need Help with this order?
                </button>
              </div>
              <p className="text-secondary small mb-3">
                Track shipment progress, checkpoints, delivery executive status, and transit alerts.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleTrackSubmit} className="d-flex gap-2 mb-4">
                <input 
                  type="text" 
                  className="form-control rounded-0 form-control-lg font-monospace text-uppercase" 
                  placeholder="e.g. SH861908 or SH742109" 
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-maroon px-4 fw-bold text-uppercase rounded-0 text-white">
                  Track
                </button>
              </form>

              {trackedOrder && (
                <div className="border rounded-2 p-3 p-md-4 bg-white shadow-2xs">
                  
                  {/* Top Order Badge Banner */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3 gap-2">
                    <div>
                      <small className="text-muted d-block">ORDER REFERENCE</small>
                      <strong className="text-maroon fs-5 font-monospace">#{trackedOrder.id}</strong>
                    </div>
                    
                    <div className="text-md-end">
                      <span className={`badge py-2 px-3 fw-bold fs-6 ${trackedOrder.status === 'Delivered' ? 'bg-success' : trackedOrder.isDelayed ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {trackedOrder.status}
                      </span>
                      <small className="text-muted d-block mt-1">Expected Arrival: <strong className="text-dark">{trackedOrder.estimatedArrival}</strong></small>
                    </div>
                  </div>

                  {/* Delay Reason Notice */}
                  {trackedOrder.isDelayed && (
                    <div className="alert alert-danger p-3 mb-4 rounded-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-exclamation-triangle-fill fs-5"></i>
                        <strong className="small">Transit Delay Notice</strong>
                      </div>
                      <p className="small m-0 text-danger-emphasis">
                        {trackedOrder.delayReason}
                      </p>
                    </div>
                  )}

                  {/* 5-Step Visual Stepper */}
                  <div className="timeline-stepper mb-4 py-2">
                    <div className="d-flex justify-content-between position-relative">
                      
                      <div 
                        className="stepper-track-bar"
                        style={{ width: `${((trackedOrder.currentStep - 1) / 4) * 100}%` }}
                      ></div>

                      {['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map((stepLabel, idx) => {
                        const stepNum = idx + 1;
                        const isCompleted = stepNum <= trackedOrder.currentStep;
                        const isCurrent = stepNum === trackedOrder.currentStep;

                        return (
                          <div key={stepLabel} className="text-center position-relative z-1" style={{ width: '20%' }}>
                            <div className={`stepper-node-circle mx-auto mb-1 ${isCompleted ? 'node-done' : 'node-pending'} ${isCurrent ? 'node-current' : ''}`}>
                              {isCompleted ? '✓' : stepNum}
                            </div>
                            <span className={`d-block small ${isCompleted ? 'fw-bold text-dark' : 'text-muted'}`} style={{ fontSize: '11px' }}>
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}

                    </div>
                  </div>

                  {/* Order Details & Logistics Info */}
                  <div className="row g-3 p-3 bg-light rounded-2 mb-4">
                    <div className="col-md-6">
                      <small className="text-muted d-block">Item Details:</small>
                      <strong className="text-dark small">{trackedOrder.item}</strong>
                      <small className="text-muted d-block mt-2">Delivery Destination:</small>
                      <p className="text-dark small m-0">{trackedOrder.deliveryAddress}</p>
                    </div>
                    
                    <div className="col-md-6 border-start-md">
                      <small className="text-muted d-block">Logistics Partner:</small>
                      <strong className="text-dark small">{trackedOrder.courierPartner}</strong>
                      <small className="text-muted d-block font-monospace">AWB: {trackedOrder.awbNumber}</small>
                      
                      <div className="mt-2 pt-2 border-top">
                        <small className="text-muted d-block">Delivery Executive:</small>
                        <strong className="text-maroon small">{trackedOrder.deliveryAgent.name}</strong>
                        <span className="badge bg-secondary ms-2" style={{ fontSize: '10px' }}>{trackedOrder.deliveryAgent.badge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transit Checkpoint History */}
                  <h6 className="fw-bold text-dark mb-3 small text-uppercase">Checkpoints & Transit History</h6>
                  <div className="checkpoint-timeline ps-3 border-start">
                    {trackedOrder.checkpoints.map((cp, idx) => (
                      <div key={idx} className="checkpoint-item mb-3 position-relative ps-3">
                        <span className={`checkpoint-dot ${idx === 0 ? 'dot-active' : ''}`}></span>
                        <div className="d-flex justify-content-between">
                          <strong className="text-dark small">{cp.status}</strong>
                          <span className="text-muted font-monospace" style={{ fontSize: '11px' }}>{cp.time}</span>
                        </div>
                        <small className="text-secondary d-block">{cp.location}</small>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. RIDER OTP HANDOVER PORTAL                                   */}
          {/* ============================================================== */}
          {modalTab === 'rider' && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-dark py-1 px-2 text-warning">Field Rider Portal</span>
                <h5 className="fw-bold text-dark m-0">Handover OTP Verification</h5>
              </div>
              <p className="text-secondary small mb-4">
                Verify customer delivery securely at the doorstep without administrative access.
              </p>

              <form onSubmit={handleRiderFetchOrder} className="p-3 bg-light border rounded-2 mb-4">
                <label className="form-label small fw-bold text-dark">Enter Customer Order ID</label>
                <div className="d-flex gap-2">
                  <input 
                    type="text" 
                    className="form-control form-control-lg rounded-0 font-monospace text-uppercase" 
                    placeholder="e.g. SH861908" 
                    value={riderOrderId}
                    onChange={(e) => setRiderOrderId(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-dark px-4 fw-bold rounded-0 text-warning text-uppercase">
                    Fetch & Send OTP
                  </button>
                </div>
                <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
                  Testing IDs: <code>SH861908</code> (Out for delivery) or <code>SH742109</code> (Delayed)
                </small>
              </form>

              {activeRiderOrder && (
                <div className="border rounded-2 p-4 bg-white shadow-2xs">
                  {riderDeliverySuccess ? (
                    <div className="text-center py-4">
                      <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                        <i className="bi bi-check-lg fs-1"></i>
                      </div>
                      <h4 className="fw-bold text-success mb-1">Delivery Confirmed & Closed</h4>
                      <p className="text-muted small mb-3">
                        Customer OTP verified. Order status updated to <strong>DELIVERED</strong>.
                      </p>
                      <button 
                        type="button" 
                        className="btn btn-outline-dark btn-sm rounded-0 px-4 fw-bold"
                        onClick={() => { setActiveRiderOrder(null); setRiderOrderId(''); setRiderDeliverySuccess(false); }}
                      >
                        Deliver Next Package
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <div>
                          <strong className="text-dark">Order #{activeRiderOrder.id}</strong>
                          <small className="text-muted d-block">Recipient: {activeRiderOrder.customerName} ({activeRiderOrder.customerPhone})</small>
                        </div>
                        <span className="badge bg-warning text-dark">{activeRiderOrder.status}</span>
                      </div>

                      <div className="p-3 bg-light rounded-2 mb-3">
                        <small className="text-muted d-block">Delivery Address:</small>
                        <p className="fw-bold text-dark small m-0">{activeRiderOrder.deliveryAddress}</p>
                      </div>

                      <form onSubmit={handleVerifyDeliveryOtp} className="p-3 border rounded-2 bg-light-subtle mb-3">
                        <label className="form-label small fw-bold text-dark">
                          Enter 4-Digit Customer Confirmation OTP <span className="text-danger">*</span>
                        </label>
                        <input 
                          type="text" 
                          maxLength="4" 
                          className="form-control form-control-lg text-center font-monospace fw-bold fs-3 text-maroon mb-3 rounded-0"
                          placeholder="••••"
                          value={enteredDeliveryOtp}
                          onChange={(e) => setEnteredDeliveryOtp(e.target.value.replace(/\D/g, ''))}
                          required
                          autoFocus
                        />
                        <button type="submit" className="btn btn-success w-100 py-3 fw-bold text-uppercase rounded-0 shadow-sm">
                          ✓ Verify OTP & Complete Delivery
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. HELP & SUPPORT / CONTACT VIEW                               */}
          {/* ============================================================== */}
          {(modalTab === 'help' || modalTab === 'contact') && (
            <div>
              <h5 className="fw-bold text-maroon mb-1">Customer Support & Help Desk</h5>
              <p className="text-secondary small mb-4">
                Have questions regarding orders, dispatch, returns, or tailoring sizing? Contact us directly.
              </p>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="p-3 border rounded-2 bg-light h-100">
                    <strong className="d-block text-dark small mb-1"><i className="bi bi-telephone text-maroon me-2"></i>Helpline Support</strong>
                    <p className="text-muted small m-0">+91 98765 43210</p>
                    <small className="text-muted">(Mon–Sat: 9:00 AM – 6:00 PM IST)</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 border rounded-2 bg-light h-100">
                    <strong className="d-block text-dark small mb-1"><i className="bi bi-envelope text-maroon me-2"></i>Email Support</strong>
                    <p className="text-muted small m-0">support@stylehub.com</p>
                    <small className="text-muted">(Fast response within 12–24 hours)</small>
                  </div>
                </div>
              </div>

              {/* Contact / Help Form */}
              <div className="p-4 border rounded-2 bg-white shadow-2xs">
                <h6 className="fw-bold text-dark mb-3">Send Us A Message</h6>
                {contactSent ? (
                  <div className="alert alert-success p-3 text-center small fw-semibold">
                    ✓ Thank you! Your support ticket has been received. Our team will contact you shortly.
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSent(true); }}>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label small text-muted">Your Name</label>
                        <input type="text" className="form-control form-control-sm rounded-0" value={contactName} onChange={(e) => setContactName(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label small text-muted">Email Address</label>
                        <input type="email" className="form-control form-control-sm rounded-0" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small text-muted">Message / Question</label>
                      <textarea className="form-control form-control-sm rounded-0" rows="3" placeholder="How can we help you?" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} required></textarea>
                    </div>
                    <button type="submit" className="btn btn-maroon w-100 py-2 rounded-0 fw-bold small text-uppercase text-white">
                      Send Support Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. ABOUT US VIEW                                               */}
          {/* ============================================================== */}
          {modalTab === 'about' && (
            <div>
              <h5 className="fw-bold text-maroon mb-3">About StyleHub</h5>
              <p className="text-secondary small lh-base">
                Welcome to <strong>StyleHub</strong>, your premier destination for handcrafted ethnic wear, designer sarees, bridal lehengas, kurtis, and curated traditional jewellery.
              </p>
              <p className="text-secondary small lh-base">
                We are dedicated to delivering authentic craftsmanship, premium textiles, and trendsetting ethnic couture directly to your doorstep with reliable logistics and customer care.
              </p>
              <div className="row g-3 my-3">
                <div className="col-4 text-center p-3 bg-light border">
                  <i className="bi bi-patch-check text-maroon fs-3 mb-2 d-block"></i>
                  <strong className="d-block small">100% Authentic</strong>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Quality Tested</small>
                </div>
                <div className="col-4 text-center p-3 bg-light border">
                  <i className="bi bi-truck text-maroon fs-3 mb-2 d-block"></i>
                  <strong className="d-block small">Fast Delivery</strong>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Tracked Shipping</small>
                </div>
                <div className="col-4 text-center p-3 bg-light border">
                  <i className="bi bi-shield-lock text-maroon fs-3 mb-2 d-block"></i>
                  <strong className="d-block small">Safe Shopping</strong>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Verified Gateways</small>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. BECOME A PARTNER / VENDOR VIEW                              */}
          {/* ============================================================== */}
          {modalTab === 'vendor' && (
            <div>
              <h5 className="fw-bold text-maroon mb-2">Become A Partner / Supplier</h5>
              <p className="text-secondary small mb-3">
                Are you an ethnic fashion boutique, artisan, or manufacturer? Partner with StyleHub to reach buyers across India.
              </p>

              {partnerMsg ? (
                <div className="alert alert-success p-3 small fw-semibold text-center">{partnerMsg}</div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setPartnerMsg('✓ Application submitted! Our partner onboarding team will contact you in 24 hours.'); }} className="p-3 bg-light border">
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-muted">Brand / Business Name</label>
                    <input type="text" className="form-control form-control-sm rounded-0" placeholder="e.g. Elegant Weaves" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label small fw-semibold text-muted">Contact Phone</label>
                    <input type="tel" className="form-control form-control-sm rounded-0" placeholder="+91 98765 43210" value={partnerPhone} onChange={(e) => setPartnerPhone(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-muted">Primary Product Category</label>
                    <select className="form-select form-select-sm rounded-0" value={partnerCategory} onChange={(e) => setPartnerCategory(e.target.value)}>
                      <option value="Sarees">Sarees & Bridal Silk</option>
                      <option value="Lehengas">Designer Lehengas</option>
                      <option value="Jewellery">Traditional Jewellery</option>
                      <option value="Kurtis">Kurtis & Tops</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-maroon w-100 py-2 rounded-0 fw-bold small text-uppercase text-white">
                    Submit Partnership Application
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 6. TERMS & CONDITIONS VIEW                                     */}
          {/* ============================================================== */}
          {modalTab === 'tc' && (
            <div>
              <h5 className="fw-bold text-maroon mb-3">Terms & Conditions</h5>
              <ul className="text-secondary small lh-lg ps-3 mb-0">
                <li>All products displayed on StyleHub are subject to real-time stock availability.</li>
                <li>Handcrafted garments and embroidered weaves may feature slight natural textural variations.</li>
                <li>By placing an order, you agree to our standard store delivery terms and verification policies.</li>
              </ul>
            </div>
          )}

          {/* ============================================================== */}
          {/* 7. PRIVACY POLICY VIEW                                         */}
          {/* ============================================================== */}
          {modalTab === 'privacy' && (
            <div>
              <h5 className="fw-bold text-maroon mb-3">Privacy Policy</h5>
              <ul className="text-secondary small lh-lg ps-3 mb-0">
                <li>We collect only necessary information needed to process, fulfill, and ship your orders.</li>
                <li>Your personal data is encrypted with SSL standards and never sold to third parties.</li>
                <li>Payment credentials and OTP transactions are handled directly through certified, secure channels.</li>
              </ul>
            </div>
          )}

        </div>

        {/* Footer Close Button */}
        <div className="p-3 border-top bg-light text-end">
          <button type="button" className="btn btn-outline-dark btn-sm rounded-0 px-4 fw-bold text-uppercase" onClick={onClose}>
            Close
          </button>
        </div>

      </div>

      <style>{`
        .info-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(43, 11, 20, 0.7);
          backdrop-filter: blur(6px);
          z-index: 2400;
        }

        .info-modal-card {
          width: 100%;
          max-width: 820px;
          border-radius: 4px;
          overflow: hidden;
        }

        .info-modal-scroll-area {
          max-height: 74vh;
          overflow-y: auto;
        }

        .bg-maroon {
          background-color: #660018 !important;
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

        .btn-close-white {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
        }

        /* SMS Simulation Banner */
        .delivery-sms-alert-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #111827;
          border-left: 5px solid #eab308;
          border-radius: 8px;
          padding: 14px 18px;
          z-index: 3000;
          max-width: 380px;
          animation: slideDownToast 0.3s ease forwards;
        }

        .toast-dot-pulsing {
          width: 8px;
          height: 8px;
          background: #eab308;
          border-radius: 50%;
          display: inline-block;
        }

        @keyframes slideDownToast {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Stepper Styling */
        .timeline-stepper {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .stepper-track-bar {
          position: absolute;
          top: 14px;
          left: 10%;
          height: 4px;
          background: #16a34a;
          transition: width 0.4s ease;
          z-index: 0;
        }

        .stepper-node-circle {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: bold;
          border: 2px solid #cbd5e1;
          background: #ffffff;
        }
        .node-done {
          background: #16a34a !important;
          color: #ffffff !important;
          border-color: #16a34a !important;
        }
        .node-current {
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.3);
        }
        .node-pending {
          color: #94a3b8;
        }

        /* Checkpoint list */
        .checkpoint-item {
          border-bottom: 1px dashed #e2e8f0;
          padding-bottom: 8px;
        }
        .checkpoint-dot {
          position: absolute;
          left: -20px;
          top: 4px;
          width: 9px;
          height: 9px;
          background: #94a3b8;
          border-radius: 50%;
        }
        .dot-active {
          background: #16a34a !important;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.25);
        }

        @media (min-width: 768px) {
          .border-start-md {
            border-left: 1px solid #dee2e6;
          }
        }
      `}</style>
    </div>
  );
}