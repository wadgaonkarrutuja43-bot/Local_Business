import React, { useState, useEffect } from 'react';

export default function CustomerDashboard({ 
  show, 
  onClose, 
  currentUser, 
  onProfileUpdate, 
  wishlist = [], 
  onMoveWishlistToCart,
  onOpenSection 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // Orders State with active live status, returns, and invoice actions
  const [orders, setOrders] = useState([
    {
      id: 'SH-84920',
      date: 'Aug 14, 2026',
      total: 4092,
      status: 'Out for Delivery',
      statusStep: 3, // 1: Placed, 2: Dispatched, 3: Out for Delivery, 4: Delivered
      items: [
        { name: 'Peach Embroidered Georgette Lehenga Choli', size: 'M', qty: 1, price: 4092, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400' }
      ]
    },
    {
      id: 'SH-72109',
      date: 'Jul 28, 2026',
      total: 1499,
      status: 'Delivered',
      statusStep: 4,
      items: [
        { name: 'Grand Bridal Kemp Stone Haram Combo Set', size: 'Standard', qty: 1, price: 1499, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400' }
      ]
    }
  ]);

  // Order Return Form State
  const [returnOrderId, setReturnOrderId] = useState('');
  const [returnReason, setReturnReason] = useState("Size doesn't fit");
  const [returnMsg, setReturnMsg] = useState('');

  // Personal Profile States
  const [firstName, setFirstName] = useState(currentUser?.firstName || '');
  const [lastName, setLastName] = useState(currentUser?.lastName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  // Email & Password Change States
  const [newEmail, setNewEmail] = useState('');
  const [currentPassForEmail, setCurrentPassForEmail] = useState('');
  const [currentPassForPass, setCurrentPassForPass] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  // Address Book State
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      isDefault: true,
      flat: 'Flat 402, Royal Palms Residency',
      street: 'MG Road, Near Central Plaza',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    }
  ]);

  const [newAddrType, setNewAddrType] = useState('Home');
  const [newAddrFlat, setNewAddrFlat] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('');

  // Support Ticket Form State
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    if (show && currentUser) {
      const nameParts = (currentUser.name || '').trim().split(' ');
      setFirstName(currentUser.firstName || nameParts[0] || '');
      setLastName(currentUser.lastName || nameParts.slice(1).join(' ') || '');
      setPhone(currentUser.phone || '');
      setProfileMsg('');
      setSecurityMsg({ type: '', text: '' });
      setReturnMsg('');
    }
  }, [show, currentUser]);

  if (!show) return null;

  // 1. Personal Details Submit
  const handlePersonalUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    const res = await onProfileUpdate({
      newFirstName: firstName,
      newLastName: lastName,
      newPhone: phone
    });

    if (res && res.success) {
      setProfileMsg('✓ Profile information updated successfully!');
    } else {
      setProfileMsg(res?.message || 'Failed to update profile.');
    }
  };

  // 2. Email Change Submit
  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });
    if (!newEmail || newEmail === currentUser.email) {
      setSecurityMsg({ type: 'danger', text: 'Please enter a different new email address.' });
      return;
    }
    const res = await onProfileUpdate({
      currentPassword: currentPassForEmail,
      newEmail: newEmail
    });

    if (res && res.success) {
      setSecurityMsg({ type: 'success', text: 'Email updated successfully!' });
      setCurrentPassForEmail('');
      setNewEmail('');
    } else {
      setSecurityMsg({ type: 'danger', text: res?.message || 'Verification failed.' });
    }
  };

  // 3. Password Change Submit
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSecurityMsg({ type: '', text: '' });
    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }
    const res = await onProfileUpdate({
      currentPassword: currentPassForPass,
      newPassword: newPassword
    });

    if (res && res.success) {
      setSecurityMsg({ type: 'success', text: 'Password changed successfully!' });
      setCurrentPassForPass('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setSecurityMsg({ type: 'danger', text: res?.message || 'Verification failed.' });
    }
  };

  // 4. Address Book Actions
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddrFlat || !newAddrCity || !newAddrPincode) {
      alert('Please fill all required address fields.');
      return;
    }

    const newAddressObj = {
      id: Date.now(),
      type: newAddrType,
      isDefault: addresses.length === 0,
      flat: newAddrFlat,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState,
      pincode: newAddrPincode
    };

    setAddresses([...addresses, newAddressObj]);
    setNewAddrFlat('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrPincode('');
    alert('Address saved to your Address Book!');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  // 5. Returns Submit
  const handleInitiateReturn = (e) => {
    e.preventDefault();
    setReturnMsg(`✓ Return request registered for Order #${returnOrderId}. Our courier partner will pick up the item in 2 business days.`);
    setReturnOrderId('');
  };

  // 6. Support Ticket Submit
  const handleRaiseTicket = (e) => {
    e.preventDefault();
    setTicketSuccess(true);
    setTicketSubject('');
    setTicketMessage('');
  };

  // 7. Delete Account
  const handleDeleteAccount = () => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete your StyleHub account? This cannot be undone.')) {
      localStorage.removeItem('stylehub_user');
      window.location.reload();
    }
  };

  return (
    <div className="customer-dash-overlay d-flex align-items-center justify-content-center p-3" tabIndex="-1">
      <div className="customer-dash-card shadow-2xl bg-white">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom bg-maroon text-white">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-person-circle fs-5"></i>
            <h6 className="m-0 fw-bold tracking-wide text-uppercase">My Account Dashboard</h6>
          </div>
          <button type="button" className="btn-close-white" onClick={onClose}>✕</button>
        </div>

        <div className="row g-0" style={{ minHeight: '620px' }}>
          
          {/* Left Navigation Sidebar */}
          <div className="col-md-3 bg-light p-3 border-end d-flex flex-column justify-content-between">
            <div>
              {/* User Avatar Card */}
              <div className="user-profile-badge mb-3 p-3 bg-white border rounded-2">
                <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Member Profile</small>
                <div className="fw-bold text-dark text-truncate mt-1">{currentUser?.name || 'Customer'}</div>
                <small className="text-secondary text-truncate d-block" style={{ fontSize: '11px' }}>{currentUser?.email}</small>
              </div>

              {/* Sidebar Menu */}
              <div className="d-flex flex-column gap-1">
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'overview' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-grid me-2 text-maroon"></i> Overview
                </button>
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'orders' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <i className="bi bi-box-seam me-2 text-maroon"></i> My Orders ({orders.length})
                </button>
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'profile' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <i className="bi bi-person me-2 text-maroon"></i> Personal Info
                </button>
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'addresses' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('addresses')}
                >
                  <i className="bi bi-geo-alt me-2 text-maroon"></i> Saved Addresses ({addresses.length})
                </button>
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'wishlist' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <i className="bi bi-heart me-2 text-maroon"></i> My Wishlist ({wishlist.length})
                </button>
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'support' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('support')}
                >
                  <i className="bi bi-headset me-2 text-maroon"></i> Help & Support
                </button>
                <button 
                  type="button" 
                  className={`cust-menu-btn ${activeTab === 'security' ? 'active-cust-btn' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-lock me-2 text-maroon"></i> Security & Settings
                </button>
              </div>
            </div>

            <button type="button" className="btn btn-outline-dark btn-sm w-100 mt-3 rounded-pill fw-semibold" onClick={onClose}>
              Back to Store
            </button>
          </div>

          {/* Right Main Content Area */}
          <div className="col-md-9 p-4 cust-content-scroll" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <h5 className="fw-bold text-dark mb-1">Welcome back, {currentUser?.name || 'Shopper'}!</h5>
                <p className="text-muted small mb-4">Manage your recent ethnic apparel drops, saved addresses, and security settings.</p>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="p-3 border rounded-2 bg-light text-center">
                      <span className="text-muted small fw-bold d-block text-uppercase">Total Orders</span>
                      <h3 className="fw-bold text-maroon mt-1 mb-0">{orders.length}</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded-2 bg-light text-center">
                      <span className="text-muted small fw-bold d-block text-uppercase">Wishlist Items</span>
                      <h3 className="fw-bold text-danger mt-1 mb-0">{wishlist.length}</h3>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 border rounded-2 bg-light text-center">
                      <span className="text-muted small fw-bold d-block text-uppercase">Saved Addresses</span>
                      <h3 className="fw-bold text-dark mt-1 mb-0">{addresses.length}</h3>
                    </div>
                  </div>
                </div>

                {/* Latest Order Snapshot */}
                <div className="border p-3 rounded-2 bg-white mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark small text-uppercase">Active Order Progress</span>
                    <span className="badge bg-warning text-dark">{orders[0].status}</span>
                  </div>
                  <p className="small text-muted m-0">Order <strong>#{orders[0].id}</strong> — {orders[0].items[0].name}</p>
                  
                  {/* Step Progress Bar */}
                  <div className="progress mt-3" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${(orders[0].statusStep / 4) * 100}%` }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted mt-1" style={{ fontSize: '10px' }}>
                    <span>Placed</span>
                    <span>Dispatched</span>
                    <span>Out for Delivery</span>
                    <span>Delivered</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-maroon btn-sm px-4 fw-bold text-uppercase" onClick={() => setActiveTab('orders')}>
                    View All Orders
                  </button>
                  <button type="button" className="btn btn-outline-dark btn-sm px-4 fw-bold text-uppercase" onClick={() => setActiveTab('profile')}>
                    Edit Profile
                  </button>
                </div>
              </div>
            )}

            {/* 2. MY ORDERS TAB (ACTIVE TRACKING, INVOICE, RETURNS) */}
            {activeTab === 'orders' && (
              <div>
                <h5 className="fw-bold text-dark mb-3">Order History & Tracking</h5>

                {orders.map((order) => (
                  <div key={order.id} className="border rounded-2 p-3 mb-3 bg-white shadow-2xs">
                    <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                      <div>
                        <strong className="text-dark">Order #{order.id}</strong>
                        <small className="text-muted d-block">Placed on: {order.date}</small>
                      </div>
                      <div className="text-end">
                        <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {order.status}
                        </span>
                        <h6 className="fw-bold text-maroon m-0 mt-1">₹{order.total}</h6>
                      </div>
                    </div>

                    {order.items.map((item, idx) => (
                      <div key={idx} className="d-flex gap-3 align-items-center mb-3">
                        <img src={item.image} alt="" style={{ width: '60px', height: '75px', objectFit: 'cover' }} className="rounded-1 border" />
                        <div className="flex-grow-1">
                          <h6 className="fw-bold text-dark small m-0">{item.name}</h6>
                          <small className="text-muted d-block">Size: {item.size} | Qty: {item.qty}</small>
                          <small className="fw-bold text-dark">₹{item.price}</small>
                        </div>
                      </div>
                    ))}

                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 pt-2 border-top">
                      <div className="d-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-outline-dark btn-sm rounded-0"
                          onClick={() => alert(`Tracking live dispatch for Order #${order.id}: Package in transit with Bluedart / Delhivery.`)}
                        >
                          <i className="bi bi-truck me-1"></i> Track Package
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-sm rounded-0"
                          onClick={() => alert(`Downloading official PDF GST invoice for Order #${order.id}...`)}
                        >
                          <i className="bi bi-file-earmark-arrow-down me-1"></i> Invoice
                        </button>
                      </div>

                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm rounded-0"
                        onClick={() => {
                          setReturnOrderId(order.id);
                          setReturnMsg('');
                        }}
                      >
                        Return / Exchange
                      </button>
                    </div>
                  </div>
                ))}

                {/* Return Request Drawer / Sub-Form */}
                {returnOrderId && (
                  <div className="border p-3 rounded-2 bg-light mt-4">
                    <h6 className="fw-bold text-maroon mb-2">Initiate 7-Day Return / Exchange for #{returnOrderId}</h6>
                    {returnMsg ? (
                      <div className="alert alert-success p-2 small">{returnMsg}</div>
                    ) : (
                      <form onSubmit={handleInitiateReturn}>
                        <div className="mb-2">
                          <label className="form-label small text-muted">Reason for Return/Exchange</label>
                          <select 
                            className="form-select form-select-sm rounded-0" 
                            value={returnReason} 
                            onChange={(e) => setReturnReason(e.target.value)}
                          >
                            <option value="Size doesn't fit">Size doesn't fit</option>
                            <option value="Damaged or defective item">Damaged or defective item</option>
                            <option value="Color or design differs from photo">Color or design differs from photo</option>
                            <option value="Quality not as expected">Quality not as expected</option>
                          </select>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-maroon btn-sm rounded-0 fw-bold">
                            Submit Return Request
                          </button>
                          <button type="button" className="btn btn-outline-secondary btn-sm rounded-0" onClick={() => setReturnOrderId('')}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 3. PERSONAL INFORMATION TAB */}
            {activeTab === 'profile' && (
              <div>
                <h5 className="fw-bold text-dark mb-1">Personal Details</h5>
                <p className="text-muted small mb-4">Keep your contact coordinates up-to-date for smooth order deliveries.</p>

                {profileMsg && <div className="alert alert-info p-2 small mb-3">{profileMsg}</div>}

                <form onSubmit={handlePersonalUpdate} className="border p-4 rounded-2 bg-light">
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small text-muted fw-bold">First Name</label>
                      <input type="text" className="form-control rounded-0" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-muted fw-bold">Last Name</label>
                      <input type="text" className="form-control rounded-0" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-muted fw-bold">Phone Number (For Delivery SMS & OTPs)</label>
                    <input type="tel" className="form-control rounded-0" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>

                  <button type="submit" className="btn btn-maroon px-4 py-2 rounded-0 fw-bold text-uppercase small">
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* 4. SAVED ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <div>
                <h5 className="fw-bold text-dark mb-1">Address Book</h5>
                <p className="text-muted small mb-4">Saved delivery addresses for rapid 1-click checkout.</p>

                <div className="row g-3 mb-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="col-md-6">
                      <div className={`p-3 border rounded-2 bg-white position-relative ${addr.isDefault ? 'border-maroon shadow-2xs' : ''}`}>
                        {addr.isDefault && (
                          <span className="badge bg-maroon position-absolute top-0 end-0 m-2">Default</span>
                        )}
                        <span className="badge bg-secondary mb-2">{addr.type}</span>
                        <p className="small text-dark m-0 fw-bold">{addr.flat}</p>
                        <p className="small text-muted m-0">{addr.street}</p>
                        <p className="small text-muted m-0">{addr.city}, {addr.state} — <strong>{addr.pincode}</strong></p>

                        <div className="d-flex gap-2 mt-3 pt-2 border-top">
                          {!addr.isDefault && (
                            <button 
                              type="button" 
                              className="btn btn-outline-dark btn-sm rounded-0 p-1 px-2"
                              style={{ fontSize: '11px' }}
                              onClick={() => handleSetDefaultAddress(addr.id)}
                            >
                              Set As Default
                            </button>
                          )}
                          <button 
                            type="button" 
                            className="btn btn-outline-danger btn-sm rounded-0 p-1 px-2"
                            style={{ fontSize: '11px' }}
                            onClick={() => handleDeleteAddress(addr.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Address Form */}
                <div className="border p-4 rounded-2 bg-light">
                  <h6 className="fw-bold text-maroon mb-3">+ Add New Address</h6>
                  <form onSubmit={handleAddAddress}>
                    <div className="row g-2 mb-2">
                      <div className="col-4">
                        <label className="form-label small text-muted">Address Type</label>
                        <select className="form-select form-select-sm rounded-0" value={newAddrType} onChange={(e) => setNewAddrType(e.target.value)}>
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-8">
                        <label className="form-label small text-muted">Flat / House No. / Building</label>
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="e.g. Flat 301, Block B" value={newAddrFlat} onChange={(e) => setNewAddrFlat(e.target.value)} required />
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label small text-muted">Street / Area / Landmark</label>
                      <input type="text" className="form-control form-control-sm rounded-0" placeholder="e.g. Near City Mall" value={newAddrStreet} onChange={(e) => setNewAddrStreet(e.target.value)} />
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-4">
                        <label className="form-label small text-muted">City</label>
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="City" value={newAddrCity} onChange={(e) => setNewAddrCity(e.target.value)} required />
                      </div>
                      <div className="col-4">
                        <label className="form-label small text-muted">State</label>
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="State" value={newAddrState} onChange={(e) => setNewAddrState(e.target.value)} />
                      </div>
                      <div className="col-4">
                        <label className="form-label small text-muted">Pincode</label>
                        <input type="text" maxLength="6" className="form-control form-control-sm rounded-0" placeholder="6-digit Pincode" value={newAddrPincode} onChange={(e) => setNewAddrPincode(e.target.value)} required />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-maroon btn-sm rounded-0 fw-bold text-uppercase px-4">
                      Save Address
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 5. MY WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <h5 className="fw-bold text-dark mb-1">My Saved Wishlist ({wishlist.length})</h5>
                <p className="text-muted small mb-4">Your saved ethnic garments and jewellery pieces.</p>

                {wishlist.length > 0 ? (
                  <div className="row row-cols-2 row-cols-md-3 g-3">
                    {wishlist.map((item) => (
                      <div key={item.id} className="col">
                        <div className="card h-100 border rounded-0 text-center p-2 shadow-2xs">
                          <img src={item.image_url} alt="" style={{ height: '160px', objectFit: 'cover' }} className="w-100 mb-2" />
                          <h6 className="fw-bold text-dark small text-truncate m-0">{item.name}</h6>
                          <span className="fw-bold text-maroon small d-block my-1">₹{item.price}</span>
                          <button 
                            type="button" 
                            className="btn btn-maroon btn-sm rounded-0 w-100 fw-bold small text-uppercase"
                            onClick={() => onMoveWishlistToCart(item)}
                          >
                            Move to Bag
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 border bg-light">
                    <i className="bi bi-heart fs-1 text-muted"></i>
                    <p className="text-muted small mt-2">Your wishlist is currently empty.</p>
                  </div>
                )}
              </div>
            )}

            {/* 6. HELP & SUPPORT TAB */}
            {activeTab === 'support' && (
              <div>
                <h5 className="fw-bold text-dark mb-1">Customer Care & Support</h5>
                <p className="text-muted small mb-4">Need help with an order, tailoring size query, or return?</p>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 border rounded-2 bg-light">
                      <strong className="d-block small text-dark mb-1"><i className="bi bi-telephone text-maroon me-2"></i>Helpline</strong>
                      <p className="text-muted small m-0">+91 98765 43210 (9am - 6pm IST)</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded-2 bg-light">
                      <strong className="d-block small text-dark mb-1"><i className="bi bi-envelope text-maroon me-2"></i>Direct Email</strong>
                      <p className="text-muted small m-0">support@stylehub.com</p>
                    </div>
                  </div>
                </div>

                {/* Raise Ticket Form */}
                <div className="border p-4 rounded-2 bg-white shadow-2xs mb-4">
                  <h6 className="fw-bold text-maroon mb-3">Raise A Support Ticket</h6>
                  {ticketSuccess ? (
                    <div className="alert alert-success small p-3">
                      ✓ Ticket raised successfully! Our customer support team will reply to <strong>{currentUser?.email}</strong> within 12 hours.
                    </div>
                  ) : (
                    <form onSubmit={handleRaiseTicket}>
                      <div className="mb-2">
                        <label className="form-label small text-muted">Subject</label>
                        <input type="text" className="form-control form-control-sm rounded-0" placeholder="e.g. Size Exchange / Dispatch Inquiry" value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small text-muted">Message / Question</label>
                        <textarea className="form-control form-control-sm rounded-0" rows="3" placeholder="Describe your question or issue in detail..." value={ticketMessage} onChange={(e) => setTicketMessage(e.target.value)} required></textarea>
                      </div>
                      <button type="submit" className="btn btn-maroon btn-sm rounded-0 fw-bold text-uppercase px-4">
                        Send Ticket
                      </button>
                    </form>
                  )}
                </div>

                {/* Quick Policy Links */}
                <div className="p-3 bg-light border rounded-2 d-flex flex-wrap gap-3">
                  <span className="small text-maroon fw-bold text-decoration-underline cursor-pointer" onClick={() => onOpenSection('faqs')}>View FAQs</span>
                  <span className="small text-maroon fw-bold text-decoration-underline cursor-pointer" onClick={() => onOpenSection('shipping')}>Shipping Policies</span>
                  <span className="small text-maroon fw-bold text-decoration-underline cursor-pointer" onClick={() => onOpenSection('returns')}>7-Day Return Terms</span>
                </div>
              </div>
            )}

            {/* 7. SECURITY & SETTINGS TAB */}
            {activeTab === 'security' && (
              <div>
                <h5 className="fw-bold text-dark mb-1">Account Security & Credentials</h5>
                <p className="text-muted small mb-4">Update your password, email, or manage account permissions.</p>

                {securityMsg.text && (
                  <div className={`alert alert-${securityMsg.type} p-2 small mb-3`}>
                    {securityMsg.text}
                  </div>
                )}

                <div className="row g-3">
                  {/* Change Email */}
                  <div className="col-md-6">
                    <div className="border p-3 rounded-2 bg-light h-100">
                      <h6 className="fw-bold text-dark small mb-2"><i className="bi bi-envelope text-maroon me-1"></i> Change Email</h6>
                      <form onSubmit={handleEmailUpdate}>
                        <div className="mb-2">
                          <label className="form-label small text-muted">New Email</label>
                          <input type="email" className="form-control form-control-sm rounded-0" placeholder="new.email@domain.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small text-muted">Current Password</label>
                          <input type="password" className="form-control form-control-sm rounded-0" placeholder="••••••••" value={currentPassForEmail} onChange={(e) => setCurrentPassForEmail(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-outline-dark btn-sm rounded-0 w-100 fw-bold">
                          Update Email
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="col-md-6">
                    <div className="border p-3 rounded-2 bg-light h-100">
                      <h6 className="fw-bold text-dark small mb-2"><i className="bi bi-key text-maroon me-1"></i> Change Password</h6>
                      <form onSubmit={handlePasswordUpdate}>
                        <div className="mb-2">
                          <label className="form-label small text-muted">Current Password</label>
                          <input type="password" className="form-control form-control-sm rounded-0" placeholder="••••••••" value={currentPassForPass} onChange={(e) => setCurrentPassForPass(e.target.value)} required />
                        </div>
                        <div className="mb-2">
                          <label className="form-label small text-muted">New Password</label>
                          <input type="password" className="form-control form-control-sm rounded-0" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <div className="mb-3">
                          <label className="form-label small text-muted">Confirm Password</label>
                          <input type="password" className="form-control form-control-sm rounded-0" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn btn-maroon btn-sm rounded-0 w-100 fw-bold">
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Permanent Delete Account */}
                <div className="border border-danger-subtle p-3 rounded-2 bg-danger-subtle mt-4">
                  <h6 className="fw-bold text-danger small mb-1">Danger Zone</h6>
                  <p className="text-danger small mb-2">Permanently erase your account, order history, and saved addresses.</p>
                  <button type="button" className="btn btn-danger btn-sm rounded-0 fw-bold" onClick={handleDeleteAccount}>
                    Delete Account Permanently
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      <style>{`
        .customer-dash-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(43, 11, 20, 0.65);
          backdrop-filter: blur(6px);
          z-index: 2200;
        }

        .customer-dash-card {
          width: 100%;
          max-width: 960px;
          border-radius: 6px;
          overflow: hidden;
        }

        .bg-maroon {
          background-color: #660018 !important;
        }

        .text-maroon {
          color: #660018 !important;
        }

        .btn-maroon {
          background-color: #660018;
          color: #ffffff;
          border: 1px solid #660018;
        }
        .btn-maroon:hover {
          background-color: #4d0012;
          color: #ffffff;
        }

        .btn-close-white {
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 16px;
          cursor: pointer;
        }

        .cust-menu-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 9px 12px;
          font-size: 13px;
          font-weight: 600;
          color: #4b5563;
          border-radius: 4px;
          transition: all 0.15s ease;
        }
        .cust-menu-btn:hover {
          background: #e5e7eb;
          color: #111827;
        }
        .active-cust-btn {
          background: #660018 !important;
          color: #ffffff !important;
        }
        .active-cust-btn i {
          color: #ffffff !important;
        }

        .border-maroon {
          border-color: #660018 !important;
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}