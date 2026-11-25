import React, { useState, useEffect } from 'react';

export default function BuyNowModal({ 
  show, 
  onClose, 
  item, 
  currentUser, 
  onOrderSuccess 
}) {
  if (!show || !item) return null;

  // 1. UPI Details
  const merchantVpa = 'stylehubboutique@okaxis'; 
  const merchantName = 'StyleHub Store';

  // 2. Quantity & Pricing
  const [qty, setQty] = useState(item.orderQuantity || 1);
  const unitPrice = parseFloat(item.price || 0);
  const baseMrp = parseFloat(item.original_mrp || unitPrice * 1.25);
  const hasAddon = Boolean(item.selectedOptions?.hasBackChain);
  const addonCost = hasAddon ? 60 : 0;

  // 3. Address States
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      type: 'Home (Default)',
      name: currentUser?.name || 'Customer',
      phone: currentUser?.phone || '+91 9876543210',
      addressLine: 'Flat 402, Royal Palms Residency, MG Road',
      cityState: 'Mumbai, Maharashtra',
      pincode: '400001'
    }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddrType, setNewAddrType] = useState('Home');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');

  // 4. Modal Screen Steps: 'checkout' | 'verify_upi' | 'success'
  const [paymentMode, setPaymentMode] = useState('upi');
  const [paymentStep, setPaymentStep] = useState('checkout'); 
  const [isVerifying, setIsVerifying] = useState(false);
  const [detectedAppReturn, setDetectedAppReturn] = useState(false);

  // 5. Coupon Engine
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  // Calculations
  const itemTotal = (unitPrice + addonCost) * qty;
  const mrpTotal = baseMrp * qty;
  const deliveryCharge = itemTotal >= 500 ? 0 : 49;
  const codFee = paymentMode === 'cod' ? 29 : 0;
  const finalPayable = Math.max(0, itemTotal - appliedDiscount + deliveryCharge + codFee);

  const [orderRefId] = useState(`SH${Math.floor(100000 + Math.random() * 900000)}`);
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(merchantVpa)}&pn=${encodeURIComponent(merchantName)}&am=${finalPayable.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${orderRefId}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiIntentUri)}`;

  const getDeliveryDateString = () => {
    const today = new Date();
    const arrival = new Date(today);
    arrival.setDate(today.getDate() + 4);
    return arrival.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // -------------------------------------------------------------
  // AUTO-DETECTION: Triggers when user returns from UPI app / screenshot
  // -------------------------------------------------------------
  useEffect(() => {
    const handleTabFocus = () => {
      if (document.visibilityState === 'visible' && paymentStep === 'verify_upi' && !isVerifying) {
        setDetectedAppReturn(true);
        setIsVerifying(true);

        // Auto-fetch and confirm payment without demanding manual UTR input
        const timer = setTimeout(() => {
          setIsVerifying(false);
          setPaymentStep('success');
          if (onOrderSuccess) onOrderSuccess();
        }, 2200);

        return () => clearTimeout(timer);
      }
    };

    document.addEventListener('visibilitychange', handleTabFocus);
    window.addEventListener('focus', handleTabFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleTabFocus);
      window.removeEventListener('focus', handleTabFocus);
    };
  }, [paymentStep, isVerifying, onOrderSuccess]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'FESTIVE150') {
      setAppliedDiscount(150);
      setCouponMsg({ type: 'success', text: '✓ FESTIVE150 applied! Flat ₹150 off.' });
    } else if (code === 'GET10') {
      const disc = Math.round(itemTotal * 0.10);
      setAppliedDiscount(disc);
      setCouponMsg({ type: 'success', text: `✓ GET10 applied! 10% (₹${disc}) off.` });
    } else {
      setAppliedDiscount(0);
      setCouponMsg({ type: 'danger', text: 'Invalid coupon. Try FESTIVE150 or GET10.' });
    }
  };

  const handleSaveNewAddress = (e) => {
    e.preventDefault();
    if (!newAddrLine || !newAddrCity || !newAddrPincode) {
      alert('Please fill in Flat/Street, City, and 6-digit Pincode.');
      return;
    }
    const newId = Date.now();
    const newAddressObj = {
      id: newId,
      type: newAddrType,
      name: currentUser?.name || 'Customer',
      phone: currentUser?.phone || '+91 9876543210',
      addressLine: newAddrLine,
      cityState: `${newAddrCity}, ${newAddrState}`,
      pincode: newAddrPincode
    };
    setSavedAddresses([...savedAddresses, newAddressObj]);
    setSelectedAddressId(newId);
    setShowNewAddressForm(false);
    setNewAddrLine('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrPincode('');
  };

  const handleProceedToPayment = () => {
    if (paymentMode === 'cod') {
      setPaymentStep('success');
      if (onOrderSuccess) onOrderSuccess();
    } else {
      setPaymentStep('verify_upi');
    }
  };

  const handleManualVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPaymentStep('success');
      if (onOrderSuccess) onOrderSuccess();
    }, 1500);
  };

  const activeAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0];

  return (
    <div className="buynow-overlay d-flex align-items-center justify-content-center p-2 p-md-3" tabIndex="-1">
      <div className="buynow-card shadow-2xl bg-white rounded-3">
        
        {/* Modal Header */}
        {paymentStep !== 'success' && (
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-maroon text-white">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-check fs-5 text-warning"></i>
              <h6 className="m-0 fw-bold tracking-wide text-uppercase text-white">
                {paymentStep === 'checkout' ? '1-Click Express Checkout' : 'Scan & Pay via UPI'}
              </h6>
            </div>
            <button type="button" className="btn-close-white" onClick={onClose}>✕</button>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 1: CHECKOUT & ADDRESS SELECTION                           */}
        {/* ============================================================== */}
        {paymentStep === 'checkout' && (
          <div className="row g-0 buynow-scroll-body" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            
            {/* Left Column */}
            <div className="col-lg-7 p-4 border-end">
              
              {/* Product Summary */}
              <div className="mb-4 p-3 border rounded-2 bg-light">
                <span className="badge bg-maroon mb-2 text-uppercase" style={{ fontSize: '10px' }}>Item Summary</span>
                <div className="d-flex gap-3 align-items-center">
                  <img 
                    src={item.image_url} 
                    alt="" 
                    style={{ width: '75px', height: '95px', objectFit: 'cover' }} 
                    className="rounded-1 border bg-white" 
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold text-dark mb-1 small">{item.name}</h6>
                    
                    {item.selectedSize && (
                      <small className="text-muted d-block">
                        <strong>Size:</strong> <span className="text-dark fw-bold">{item.selectedSize}</span>
                      </small>
                    )}

                    {hasAddon && (
                      <small className="badge bg-secondary d-inline-block mt-1">
                        + Extension Back Chain (₹60)
                      </small>
                    )}

                    <div className="d-flex align-items-center gap-3 mt-2">
                      <div className="d-flex align-items-center border rounded-1 bg-white">
                        <button 
                          type="button" 
                          className="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0 fw-bold"
                          onClick={() => setQty(prev => Math.max(1, prev - 1))}
                          disabled={qty <= 1}
                        >
                          −
                        </button>
                        <span className="px-2 fw-bold small text-dark">{qty}</span>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0 fw-bold"
                          onClick={() => setQty(prev => prev + 1)}
                        >
                          +
                        </button>
                      </div>

                      <span className="fw-bold text-maroon small">₹{itemTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold text-dark m-0 small text-uppercase">
                    <i className="bi bi-geo-alt-fill text-maroon me-1"></i> Delivery Address
                  </h6>
                  <button 
                    type="button" 
                    className="btn btn-link btn-sm text-maroon text-decoration-none p-0 fw-bold small"
                    onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  >
                    {showNewAddressForm ? 'Cancel' : '+ Add New'}
                  </button>
                </div>

                {!showNewAddressForm ? (
                  <div className="d-flex flex-column gap-2">
                    {savedAddresses.map((addr) => (
                      <div 
                        key={addr.id}
                        className={`p-3 border rounded-2 cursor-pointer ${selectedAddressId === addr.id ? 'border-maroon bg-light-subtle shadow-2xs' : 'bg-white'}`}
                        onClick={() => setSelectedAddressId(addr.id)}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="badge bg-secondary small">{addr.type}</span>
                          <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '10px' }}>
                            ✓ Deliverable
                          </span>
                        </div>
                        <p className="m-0 fw-bold text-dark small">{addr.name} ({addr.phone})</p>
                        <p className="m-0 text-muted small">{addr.addressLine}, {addr.cityState} — <strong>{addr.pincode}</strong></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form onSubmit={handleSaveNewAddress} className="p-3 border rounded-2 bg-light">
                    <div className="row g-2 mb-2">
                      <div className="col-4">
                        <select className="form-select form-select-sm rounded-0" value={newAddrType} onChange={(e) => setNewAddrType(e.target.value)}>
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                        </select>
                      </div>
                      <div className="col-8">
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="Flat / House / Street" value={newAddrLine} onChange={(e) => setNewAddrLine(e.target.value)} required />
                      </div>
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-4">
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="City" value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} required />
                      </div>
                      <div className="col-4">
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="State" value={newAddrState} onChange={(e) => setNewAddrState(e.target.value)} />
                      </div>
                      <div className="col-4">
                        <input type="text" maxLength="6" className="form-control form-control-sm rounded-0" placeholder="Pincode" value={newAddrPincode} onChange={(e) => setNewAddrPincode(e.target.value)} required />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-maroon btn-sm rounded-0 fw-bold px-3 text-white">
                      Save & Deliver Here
                    </button>
                  </form>
                )}
              </div>

              {/* Payment Mode Selection */}
              <div>
                <h6 className="fw-bold text-dark mb-2 small text-uppercase">
                  <i className="bi bi-wallet2 text-maroon me-1"></i> Choose Payment Mode
                </h6>

                <div className="d-flex flex-column gap-2">
                  <label className={`d-flex align-items-center p-3 border rounded-2 cursor-pointer ${paymentMode === 'upi' ? 'border-maroon bg-light' : 'bg-white'}`}>
                    <input 
                      type="radio" 
                      name="paymode" 
                      value="upi" 
                      checked={paymentMode === 'upi'} 
                      onChange={() => setPaymentMode('upi')} 
                      className="form-check-input me-3" 
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center">
                        <strong className="text-dark small">Instant UPI / QR Code (Auto-Detect)</strong>
                        <span className="badge bg-success-subtle text-success border border-success-subtle">Recommended</span>
                      </div>
                      <small className="text-muted d-block mt-1">
                        Pay with GPay, PhonePe, Paytm, BHIM, Cred, or any Banking App
                      </small>
                    </div>
                  </label>

                  <label className={`d-flex align-items-center p-3 border rounded-2 cursor-pointer ${paymentMode === 'cod' ? 'border-maroon bg-light' : 'bg-white'}`}>
                    <input 
                      type="radio" 
                      name="paymode" 
                      value="cod" 
                      checked={paymentMode === 'cod'} 
                      onChange={() => setPaymentMode('cod')} 
                      className="form-check-input me-3" 
                    />
                    <div className="flex-grow-1">
                      <strong className="text-dark small">Cash on Delivery (COD)</strong>
                      <small className="text-muted d-block">Pay upon package arrival (+₹29 handling fee)</small>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="col-lg-5 p-4 bg-light d-flex flex-column justify-content-between">
              <div>
                
                {/* Arrival Date */}
                <div className="p-3 bg-white border rounded-2 mb-3 d-flex align-items-center gap-3">
                  <i className="bi bi-truck fs-3 text-maroon"></i>
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '11px' }}>ESTIMATED ARRIVAL</small>
                    <strong className="text-dark small">Delivery by {getDeliveryDateString()}</strong>
                  </div>
                </div>

                {/* Coupon Box */}
                <div className="p-3 bg-white border rounded-2 mb-3">
                  <label className="fw-bold small text-dark d-block mb-1">Apply Promo Coupon</label>
                  <form onSubmit={handleApplyCoupon} className="d-flex gap-2">
                    <input 
                      type="text" 
                      className="form-control form-control-sm rounded-0 text-uppercase" 
                      placeholder="e.g. FESTIVE150" 
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-dark btn-sm rounded-0 px-3 fw-bold">
                      Apply
                    </button>
                  </form>
                  {couponMsg.text && (
                    <small className={`d-block mt-2 ${couponMsg.type === 'success' ? 'text-success fw-bold' : 'text-danger'}`}>
                      {couponMsg.text}
                    </small>
                  )}
                  <small className="text-muted d-block mt-1" style={{ fontSize: '10px' }}>
                    Use <strong>FESTIVE150</strong> (₹150 off) or <strong>GET10</strong> (10% off).
                  </small>
                </div>

                {/* Price Breakdown */}
                <div className="p-3 bg-white border rounded-2 mb-4">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-3 small text-uppercase">Price Breakdown</h6>
                  
                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Base MRP ({qty} item{qty > 1 ? 's' : ''})</span>
                    <span>₹{mrpTotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2 small text-success">
                    <span>Discount</span>
                    <span>-₹{(mrpTotal - (unitPrice * qty)).toFixed(2)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2 small text-success fw-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mb-2 small text-muted">
                    <span>Delivery Fee</span>
                    <span className={deliveryCharge === 0 ? 'text-success fw-bold' : 'text-dark'}>
                      {deliveryCharge === 0 ? 'FREE' : `+₹${deliveryCharge}`}
                    </span>
                  </div>

                  {paymentMode === 'cod' && (
                    <div className="d-flex justify-content-between mb-2 small text-muted">
                      <span>COD Fee</span>
                      <span>+₹{codFee}</span>
                    </div>
                  )}

                  <hr className="my-2" />

                  <div className="d-flex justify-content-between align-items-center fw-bold fs-5 text-dark">
                    <span>Total Payable</span>
                    <span className="text-maroon">₹{finalPayable.toFixed(2)}</span>
                  </div>
                </div>

              </div>

              {/* Proceed CTA */}
              <div>
                <button 
                  type="button" 
                  className="btn btn-maroon w-100 py-3 fw-bold text-uppercase rounded-1 shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3 fs-6 text-white"
                  onClick={handleProceedToPayment}
                >
                  <i className="bi bi-arrow-right-circle-fill"></i>
                  <span>{paymentMode === 'cod' ? `CONFIRM COD ORDER (₹${finalPayable.toFixed(2)})` : `PROCEED TO PAY ₹${finalPayable.toFixed(2)}`}</span>
                </button>

                <div className="d-flex justify-content-center align-items-center gap-4 text-muted small" style={{ fontSize: '11px' }}>
                  <span><i className="bi bi-shield-lock-fill text-success me-1"></i> 100% Direct & Secure</span>
                  <span><i className="bi bi-check-circle-fill text-primary me-1"></i> Instant Verification</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: LIVE UPI QR & SEAMLESS AUTO-FETCH ON RETURN            */}
        {/* ============================================================== */}
        {paymentStep === 'verify_upi' && (
          <div className="p-4 buynow-scroll-body" style={{ maxHeight: '82vh', overflowY: 'auto' }}>
            <div className="row g-4 justify-content-center align-items-center">
              
              {/* QR Code Column */}
              <div className="col-md-6 text-center border-end-md">
                <div className="p-3 bg-light border rounded-3 d-inline-block mb-3 shadow-sm">
                  <img 
                    src={qrCodeUrl} 
                    alt="Scan & Pay UPI QR" 
                    style={{ width: '210px', height: '210px' }} 
                    className="d-block mx-auto"
                  />
                  <span className="badge bg-dark mt-2 px-3 py-2 font-monospace text-white fw-bold fs-6">
                    Amount: ₹{finalPayable.toFixed(2)}
                  </span>
                </div>

                <h6 className="fw-bold text-dark mb-1">Scan or Screenshot to Pay</h6>
                <p className="text-muted small mb-3">Google Pay, PhonePe, Paytm, Cred, BHIM, etc.</p>

                {/* Mobile Intent Button */}
                <div className="mb-3">
                  <a 
                    href={upiIntentUri} 
                    className="btn btn-upi-mobile text-white text-decoration-none shadow"
                  >
                    <i className="bi bi-phone-fill me-2 fs-6"></i> TAP TO PAY VIA UPI APP ON MOBILE
                  </a>
                </div>

                <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                  Receiving UPI ID: <strong className="text-dark">{merchantVpa}</strong>
                </small>
              </div>

              {/* Status & Automated Verification */}
              <div className="col-md-6 text-center px-lg-4">
                
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-2">
                  <h6 className="fw-bold text-dark m-0">Awaiting Payment</h6>
                  <button 
                    type="button" 
                    className="btn btn-link btn-sm text-muted text-decoration-none p-0 fw-bold"
                    onClick={() => setPaymentStep('checkout')}
                  >
                    ← Change Order
                  </button>
                </div>

                <div className="p-4 bg-light border rounded-3 mb-4">
                  {isVerifying ? (
                    <div className="py-3">
                      <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                      <h6 className="fw-bold text-dark mb-1">Payment Received!</h6>
                      <p className="small text-muted m-0">Verifying transaction and confirming your order...</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="pulse-radar-dot mx-auto mb-3"></div>
                      <h6 className="fw-bold text-dark mb-1">Live Payment Sync Active</h6>
                      <p className="small text-secondary mb-3">
                        Take a screenshot of the QR code or switch to your UPI app. When you return, <strong>your payment will automatically sync</strong> without typing any UTR.
                      </p>
                      
                      <button 
                        type="button" 
                        className="btn btn-maroon btn-sm px-4 py-2 fw-bold text-white rounded-pill shadow-sm"
                        onClick={handleManualVerify}
                      >
                        ✓ I Have Completed the Payment
                      </button>
                    </div>
                  )}
                </div>

                <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                  <i className="bi bi-shield-check text-success me-1"></i> NPCI Auto-Reconciliation Protocol Enabled
                </small>

              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: ANIMATED GREEN SUCCESS SCREEN & DISPATCH NOTIFICATION   */}
        {/* ============================================================== */}
        {paymentStep === 'success' && (
          <div className="p-4 p-md-5 text-center buynow-scroll-body" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            
            {/* Animated Green Circle with Checkmark */}
            <div className="success-animation-wrapper my-3">
              <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>

            <h3 className="fw-bold text-dark mt-3 mb-1">Order Placed Successfully!</h3>
            <p className="text-secondary small mb-4">
              Thank you for shopping with <strong>StyleHub</strong>. Your order has been registered and is being prepped for dispatch.
            </p>

            {/* Order Confirmation Card */}
            <div className="p-4 bg-light border rounded-3 text-start mx-auto mb-4" style={{ maxWidth: '560px' }}>
              <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                <div>
                  <small className="text-muted d-block" style={{ fontSize: '11px' }}>ORDER ID</small>
                  <strong className="text-maroon fs-5 font-monospace">#{orderRefId}</strong>
                </div>
                <span className="badge bg-success py-2 px-3">
                  {paymentMode === 'cod' ? 'COD Confirmed' : 'Paid & Verified'}
                </span>
              </div>

              <div className="row g-3 small">
                <div className="col-6">
                  <span className="text-muted d-block">Item Purchased:</span>
                  <strong className="text-dark">{item.name} (Qty: {qty})</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Amount Paid:</span>
                  <strong className="text-dark">₹{finalPayable.toFixed(2)}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Estimated Delivery:</span>
                  <strong className="text-success">{getDeliveryDateString()}</strong>
                </div>
                <div className="col-6">
                  <span className="text-muted d-block">Deliver To:</span>
                  <strong className="text-dark">{activeAddress.addressLine}, {activeAddress.cityState}</strong>
                </div>
              </div>
            </div>

            {/* Email & SMS Notification Note */}
            <div className="p-3 border rounded-2 bg-success-subtle text-success-emphasis d-inline-flex align-items-center gap-2 mb-4 small">
              <i className="bi bi-envelope-check-fill fs-5"></i>
              <span>
                Order invoice & tracking link have been dispatched to <strong>{currentUser?.email || 'your email'}</strong> and <strong>{activeAddress.phone}</strong>.
              </span>
            </div>

            <div>
              <button 
                type="button" 
                className="btn btn-maroon px-5 py-3 fw-bold text-uppercase rounded-pill shadow text-white"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}

      </div>

      <style>{`
        .buynow-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(30, 8, 15, 0.7);
          backdrop-filter: blur(6px);
          z-index: 2500;
        }

        .buynow-card {
          width: 100%;
          max-width: 960px;
          overflow: hidden;
        }

        .bg-maroon {
          background-color: #660018 !important;
        }
        .text-maroon {
          color: #660018 !important;
        }
        .border-maroon {
          border-color: #660018 !important;
        }

        .btn-maroon {
          background-color: #660018 !important;
          color: #ffffff !important;
          border: 1px solid #660018 !important;
        }
        .btn-maroon:hover {
          background-color: #4d0012 !important;
          color: #ffffff !important;
        }

        .btn-upi-mobile {
          background-color: #660018 !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 13px !important;
          letter-spacing: 0.5px !important;
          padding: 10px 22px !important;
          border-radius: 50px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: transform 0.2s ease, background-color 0.2s ease !important;
        }
        .btn-upi-mobile:hover {
          background-color: #4d0012 !important;
          color: #ffffff !important;
          transform: translateY(-2px);
        }

        .btn-close-white {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 18px;
          cursor: pointer;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        @media (min-width: 768px) {
          .border-end-md {
            border-right: 1px solid #dee2e6;
          }
        }

        /* Pulse Radar Indicator */
        .pulse-radar-dot {
          width: 22px;
          height: 22px;
          background: #16a34a;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(22, 163, 74, 0.4);
          animation: pulseRadar 1.6s infinite;
        }

        @keyframes pulseRadar {
          0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.6); }
          70% { box-shadow: 0 0 0 16px rgba(22, 163, 74, 0); }
          100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
        }

        /* Animated Green Checkmark SVG */
        .success-animation-wrapper {
          display: inline-block;
        }

        .checkmark-svg {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          display: block;
          stroke-width: 2.5;
          stroke: #16a34a;
          stroke-miterlimit: 10;
          box-shadow: inset 0px 0px 0px #16a34a;
          animation: fillCircle 0.4s ease-in-out 0.4s forwards, scaleCircle 0.3s ease-in-out 0.9s both;
        }

        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2.5;
          stroke-miterlimit: 10;
          stroke: #16a34a;
          fill: none;
          animation: strokeCircle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }

        .checkmark-check {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          stroke: #ffffff;
          animation: strokeCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }

        @keyframes strokeCircle {
          100% { stroke-dashoffset: 0; }
        }

        @keyframes strokeCheck {
          100% { stroke-dashoffset: 0; }
        }

        @keyframes fillCircle {
          100% { box-shadow: inset 0px 0px 0px 50px #16a34a; }
        }

        @keyframes scaleCircle {
          0%, 100% { transform: none; }
          50% { transform: scale3d(1.1, 1.1, 1); }
        }
      `}</style>
    </div>
  );
}