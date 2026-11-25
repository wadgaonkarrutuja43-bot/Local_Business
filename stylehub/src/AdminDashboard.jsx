import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ show, onClose, currentUser, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Add Product Form Inputs
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productMrp, setProductMrp] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productColors, setProductColors] = useState('');
  const [productFabric, setProductFabric] = useState('');
  const [productWork, setProductWork] = useState('');
  const [productWashCare, setProductWashCare] = useState('Dry Clean Only');
  const [productCategory, setProductCategory] = useState('Saree');
  const [jewellerySubCategory, setJewellerySubCategory] = useState('Necklace');
  const [productImageUrl, setProductImageUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [imageUploadType, setImageUploadType] = useState('file');

  // Edit Product Modal States
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editMrp, setEditMrp] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editColors, setEditColors] = useState('');
  const [editFabric, setEditFabric] = useState('');
  const [editWork, setEditWork] = useState('');
  const [editWashCare, setEditWashCare] = useState('Dry Clean Only');
  const [editCategory, setEditCategory] = useState('Saree');
  const [editJewellerySubCategory, setEditJewellerySubCategory] = useState('Necklace');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUploadType, setEditImageUploadType] = useState('url');

  // Profile Update Inputs
  const [personalName, setPersonalName] = useState(currentUser?.name || '');
  const [personalPhone, setPersonalPhone] = useState(currentUser?.phone || '');
  const [currentPassForEmail, setCurrentPassForEmail] = useState('');
  const [newEmailOnly, setNewEmailOnly] = useState('');
  const [currentPassForPass, setCurrentPassForPass] = useState('');
  const [newPasswordOnly, setNewPasswordOnly] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // 2FA OTP States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userEnteredOtp, setUserEnteredOtp] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [otpNotification, setOtpNotification] = useState('');
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });

  const jewellerySubList = [
    'Earrings',
    'Necklace',
    'Chokers',
    'Long Necklace',
    'Bangles & Bracelets',
    'Bridal Collection',
    'Mangalsutras & Side Locket Chains',
    'Jewellery Sets',
    'Chains & Pendants',
    'Hair Accessories',
    'On Sale'
  ];

  const fetchData = () => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error loading products:', err);
        setProducts([]);
      });

    fetch('http://localhost:5000/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error loading users:', err);
        setUsers([]);
      });
  };

  useEffect(() => {
    if (show) {
      fetchData();
      setPersonalName(currentUser?.name || '');
      setPersonalPhone(currentUser?.phone || '');
      setFormMsg({ type: '', text: '' });
    }
  }, [show, currentUser]);

  if (!show) return null;

  const triggerOtpSecurity = (actionCallback) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setPendingAction(() => actionCallback);
    setShowOtpScreen(true);
    setUserEnteredOtp('');

    setOtpNotification(`🔐 Security Alert: Your verification code is ${code}.`);
    setTimeout(() => setOtpNotification(''), 15000);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (userEnteredOtp.trim() === generatedOtp) {
      setShowOtpScreen(false);
      if (pendingAction) pendingAction();
    } else {
      alert('❌ Invalid Code. Please check the notification and try again.');
    }
  };

  const handleFileChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image too large (max 2MB).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) setEditImageUrl(reader.result);
        else setProductImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productImageUrl) {
      alert('Please upload an image or provide an image link.');
      return;
    }

    // Save exact category format (e.g. "Jewellery - Bridal Collection" or "Saree")
    const finalCategory = productCategory === 'Jewellery'
      ? `Jewellery - ${jewellerySubCategory}`
      : productCategory;

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: finalCategory,
          name: productName,
          price: productPrice,
          original_mrp: productMrp || '',
          stock_quantity: productStock || '',
          available_colors: productColors || '',
          fabric: productFabric || (productCategory === 'Jewellery' ? 'Gold finish Golden Plating' : ''),
          work_type: productWork || '',
          wash_care: productWashCare,
          image_url: productImageUrl,
          description: productDescription || ''
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Product added successfully!');
        setProductName('');
        setProductPrice('');
        setProductMrp('');
        setProductStock('');
        setProductColors('');
        setProductFabric('');
        setProductWork('');
        setProductImageUrl('');
        setProductDescription('');
        setJewellerySubCategory('Necklace');
        fetchData();
        setActiveTab('manage-products');
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      console.error(err);
      alert('Cannot connect to server');
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name || '');
    setEditPrice(product.price || '');
    setEditMrp(product.original_mrp || '');
    setEditStock(product.stock_quantity || '');
    setEditColors(product.available_colors || '');
    setEditFabric(product.fabric || '');
    setEditWork(product.work_type || '');
    setEditWashCare(product.wash_care || 'Dry Clean Only');

    // Parse category and subcategory if it has "Jewellery - Subcategory"
    const rawCat = product.category || 'Saree';
    if (rawCat.toLowerCase().includes('jewel')) {
      setEditCategory('Jewellery');
      const parts = rawCat.split('-');
      if (parts.length > 1) {
        setEditJewellerySubCategory(parts[1].trim());
      } else {
        setEditJewellerySubCategory('Necklace');
      }
    } else {
      setEditCategory(rawCat);
    }

    setEditImageUrl(product.image_url || '');
    setEditDescription(product.description || '');
  };

  // Update Product Submit
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    const finalCategory = editCategory === 'Jewellery'
      ? `Jewellery - ${editJewellerySubCategory}`
      : editCategory;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: finalCategory,
          name: editName,
          price: editPrice,
          original_mrp: editMrp,
          stock_quantity: editStock,
          available_colors: editColors,
          fabric: editFabric,
          work_type: editWork,
          wash_care: editWashCare,
          image_url: editImageUrl,
          description: editDescription
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Product updated successfully!');
        setEditingProduct(null);
        fetchData();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Cannot connect to server');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        alert('Product deleted');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePersonal = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    const nameParts = personalName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || 'Admin';

    const res = await onProfileUpdate({ newFirstName: firstName, newLastName: lastName, newPhone: personalPhone });
    if (res.success) {
      setFormMsg({ type: 'success', text: 'Personal details updated successfully!' });
    } else {
      setFormMsg({ type: 'danger', text: res.message || 'Failed to update details.' });
    }
  };

  const handleInitiateEmailChange = (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    if (!newEmailOnly || newEmailOnly === currentUser.email) {
      setFormMsg({ type: 'danger', text: 'Please enter a different new email address.' });
      return;
    }
    if (!currentPassForEmail) {
      setFormMsg({ type: 'danger', text: 'Current password is required to change email.' });
      return;
    }

    triggerOtpSecurity(async () => {
      const res = await onProfileUpdate({
        currentPassword: currentPassForEmail,
        newEmail: newEmailOnly
      });
      if (res.success) {
        setFormMsg({ type: 'success', text: 'Email updated successfully!' });
        setCurrentPassForEmail('');
        setNewEmailOnly('');
      } else {
        setFormMsg({ type: 'danger', text: res.message });
      }
    });
  };

  const handleInitiatePasswordChange = (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    if (!currentPassForPass) {
      setFormMsg({ type: 'danger', text: 'Current password is required.' });
      return;
    }
    if (newPasswordOnly !== confirmNewPassword) {
      setFormMsg({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }

    triggerOtpSecurity(async () => {
      const res = await onProfileUpdate({
        currentPassword: currentPassForPass,
        newPassword: newPasswordOnly
      });
      if (res.success) {
        setFormMsg({ type: 'success', text: 'Password changed successfully!' });
        setCurrentPassForPass('');
        setNewPasswordOnly('');
        setConfirmNewPassword('');
      } else {
        setFormMsg({ type: 'danger', text: res.message });
      }
    });
  };

  return (
    <div className="dark-admin-overlay d-flex align-items-center justify-content-center p-3" tabIndex="-1">
      
      {otpNotification && (
        <div className="device-otp-toast shadow-lg">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="toast-dot"></span>
            <small className="fw-bold text-uppercase text-warning" style={{ fontSize: '11px', letterSpacing: '1px' }}>
              Security Alert
            </small>
          </div>
          <p className="m-0 small fw-semibold text-white">{otpNotification}</p>
        </div>
      )}

      <div className="dark-admin-box shadow-2xl">
        <div className="dark-admin-header d-flex justify-content-between align-items-center px-4 py-3 border-bottom border-dark">
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-shield-lock-fill text-warning fs-5"></i>
            <h6 className="m-0 fw-bold text-white tracking-wide">ADMIN DASHBOARD</h6>
          </div>
          <button type="button" className="btn-close-dark" onClick={onClose}>✕</button>
        </div>

        <div className="row g-0" style={{ minHeight: '620px' }}>
          {/* Left Menu */}
          <div className="col-md-3 dark-sidebar p-3 border-end border-dark d-flex flex-column justify-content-between">
            <div>
              <div className="admin-badge-card mb-3 p-3 rounded-3">
                <small className="text-secondary text-uppercase d-block fw-bold" style={{ fontSize: '10px' }}>Administrator</small>
                <div className="fw-bold text-white text-truncate">{currentUser?.name || 'Admin'}</div>
                <small className="text-muted text-truncate d-block" style={{ fontSize: '11px' }}>{currentUser?.email}</small>
              </div>

              <div className="d-flex flex-column gap-1">
                <button 
                  type="button"
                  className={`dark-menu-btn ${activeTab === 'dashboard' ? 'active-dark-btn' : ''}`} 
                  onClick={() => { setActiveTab('dashboard'); setFormMsg({ type: '', text: '' }); }}
                >
                  <i className="bi bi-grid me-2 text-warning"></i> Overview
                </button>
                <button 
                  type="button"
                  className={`dark-menu-btn ${activeTab === 'add-product' ? 'active-dark-btn' : ''}`} 
                  onClick={() => { setActiveTab('add-product'); setFormMsg({ type: '', text: '' }); }}
                >
                  <i className="bi bi-plus-circle me-2 text-info"></i> Add Product
                </button>
                <button 
                  type="button"
                  className={`dark-menu-btn ${activeTab === 'manage-products' ? 'active-dark-btn' : ''}`} 
                  onClick={() => { setActiveTab('manage-products'); setFormMsg({ type: '', text: '' }); }}
                >
                  <i className="bi bi-box-seam me-2 text-success"></i> All Products ({products.length})
                </button>
                <button 
                  type="button"
                  className={`dark-menu-btn ${activeTab === 'view-users' ? 'active-dark-btn' : ''}`} 
                  onClick={() => { setActiveTab('view-users'); setFormMsg({ type: '', text: '' }); }}
                >
                  <i className="bi bi-people me-2 text-primary"></i> Customer List ({users.length})
                </button>
                <button 
                  type="button"
                  className={`dark-menu-btn ${activeTab === 'update-profile' ? 'active-dark-btn' : ''}`} 
                  onClick={() => { setActiveTab('update-profile'); setFormMsg({ type: '', text: '' }); }}
                >
                  <i className="bi bi-key me-2 text-danger"></i> Security & Settings
                </button>
              </div>
            </div>

            <button type="button" className="btn btn-outline-secondary btn-sm w-100 mt-3 rounded-pill fw-semibold" onClick={onClose}>
              Close Panel
            </button>
          </div>

          {/* Right Main Content */}
          <div className="col-md-9 p-4 dark-content-area" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            
            {/* 1. OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div>
                <h6 className="fw-bold text-white mb-3">Store Metrics</h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="metric-box p-3 rounded-3">
                      <span className="text-secondary small fw-bold">TOTAL PRODUCTS</span>
                      <h2 className="m-0 fw-bold text-warning mt-1">{products.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="metric-box p-3 rounded-3">
                      <span className="text-secondary small fw-bold">CUSTOMERS</span>
                      <h2 className="m-0 fw-bold text-info mt-1">{users.length}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="metric-box p-3 rounded-3">
                      <span className="text-secondary small fw-bold">STORE STATUS</span>
                      <h2 className="m-0 fw-bold text-success mt-1">ONLINE</h2>
                    </div>
                  </div>
                </div>

                <div className="p-3 metric-box rounded-3">
                  <span className="fw-bold small text-white d-block mb-2">Shortcuts</span>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-warning btn-sm rounded-pill px-4 fw-bold text-dark" onClick={() => setActiveTab('add-product')}>
                      + Add New Product
                    </button>
                    <button type="button" className="btn btn-outline-light btn-sm rounded-pill px-4" onClick={() => setActiveTab('manage-products')}>
                      View Inventory
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ADD PRODUCT (DYNAMIC JEWELLERY SUB-CATEGORY FIELD) */}
            {activeTab === 'add-product' && (
              <div>
                <h6 className="fw-bold text-white mb-3">Add Product</h6>
                <form onSubmit={handleAddProduct} className="metric-box p-4 rounded-3 border border-dark">
                  
                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Product Title <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="form-control dark-input" 
                      placeholder="e.g. Bridal Short Medium And Long Haram Combo Set" 
                      value={productName} 
                      onChange={(e) => setProductName(e.target.value)} 
                      required 
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-secondary">Selling Price (₹) <span className="text-danger">*</span></label>
                      <input 
                        type="number" 
                        className="form-control dark-input" 
                        placeholder="1499" 
                        value={productPrice} 
                        onChange={(e) => setProductPrice(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-secondary">Original MRP (₹) <small className="text-muted">(Optional)</small></label>
                      <input 
                        type="number" 
                        className="form-control dark-input" 
                        placeholder="3999" 
                        value={productMrp} 
                        onChange={(e) => setProductMrp(e.target.value)} 
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-secondary">Stock Pieces <small className="text-muted">(Optional)</small></label>
                      <input 
                        type="number" 
                        className="form-control dark-input" 
                        placeholder="10" 
                        value={productStock} 
                        onChange={(e) => setProductStock(e.target.value)} 
                      />
                    </div>
                  </div>

                  {/* Category & Dynamic Jewellery Subcategory */}
                  <div className="row g-2 mb-3">
                    <div className={productCategory === 'Jewellery' ? 'col-6' : 'col-12'}>
                      <label className="form-label small fw-semibold text-secondary">Main Category</label>
                      <select 
                        className="form-select dark-input" 
                        value={productCategory} 
                        onChange={(e) => setProductCategory(e.target.value)}
                      >
                        <option value="Saree">Saree</option>
                        <option value="Lehenga">Lehenga</option>
                        <option value="Kurti">Kurti</option>
                        <option value="Jewellery">Jewellery</option>
                        <option value="Tops">Tops</option>
                        <option value="Daily Wear">Daily Wear</option>
                      </select>
                    </div>

                    {/* Specific Jewellery Subtype Dropdown */}
                    {productCategory === 'Jewellery' && (
                      <div className="col-6">
                        <label className="form-label small fw-semibold text-warning">Jewellery Subcategory</label>
                        <select 
                          className="form-select dark-input border-warning"
                          value={jewellerySubCategory}
                          onChange={(e) => setJewellerySubCategory(e.target.value)}
                        >
                          {jewellerySubList.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-secondary">
                        {productCategory === 'Jewellery' ? 'Materials / Plating' : 'Fabric'} <small className="text-muted">(Optional)</small>
                      </label>
                      <input 
                        type="text" 
                        className="form-control dark-input" 
                        placeholder={productCategory === 'Jewellery' ? 'Gold Plating, Brass & Copper, Kemp' : 'Pure Georgette'} 
                        value={productFabric} 
                        onChange={(e) => setProductFabric(e.target.value)} 
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-secondary">
                        {productCategory === 'Jewellery' ? 'Weight / Length Details' : 'Work / Pattern'} <small className="text-muted">(Optional)</small>
                      </label>
                      <input 
                        type="text" 
                        className="form-control dark-input" 
                        placeholder={productCategory === 'Jewellery' ? '40 gms, Length: 35 cms' : 'Zari & Sequins'} 
                        value={productWork} 
                        onChange={(e) => setProductWork(e.target.value)} 
                      />
                    </div>
                    <div className="col-4">
                      <label className="form-label small fw-semibold text-secondary">
                        {productCategory === 'Jewellery' ? 'Colors / Stones' : 'Colors'} <small className="text-muted">(Optional)</small>
                      </label>
                      <input 
                        type="text" 
                        className="form-control dark-input" 
                        placeholder="Gold, Ruby, Emerald" 
                        value={productColors} 
                        onChange={(e) => setProductColors(e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary d-block">Product Image <span className="text-danger">*</span></label>
                    <div className="d-flex gap-2 mb-2">
                      <button 
                        type="button" 
                        className={`btn btn-sm rounded-pill px-3 ${imageUploadType === 'file' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`} 
                        onClick={() => { setImageUploadType('file'); setProductImageUrl(''); }}
                      >
                        Upload Local File
                      </button>
                      <button 
                        type="button" 
                        className={`btn btn-sm rounded-pill px-3 ${imageUploadType === 'url' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`} 
                        onClick={() => { setImageUploadType('url'); setProductImageUrl(''); }}
                      >
                        Web Link
                      </button>
                    </div>

                    {imageUploadType === 'file' ? (
                      <input type="file" className="form-control dark-input" accept="image/*" onChange={(e) => handleFileChange(e, false)} />
                    ) : (
                      <input type="url" className="form-control dark-input" placeholder="https://..." value={productImageUrl} onChange={(e) => setProductImageUrl(e.target.value)} />
                    )}
                  </div>

                  {productImageUrl && (
                    <div className="mb-3">
                      <small className="text-secondary d-block mb-1">Preview:</small>
                      <img src={productImageUrl} alt="" style={{ height: '80px', width: '80px', objectFit: 'cover' }} className="rounded-3 border border-dark" />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold text-secondary">Description <small className="text-muted">(Optional)</small></label>
                    <textarea 
                      className="form-control dark-input" 
                      rows="2" 
                      placeholder="Product details, set contents, fastening hook info..." 
                      value={productDescription} 
                      onChange={(e) => setProductDescription(e.target.value)} 
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-warning text-dark w-100 py-2 rounded-pill fw-bold">
                    Save Product
                  </button>
                </form>
              </div>
            )}

            {/* 3. ALL PRODUCTS (CLEAR CATEGORY & SUB-CATEGORY LABELS) */}
            {activeTab === 'manage-products' && (
              <div>
                <h6 className="fw-bold text-white mb-3">All Products ({products.length})</h6>
                <div className="table-responsive metric-box rounded-3 border border-dark">
                  <table className="table table-dark table-hover align-middle mb-0 text-sm">
                    <thead>
                      <tr className="text-secondary small">
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category / Type</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((p) => {
                          const isJewel = String(p.category || '').toLowerCase().includes('jewel');
                          return (
                            <tr key={p.id}>
                              <td>
                                <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} className="rounded-2 border border-secondary" />
                              </td>
                              <td className="fw-semibold text-white">{p.name}</td>
                              <td>
                                <span className={`badge ${isJewel ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                                  {p.category || 'Saree'}
                                </span>
                              </td>
                              <td className="fw-bold text-warning">₹{p.price}</td>
                              <td><span className={`badge ${(p.stock_quantity || 10) > 0 ? 'bg-success' : 'bg-danger'}`}>{p.stock_quantity || 10} pcs</span></td>
                              <td className="text-end">
                                <div className="d-inline-flex gap-1">
                                  <button type="button" className="btn btn-outline-warning btn-sm px-2 py-1" onClick={() => handleOpenEditModal(p)} title="Edit">
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button type="button" className="btn btn-outline-danger btn-sm px-2 py-1" onClick={() => handleDeleteProduct(p.id)} title="Delete">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-4 small">No products in the database.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 4. CUSTOMER LIST */}
            {activeTab === 'view-users' && (
              <div>
                <h6 className="fw-bold text-white mb-3">Customer List ({users.length})</h6>
                <div className="table-responsive metric-box rounded-3 border border-dark">
                  <table className="table table-dark table-hover align-middle mb-0 text-sm">
                    <thead>
                      <tr className="text-secondary small">
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((u) => (
                          <tr key={u.id}>
                            <td className="text-muted small">#{u.id}</td>
                            <td className="fw-semibold text-white">{u.first_name} {u.last_name}</td>
                            <td className="text-secondary small">{u.email}</td>
                            <td>
                              <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4 small">No registered customers found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. SECURITY & SETTINGS */}
            {activeTab === 'update-profile' && (
              <div>
                <h6 className="fw-bold text-white mb-1">Security & Settings</h6>
                <p className="text-secondary small mb-3">Update your credentials.</p>

                {formMsg.text && (
                  <div className={`alert alert-${formMsg.type} py-2 px-3 small mb-3`}>
                    {formMsg.text}
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-12">
                    <div className="metric-box p-3 rounded-3 border border-dark">
                      <h6 className="fw-bold text-white small mb-2"><i className="bi bi-person me-1 text-warning"></i> 1. Personal Information</h6>
                      <form onSubmit={handleUpdatePersonal} className="row g-2 align-items-end">
                        <div className="col-md-5">
                          <label className="form-label small text-secondary">Full Name</label>
                          <input type="text" className="form-control dark-input" value={personalName} onChange={(e) => setPersonalName(e.target.value)} required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small text-secondary">Phone Number</label>
                          <input type="tel" className="form-control dark-input" placeholder="+91 9876543210" value={personalPhone} onChange={(e) => setPersonalPhone(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                          <button type="submit" className="btn btn-warning text-dark fw-bold w-100 py-1">Save Details</button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="metric-box p-3 rounded-3 border border-dark h-100 d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold text-white small mb-2"><i className="bi bi-envelope me-1 text-info"></i> 2. Change Email Address</h6>
                        <small className="text-secondary d-block mb-2" style={{ fontSize: '11px' }}>Current email: <strong className="text-white">{currentUser?.email}</strong></small>
                        <form onSubmit={handleInitiateEmailChange}>
                          <div className="mb-2">
                            <label className="form-label small text-secondary">New Email Address</label>
                            <input type="email" className="form-control dark-input" placeholder="new.email@domain.com" value={newEmailOnly} onChange={(e) => setNewEmailOnly(e.target.value)} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label small text-secondary">Current Password</label>
                            <input type="password" className="form-control dark-input" placeholder="••••••••" value={currentPassForEmail} onChange={(e) => setCurrentPassForEmail(e.target.value)} required />
                          </div>
                          <button type="submit" className="btn btn-info text-dark fw-bold w-100 py-2 rounded-2">
                            Verify & Update Email
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="metric-box p-3 rounded-3 border border-dark h-100 d-flex flex-column justify-content-between">
                      <div>
                        <h6 className="fw-bold text-white small mb-2"><i className="bi bi-key me-1 text-danger"></i> 3. Change Password</h6>
                        <form onSubmit={handleInitiatePasswordChange}>
                          <div className="mb-2">
                            <label className="form-label small text-secondary">Current Password</label>
                            <input type="password" className="form-control dark-input" placeholder="••••••••" value={currentPassForPass} onChange={(e) => setCurrentPassForPass(e.target.value)} required />
                          </div>
                          <div className="mb-2">
                            <label className="form-label small text-secondary">New Password</label>
                            <input type="password" className="form-control dark-input" placeholder="••••••••" value={newPasswordOnly} onChange={(e) => setNewPasswordOnly(e.target.value)} required />
                          </div>
                          <div className="mb-3">
                            <label className="form-label small text-secondary">Confirm New Password</label>
                            <input type="password" className="form-control dark-input" placeholder="••••••••" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                          </div>
                          <button type="submit" className="btn btn-danger text-white fw-bold w-100 py-2 rounded-2">
                            Verify & Update Password
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* 2FA OTP POPUP */}
      {showOtpScreen && (
        <div className="dark-otp-overlay d-flex align-items-center justify-content-center p-3">
          <div className="dark-admin-box p-4 rounded-4 shadow-lg border border-warning text-center" style={{ maxWidth: '380px', width: '100%' }}>
            <div className="mb-3">
              <i className="bi bi-shield-check text-warning fs-1"></i>
            </div>
            <h5 className="fw-bold text-white mb-1">Confirm Device Code</h5>
            <p className="text-secondary small mb-3">
              Enter the 6-digit security code sent to your notification to verify this change.
            </p>
            <form onSubmit={handleVerifyOtp}>
              <input 
                type="text" 
                maxLength="6"
                className="form-control form-control-lg text-center fw-bold fs-3 letter-spacing-3 mb-3 dark-input text-warning" 
                placeholder="••••••" 
                value={userEnteredOtp} 
                onChange={(e) => setUserEnteredOtp(e.target.value)} 
                required 
                autoFocus
              />
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary w-50 py-2 rounded-pill" onClick={() => setShowOtpScreen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning text-dark w-50 py-2 rounded-pill fw-bold">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="dark-otp-overlay d-flex align-items-center justify-content-center p-3">
          <div className="dark-admin-box rounded-3 shadow-lg border border-secondary p-4" style={{ width: '100%', maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="m-0 fw-bold text-white">Edit Product Details</h6>
              <button type="button" className="btn-close-dark" onClick={() => setEditingProduct(null)}>✕</button>
            </div>
            
            <form onSubmit={handleUpdateProduct}>
              <div className="mb-2">
                <label className="form-label small text-secondary">Product Title <span className="text-danger">*</span></label>
                <input type="text" className="form-control dark-input" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label small text-secondary">Price (₹) <span className="text-danger">*</span></label>
                  <input type="number" className="form-control dark-input" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
                </div>
                <div className="col-4">
                  <label className="form-label small text-secondary">Original MRP (₹)</label>
                  <input type="number" className="form-control dark-input" value={editMrp} onChange={(e) => setEditMrp(e.target.value)} />
                </div>
                <div className="col-4">
                  <label className="form-label small text-secondary">Stock Pieces</label>
                  <input type="number" className="form-control dark-input" value={editStock} onChange={(e) => setEditStock(e.target.value)} />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className={editCategory === 'Jewellery' ? 'col-6' : 'col-12'}>
                  <label className="form-label small text-secondary">Main Category</label>
                  <select className="form-select dark-input" value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                    <option value="Saree">Saree</option>
                    <option value="Lehenga">Lehenga</option>
                    <option value="Kurti">Kurti</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Tops">Tops</option>
                    <option value="Daily Wear">Daily Wear</option>
                  </select>
                </div>

                {editCategory === 'Jewellery' && (
                  <div className="col-6">
                    <label className="form-label small text-warning">Jewellery Subcategory</label>
                    <select 
                      className="form-select dark-input border-warning"
                      value={editJewellerySubCategory}
                      onChange={(e) => setEditJewellerySubCategory(e.target.value)}
                    >
                      {jewellerySubList.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="row g-2 mb-2">
                <div className="col-4">
                  <label className="form-label small text-secondary">
                    {editCategory === 'Jewellery' ? 'Materials / Plating' : 'Fabric'}
                  </label>
                  <input type="text" className="form-control dark-input" value={editFabric} onChange={(e) => setEditFabric(e.target.value)} />
                </div>
                <div className="col-4">
                  <label className="form-label small text-secondary">
                    {editCategory === 'Jewellery' ? 'Weight / Length Details' : 'Work'}
                  </label>
                  <input type="text" className="form-control dark-input" value={editWork} onChange={(e) => setEditWork(e.target.value)} />
                </div>
                <div className="col-4">
                  <label className="form-label small text-secondary">Colors / Stones</label>
                  <input type="text" className="form-control dark-input" value={editColors} onChange={(e) => setEditColors(e.target.value)} />
                </div>
              </div>

              <div className="mb-2">
                <label className="form-label small text-secondary d-block">Image <span className="text-danger">*</span></label>
                <div className="d-flex gap-2 mb-2">
                  <button type="button" className={`btn btn-sm ${editImageUploadType === 'url' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`} onClick={() => setEditImageUploadType('url')}>
                    Web Link
                  </button>
                  <button type="button" className={`btn btn-sm ${editImageUploadType === 'file' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary'}`} onClick={() => setEditImageUploadType('file')}>
                    Upload File
                  </button>
                </div>

                {editImageUploadType === 'file' ? (
                  <input type="file" className="form-control dark-input" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
                ) : (
                  <input type="url" className="form-control dark-input" value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} required />
                )}
              </div>

              {editImageUrl && (
                <div className="mb-2">
                  <img src={editImageUrl} alt="" style={{ height: '60px', width: '60px', objectFit: 'cover' }} className="rounded-2 border border-secondary" />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small text-secondary">Description</label>
                <textarea className="form-control dark-input" rows="2" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
              </div>

              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary btn-sm w-50 rounded-pill" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-warning text-dark btn-sm w-50 rounded-pill fw-bold">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dark-admin-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 15, 29, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1050;
        }

        .dark-admin-box {
          background: #0f172a;
          width: 100%;
          max-width: 980px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #1e293b;
        }

        .dark-admin-header {
          background: #1e293b;
        }

        .btn-close-dark {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 16px;
          cursor: pointer;
        }
        .btn-close-dark:hover {
          color: #ffffff;
        }

        .dark-sidebar {
          background: #111827;
        }

        .admin-badge-card {
          background: #1f2937;
          border: 1px solid #374151;
        }

        .dark-menu-btn {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .dark-menu-btn:hover {
          background: #1f2937;
          color: #ffffff;
        }
        .active-dark-btn {
          background: #f59e0b !important;
          color: #0f172a !important;
          font-weight: 700;
        }

        .dark-content-area {
          background: #0f172a;
        }

        .metric-box {
          background: #1e293b;
          border: 1px solid #334155;
        }

        .dark-input {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
          color: #f8fafc !important;
        }
        .dark-input:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
        }

        .dark-otp-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(10, 15, 29, 0.85);
          backdrop-filter: blur(6px);
          z-index: 1080;
        }

        .device-otp-toast {
          position: fixed;
          top: 24px;
          right: 24px;
          background: #1e293b;
          border-left: 5px solid #f59e0b;
          border-radius: 12px;
          padding: 14px 20px;
          z-index: 2100;
          max-width: 360px;
          animation: slideDownToast 0.3s ease forwards;
        }

        .toast-dot {
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
          display: inline-block;
        }

        @keyframes slideDownToast {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .letter-spacing-3 {
          letter-spacing: 6px;
        }
      `}</style>
    </div>
  );
}