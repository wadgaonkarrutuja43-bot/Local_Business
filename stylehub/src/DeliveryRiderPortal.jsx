import React, { useState } from 'react';

export default function DeliveryRiderPortal({ onBack }) {
  const [orderQuery, setOrderQuery] = useState('SH861908');
  const [activeTask, setActiveTask] = useState({
    id: 'SH861908',
    customerName: 'Rutuja S.',
    customerPhone: '+919284899881',
    displayPhone: '+91 9284899881',
    address: 'Flat 402, Royal Palms, MG Road, Mumbai - 400001',
    correctOtp: '4829',
    itemSummary: 'Peach Lehenga Choli Box',
    status: 'Out for Delivery'
  });
  const [enteredOtp, setEnteredOtp] = useState('');
  const [deliveryComplete, setDeliveryComplete] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Dynamic test database using your direct mobile number
  const taskDatabase = {
    'SH861908': {
      id: 'SH861908',
      customerName: 'Rutuja S.',
      customerPhone: '+919284899881',
      displayPhone: '+91 9284899881',
      address: 'Flat 402, Royal Palms, MG Road, Mumbai - 400001',
      correctOtp: '4829',
      itemSummary: 'Peach Lehenga Choli Box',
      status: 'Out for Delivery'
    }
  };

  const handleFetchTask = (e) => {
    e.preventDefault();
    const clean = orderQuery.replace(/#/g, '').trim().toUpperCase();
    if (taskDatabase[clean]) {
      setActiveTask(taskDatabase[clean]);
      setDeliveryComplete(false);
      setEnteredOtp('');
      setActionNotice('');
    } else {
      alert(`No active delivery assignment found for Order #${clean}. Try SH861908.`);
    }
  };

  // 1. Direct Cellular Dial
  const handleDirectCall = () => {
    window.open(`tel:+919284899881`, '_self');
  };

  // 2. Direct Native SMS App (Opens default SMS messenger on phone)
  const handleSendNativeSms = () => {
    const message = `Your StyleHub delivery OTP for Order #${activeTask.id} is: ${activeTask.correctOtp}`;
    window.open(`sms:+919284899881?body=${encodeURIComponent(message)}`, '_blank');
    setActionNotice('Opening SMS app with delivery OTP...');
  };

  // 3. Direct WhatsApp Message
  const handleSendWhatsApp = () => {
    const message = `Your StyleHub delivery verification OTP for Order #${activeTask.id} is: ${activeTask.correctOtp}`;
    window.open(`https://api.whatsapp.com/send?phone=919284899881&text=${encodeURIComponent(message)}`, '_blank');
    setActionNotice('Opening WhatsApp chat with delivery OTP...');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp.trim() === activeTask.correctOtp) {
      setDeliveryComplete(true);
      setActiveTask({ ...activeTask, status: 'Delivered' });
    } else {
      alert(`❌ Incorrect OTP. The delivery OTP sent to ${activeTask.displayPhone} is ${activeTask.correctOtp}.`);
    }
  };

  return (
    <div className="bg-light py-5" style={{ minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '620px' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button className="btn btn-outline-dark btn-sm rounded-0 fw-semibold" onClick={onBack}>
            ← Exit Rider Mode
          </button>
          <span className="badge bg-dark px-3 py-2 text-warning fw-bold">Field Delivery Agent</span>
        </div>

        <div className="card shadow-sm border-0 rounded-2 p-4">
          <h4 className="fw-bold text-dark mb-1">Doorstep Handover Verification</h4>
          <p className="text-secondary small mb-4">Enter the assigned Order ID to pull destination info and verify the customer OTP.</p>

          {/* Search Task */}
          <form onSubmit={handleFetchTask} className="mb-4">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control form-control-lg rounded-0 font-monospace text-uppercase" 
                placeholder="Enter Order ID (e.g. SH861908)" 
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                required
              />
              <button className="btn btn-dark fw-bold px-4 rounded-0" type="submit">
                Find Task
              </button>
            </div>
          </form>

          {activeTask && (
            <div className="border rounded-2 p-3 bg-white">
              {deliveryComplete ? (
                <div className="text-center py-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-success text-white rounded-circle mb-3" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-check-lg fs-2"></i>
                  </div>
                  <h5 className="fw-bold text-success">Delivery Successfully Verified!</h5>
                  <p className="small text-muted mb-3">Order #{activeTask.id} marked as DELIVERED in central system.</p>
                  <button className="btn btn-outline-dark btn-sm rounded-0" onClick={() => { setActiveTask(null); setOrderQuery(''); }}>
                    Deliver Next Order
                  </button>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <strong className="text-dark">Order #{activeTask.id}</strong>
                    <span className="badge bg-warning text-dark">{activeTask.status}</span>
                  </div>

                  <div className="p-3 bg-light rounded-1 mb-3 small">
                    <p className="m-0 mb-1"><strong>Customer:</strong> {activeTask.customerName}</p>
                    <p className="m-0 mb-1"><strong>Address:</strong> {activeTask.address}</p>
                    <p className="m-0 mb-3"><strong>Package:</strong> {activeTask.itemSummary}</p>
                    
                    {/* Action Call & Resend OTP Buttons */}
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <button 
                        type="button" 
                        className="btn btn-success btn-sm rounded-pill px-3 fw-bold"
                        onClick={handleDirectCall}
                      >
                        <i className="bi bi-telephone-fill me-1"></i> Call (9284899881)
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm rounded-pill px-3 fw-bold"
                        onClick={handleSendNativeSms}
                      >
                        <i className="bi bi-chat-left-text-fill me-1"></i> Send Direct SMS
                      </button>

                      <button 
                        type="button" 
                        className="btn btn-outline-success btn-sm rounded-pill px-3 fw-bold"
                        onClick={handleSendWhatsApp}
                      >
                        <i className="bi bi-whatsapp me-1"></i> WhatsApp OTP
                      </button>
                    </div>

                    {actionNotice && (
                      <small className="text-success fw-bold d-block mt-2">
                        ✓ {actionNotice}
                      </small>
                    )}
                  </div>

                  <form onSubmit={handleVerifyOtp} className="p-3 border rounded-1 bg-light-subtle">
                    <label className="form-label small fw-bold text-dark">Enter Recipient's 4-Digit OTP</label>
                    <input 
                      type="text" 
                      maxLength="4" 
                      className="form-control form-control-lg text-center font-monospace fw-bold fs-3 text-maroon mb-3 rounded-0" 
                      placeholder="••••"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      required
                      autoFocus
                    />
                    <button type="submit" className="btn btn-success w-100 py-3 fw-bold text-uppercase rounded-0 shadow-sm">
                      VERIFY OTP & COMPLETE DELIVERY
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}