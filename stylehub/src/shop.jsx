import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BuyNowModal from './BuyNowModal';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';
import Wishlist from './Wishlist';
import ProductDetail from './ProductDetail';
import TrackOrderPage from './TrackOrderPage';
import DeliveryRiderPortal from './DeliveryRiderPortal';
import AiAssistant from './AiAssistant';

const Shop = ({ onBack, currentUser, setCurrentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Page View Routing State ('catalog' | 'track' | 'rider')
  const [activeView, setActiveView] = useState('catalog');

  // Express Buy Now Modal State
  const [buyNowItem, setBuyNowItem] = useState(null);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);

  // Products State
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  // Cart & Wishlist
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  // Dashboard & Auth Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showCustomerDashboard, setShowCustomerDashboard] = useState(false);

  // Auth Inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  const categoriesList = ['ALL', 'SAREE', 'LEHENGA', 'KURTI', 'JEWELLERY', 'TOPS', 'DAILY WEAR'];

  // Persistent Login session
  useEffect(() => {
    const savedUser = localStorage.getItem('stylehub_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setShowAuthModal(false);
      } catch (e) {
        localStorage.removeItem('stylehub_user');
        setShowAuthModal(true);
      }
    } else {
      setShowAuthModal(true);
    }
  }, []);

  // Fetch Products
  const fetchProducts = () => {
    setLoading(true);
    setDbError(false);
    fetch('http://localhost:5000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Network response failed');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setDbProducts(data);
        } else {
          setDbProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching database products:', err);
        setDbError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtering Products
  const filteredProducts = dbProducts.filter((product) => {
    if (!product) return false;

    const pCat = String(product.category || '').toLowerCase().trim();
    const pName = String(product.name || '').toLowerCase().trim();
    const sCat = String(selectedCategory || '').toLowerCase().trim();

    let matchesCategory = false;
    if (sCat === 'all' || sCat === '') {
      matchesCategory = true;
    } else if (pCat === sCat) {
      matchesCategory = true;
    } else if (sCat.includes('saree') && pCat.includes('saree')) {
      matchesCategory = true;
    } else if ((sCat.includes('lehenga') || sCat.includes('lehanga')) && (pCat.includes('lehenga') || pCat.includes('lehanga'))) {
      matchesCategory = true;
    } else if (sCat.includes('kurti') && pCat.includes('kurti')) {
      matchesCategory = true;
    } else if (sCat.includes('jewel') && pCat.includes('jewel')) {
      matchesCategory = true;
    } else if (sCat.includes('top') && pCat.includes('top')) {
      matchesCategory = true;
    } else if (sCat.includes('daily') && pCat.includes('daily')) {
      matchesCategory = true;
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      pName.includes(query) ||
      String(product.description || '').toLowerCase().includes(query) ||
      pCat.includes(query);

    return matchesCategory && matchesSearch;
  });

  // Direct Sign-In / Register
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const endpoint = isRegisterMode 
      ? 'http://localhost:5000/api/register' 
      : 'http://localhost:5000/api/login';

    const payload = isRegisterMode 
      ? { firstName, lastName, email, password, confirmPassword }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = { 
          name: data.name,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone || '',
          email: data.email, 
          role: data.role || 'customer'
        };

        localStorage.setItem('stylehub_user', JSON.stringify(userData));
        setCurrentUser(userData);
        setShowAuthModal(false);

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setFormError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setFormError('Cannot connect to backend server');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('stylehub_user');
    setCurrentUser(null);
    setShowAuthModal(true);
    setShowAdminDashboard(false);
    setShowCustomerDashboard(false);
  };

  const handleProfileUpdate = async (updateFields) => {
    try {
      const response = await fetch('http://localhost:5000/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: currentUser.email,
          ...updateFields
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = { 
          ...currentUser, 
          name: data.name || currentUser.name,
          firstName: data.firstName || currentUser.firstName,
          lastName: data.lastName || currentUser.lastName,
          phone: data.phone || currentUser.phone,
          email: data.email || currentUser.email
        };

        localStorage.setItem('stylehub_user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Server connection error' };
    }
  };

  // --- CART & BUY NOW HANDLERS ---
  const addToBag = (product, isBuyNow = false) => {
    if (isBuyNow) {
      setBuyNowItem(product);
      setShowBuyNowModal(true);
    } else {
      const orderQty = product.orderQuantity || 1;
      const existingIndex = cart.findIndex(
        (item) => item.id === product.id && item.selectedSize === product.selectedSize
      );

      if (existingIndex > -1) {
        const updatedCart = [...cart];
        updatedCart[existingIndex].orderQuantity = (updatedCart[existingIndex].orderQuantity || 1) + orderQty;
        setCart(updatedCart);
      } else {
        setCart([...cart, { ...product, orderQuantity: orderQty, cartItemId: Date.now() + Math.random() }]);
      }
      alert(`✓ "${product.name}" added to bag!`);
    }
  };

  const removeFromCart = (cartItemId) => {
    setCart(cart.filter((item) => item.cartItemId !== cartItemId));
  };

  const increaseCartQty = (cartItemId) => {
    setCart(
      cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const maxStock = item.stock_quantity || 10;
          const newQty = (item.orderQuantity || 1) + 1;
          return newQty <= maxStock ? { ...item, orderQuantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const decreaseCartQty = (cartItemId) => {
    setCart(
      cart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newQty = (item.orderQuantity || 1) - 1;
          return newQty >= 1 ? { ...item, orderQuantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    if (window.confirm('Clear all items from your bag?')) {
      setCart([]);
    }
  };

  // Wishlist Actions
  const toggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist(wishlist.filter((item) => item.id !== productId));
  };

  const moveFromWishlistToCart = (product) => {
    addToBag(product, false);
    removeFromWishlist(product.id);
  };

  const cartSubtotal = cart.reduce(
    (acc, curr) => acc + parseFloat(curr.price || 0) * (curr.orderQuantity || 1),
    0
  );
  const totalCartCount = cart.reduce((acc, curr) => acc + (curr.orderQuantity || 1), 0);

  const handleOpenDashboard = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (currentUser.role === 'admin') {
      setShowAdminDashboard(true);
    } else {
      setShowCustomerDashboard(true);
    }
  };

  return (
    <div className="mirraw-storefront min-vh-100 bg-white d-flex flex-column justify-content-between">

      {/* 1. TOP HEADER */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedProduct(null);
          setShowCart(false);
          setShowWishlist(false);
          setActiveView('catalog');
        }}
        categoriesList={categoriesList}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onOpenProfile={handleOpenDashboard}
        onOpenWishlist={() => {
          if (currentUser) {
            setShowWishlist(true);
            setShowCart(false);
            setSelectedProduct(null);
            setActiveView('catalog');
          }
        }}
        onOpenCart={() => {
          if (currentUser) {
            setShowCart(true);
            setShowWishlist(false);
            setSelectedProduct(null);
            setActiveView('catalog');
          }
        }}
        onSignOut={handleSignOut}
        onLogoClick={() => {
          setSelectedProduct(null);
          setShowWishlist(false);
          setShowCart(false);
          setSelectedCategory('ALL');
          setActiveView('catalog');
        }}
      />

      {/* 2. MAIN BODY CONTENT */}
      <main className={`container-fluid px-lg-5 py-4 flex-grow-1 ${!currentUser ? 'shop-locked-blur' : ''}`}>

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item cursor-pointer" onClick={() => { setSelectedProduct(null); setShowWishlist(false); setShowCart(false); setActiveView('catalog'); onBack(); }}>Home</li>
            <li className="breadcrumb-item">Women</li>
            {showWishlist ? (
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">My Wishlist</li>
            ) : showCart ? (
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">Shopping Bag</li>
            ) : activeView === 'track' ? (
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">Track Order</li>
            ) : activeView === 'rider' ? (
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">Rider Portal</li>
            ) : selectedProduct ? (
              <>
                <li className="breadcrumb-item cursor-pointer" onClick={() => setSelectedProduct(null)}>{selectedCategory}</li>
                <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">{selectedProduct.name}</li>
              </>
            ) : (
              <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">{selectedCategory} Collection</li>
            )}
          </ol>
        </nav>

        {/* View 1: Customer Order Tracking Full Page */}
        {activeView === 'track' && (
          <TrackOrderPage onBack={() => setActiveView('catalog')} />
        )}

        {/* View 2: Dedicated Delivery Rider Portal */}
        {activeView === 'rider' && (
          <DeliveryRiderPortal onBack={() => setActiveView('catalog')} />
        )}

        {/* View 3: Regular Catalog, Details & Cart Views */}
        {activeView === 'catalog' && (
          <>
            {showWishlist ? (
              <Wishlist 
                wishlist={wishlist}
                onClose={() => setShowWishlist(false)}
                onSelectProduct={(item) => { setSelectedProduct(item); setShowWishlist(false); }}
                onRemoveFromWishlist={removeFromWishlist}
                onMoveToCart={moveFromWishlistToCart}
              />
            ) : showCart ? (
              /* SHOPPING BAG */
              <div className="container py-3">
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold m-0 text-maroon">SHOPPING BAG ({totalCartCount} ITEMS)</h4>
                    <small className="text-muted">Review your items before checkout</small>
                  </div>
                  <div className="d-flex gap-2">
                    {cart.length > 0 && (
                      <button 
                        type="button" 
                        className="btn btn-outline-danger btn-sm rounded-0 fw-semibold"
                        onClick={clearCart}
                      >
                        Clear Bag
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="btn btn-outline-dark btn-sm rounded-0 fw-semibold" 
                      onClick={() => setShowCart(false)}
                    >
                      ← Continue Shopping
                    </button>
                  </div>
                </div>

                {cart.length > 0 ? (
                  <div className="row g-4">
                    <div className="col-lg-8">
                      {cart.map((item) => {
                        const itemQty = item.orderQuantity || 1;
                        const itemPrice = parseFloat(item.price || 0);
                        const itemTotal = (itemPrice * itemQty).toFixed(2);

                        return (
                          <div key={item.cartItemId || item.id} className="d-flex position-relative border p-3 mb-3 gap-3 bg-white shadow-2xs rounded-1">
                            <button
                              type="button"
                              className="btn-cart-item-delete"
                              onClick={() => removeFromCart(item.cartItemId)}
                              title="Remove item"
                            >
                              ✕
                            </button>

                            <img 
                              src={item.image_url} 
                              style={{ width: '100px', height: '130px', objectFit: 'cover' }} 
                              alt={item.name} 
                              className="rounded-1 border"
                            />

                            <div className="flex-grow-1 d-flex flex-column justify-content-between pe-4">
                              <div>
                                <span className="badge category-badge mb-1">{item.category || 'Ethnic'}</span>
                                <h6 className="fw-bold text-dark m-0">{item.name}</h6>

                                {item.selectedSize && (
                                  <small className="text-muted d-block mt-1">
                                    <strong>Size:</strong> {item.selectedSize}
                                  </small>
                                )}

                                {item.deliveryAddress && (
                                  <small className="text-muted d-block text-truncate" style={{ maxWidth: '350px' }}>
                                    <strong>Ship to:</strong> {item.deliveryAddress}
                                  </small>
                                )}
                              </div>

                              <div className="d-flex justify-content-between align-items-end mt-3 pt-2 border-top">
                                <div className="d-flex align-items-center gap-2">
                                  <small className="text-muted fw-bold">Qty:</small>
                                  <div className="d-flex align-items-center border rounded-1 bg-light">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0 fw-bold"
                                      onClick={() => decreaseCartQty(item.cartItemId)}
                                      disabled={itemQty <= 1}
                                    >
                                      −
                                    </button>
                                    <span className="px-2 fw-bold small text-dark">{itemQty}</span>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-link text-dark text-decoration-none px-2 py-0 fw-bold"
                                      onClick={() => increaseCartQty(item.cartItemId)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <div className="text-end">
                                  <span className="text-muted small d-block">₹{itemPrice.toFixed(2)} each</span>
                                  <h5 className="fw-bold text-maroon m-0">₹{itemTotal}</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="col-lg-4">
                      <div className="p-4 border bg-light shadow-2xs rounded-1">
                        <h6 className="fw-bold mb-3 border-bottom pb-2 text-dark">PRICE DETAILS</h6>

                        <div className="d-flex justify-content-between mb-2 small text-muted">
                          <span>Total Items</span>
                          <span>{totalCartCount}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-2 small text-muted">
                          <span>Bag Subtotal</span>
                          <span>₹{cartSubtotal.toFixed(2)}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-2 small text-muted">
                          <span>Delivery Charges</span>
                          <span className="text-success fw-bold">FREE</span>
                        </div>

                        <hr />

                        <div className="d-flex justify-content-between mb-4 fw-bold fs-5 text-dark">
                          <span>Total Payable</span>
                          <span className="text-maroon">₹{cartSubtotal.toFixed(2)}</span>
                        </div>

                        <button 
                          type="button" 
                          className="btn btn-maroon w-100 py-3 fw-bold text-uppercase rounded-0 shadow-sm" 
                          onClick={() => { 
                            alert('✓ Order Placed Successfully! Tracking details generated in Customer Dashboard.'); 
                            setCart([]); 
                            setShowCart(false); 
                          }}
                        >
                          PLACE ORDER
                        </button>

                        <div className="text-center mt-3">
                          <small className="text-muted" style={{ fontSize: '11px' }}>
                            <i className="bi bi-shield-lock-fill text-success me-1"></i> Safe and Secure Payments
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 my-4">
                    <i className="bi bi-bag-x fs-1 text-muted"></i>
                    <h5 className="fw-bold mt-3 text-dark">Your Shopping Bag is Empty</h5>
                    <p className="text-muted small">Explore our collections and add products to your bag.</p>
                    <button 
                      type="button" 
                      className="btn btn-maroon px-4 py-2 rounded-0 mt-2 fw-bold small text-uppercase" 
                      onClick={() => setShowCart(false)}
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            ) : selectedProduct ? (
              /* PRODUCT DETAIL */
              <ProductDetail 
                product={selectedProduct}
                allProducts={dbProducts}
                onBack={() => setSelectedProduct(null)}
                onAddToCart={addToBag}
                onToggleWishlist={toggleWishlist}
                isInWishlist={wishlist.some(i => i.id === selectedProduct.id)}
              />
            ) : (
              /* CATALOG GRID */
              <div>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold m-0 text-maroon text-uppercase">
                      {selectedCategory === 'ALL' ? 'ALL COLLECTIONS' : `${selectedCategory} COLLECTION`}
                    </h4>
                    <small className="text-muted">Showing {filteredProducts.length} premium products</small>
                  </div>
                  <button 
                    className="btn btn-outline-dark btn-sm rounded-0 fw-semibold" 
                    onClick={fetchProducts}
                    title="Reload products from database"
                  >
                    ↻ Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-danger" role="status"></div>
                    <p className="text-muted small mt-2">Loading products from database...</p>
                  </div>
                ) : dbError ? (
                  <div className="text-center py-5 my-4 p-4 border rounded-3 bg-light">
                    <i className="bi bi-exclamation-triangle text-danger fs-1"></i>
                    <h5 className="fw-bold mt-2 text-danger">Cannot Connect to Backend Server</h5>
                    <p className="text-muted small mb-3">Please verify that your terminal is running <code>node server.js</code> on port 5000.</p>
                    <button className="btn btn-maroon px-4 py-2 rounded-0" onClick={fetchProducts}>Try Again</button>
                  </div>
                ) : filteredProducts.length > 0 ? (
                  <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="col">
                        <div className="card h-100 border shadow-2xs rounded-0 position-relative product-hover-card">
                          <button 
                            type="button"
                            className={`btn-card-wishlist position-absolute top-0 end-0 m-2 ${wishlist.some(i => i.id === product.id) ? 'text-danger' : 'text-muted'}`}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                            title="Add to Wishlist"
                          >
                            <i className={`bi ${wishlist.some(i => i.id === product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                          </button>

                          <div 
                            style={{ height: '320px', cursor: 'pointer' }}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <img 
                              src={product.image_url} 
                              className="w-100 h-100 object-fit-cover" 
                              alt={product.name} 
                            />
                          </div>

                          <div className="card-body p-3 bg-white text-center">
                            <span className="badge category-badge mb-1">{product.category || 'Women'}</span>
                            <h6 
                              className="fw-bold text-dark text-truncate small mb-1 cursor-pointer"
                              onClick={() => setSelectedProduct(product)}
                              title={product.name}
                            >
                              {product.name}
                            </h6>
                            <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                              <span className="fw-bold text-maroon">₹{product.price}</span>
                              <small className="text-muted text-decoration-line-through">
                                ₹{product.original_mrp || (parseFloat(product.price || 0) * 1.25).toFixed(0)}
                              </small>
                            </div>

                            <button 
                              type="button"
                              className="btn btn-maroon w-100 py-2 fw-bold small text-uppercase rounded-0"
                              onClick={() => setSelectedProduct(product)}
                            >
                              VIEW DETAILS
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 my-5">
                    <i className="bi bi-bag-x fs-1 text-muted"></i>
                    <h5 className="fw-bold mt-3 text-dark">No Products Found</h5>
                    <p className="text-muted small">
                      {dbProducts.length === 0
                        ? 'Your database is currently empty. Open Admin Dashboard to add new items.'
                        : `No products under "${selectedCategory}".`}
                    </p>
                    {dbProducts.length > 0 && selectedCategory !== 'ALL' && (
                      <button 
                        type="button" 
                        className="btn btn-maroon px-4 py-2 rounded-0 mt-2 fw-bold small" 
                        onClick={() => { setSelectedCategory('ALL'); fetchProducts(); }}
                      >
                        View All Products ({dbProducts.length})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>

      {/* 3. SITE FOOTER */}
      <Footer 
        onOpenTracking={() => {
          setSelectedProduct(null);
          setShowCart(false);
          setShowWishlist(false);
          setActiveView('track');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenRider={() => {
          setSelectedProduct(null);
          setShowCart(false);
          setShowWishlist(false);
          setActiveView('rider');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 4. 1-CLICK BUY NOW EXPRESS CHECKOUT MODAL */}
      <BuyNowModal 
        show={showBuyNowModal}
        onClose={() => setShowBuyNowModal(false)}
        item={buyNowItem}
        currentUser={currentUser}
        onOrderSuccess={() => {
          setSelectedProduct(null);
        }}
      />

      {/* 5. ADMIN DASHBOARD */}
      <AdminDashboard 
        show={showAdminDashboard} 
        onClose={() => { setShowAdminDashboard(false); fetchProducts(); }} 
        currentUser={currentUser} 
        onProfileUpdate={handleProfileUpdate}
      />

      {/* 6. CUSTOMER DASHBOARD */}
      <CustomerDashboard
        show={showCustomerDashboard}
        onClose={() => setShowCustomerDashboard(false)}
        currentUser={currentUser}
        onProfileUpdate={handleProfileUpdate}
        wishlist={wishlist}
        onMoveWishlistToCart={moveFromWishlistToCart}
        onOpenSection={() => {}}
      />

      {/* 7. RESTRICTED ACCESS MODAL */}
      {!currentUser && !showAuthModal && (
        <div className="mirraw-auth-overlay d-flex align-items-center justify-content-center p-3">
          <div className="bg-white p-5 text-center shadow-lg border" style={{ maxWidth: '440px' }}>
            <h4 className="fw-bold text-maroon mb-2">Member Sign In</h4>
            <p className="text-muted small mb-4">Please sign in to view catalogs, save to wishlist, and place orders.</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-secondary w-50 rounded-0" onClick={onBack}>Home</button>
              <button type="button" className="btn btn-maroon w-50 rounded-0 fw-bold" onClick={() => setShowAuthModal(true)}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* AUTHENTICATION POPUP */}
      {showAuthModal && (
        <div className="mirraw-auth-overlay d-flex align-items-center justify-content-center p-3" tabIndex="-1">
          <div className="mirraw-auth-modal shadow-lg border">
            <div className="p-4 text-center border-bottom bg-light">
              <h5 className="fw-bold text-maroon m-0">{isRegisterMode ? 'Create Account' : 'Welcome to StyleHub'}</h5>
              <small className="text-muted">{isRegisterMode ? 'Register to browse exclusive ethnic drops' : 'Sign in to access your store'}</small>
            </div>

            <div className="p-4 bg-white">
              {formError && <div className="alert alert-danger py-2 px-3 small mb-3">{formError}</div>}

              <form onSubmit={handleAuthSubmit}>
                {isRegisterMode && (
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <input type="text" className="form-control rounded-0" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                    <div className="col-6">
                      <input type="text" className="form-control rounded-0" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <input type="email" className="form-control rounded-0" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="mb-3 position-relative">
                  <input type={showPassword ? 'text' : 'password'} className="form-control rounded-0" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <span className="password-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'}></i>
                  </span>
                </div>

                {isRegisterMode && (
                  <div className="mb-3">
                    <input type="password" className="form-control rounded-0" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                  </div>
                )}

                <button type="submit" className="btn btn-maroon w-100 py-2 rounded-0 fw-bold mt-2">
                  {isRegisterMode ? 'REGISTER ACCOUNT' : 'SIGN IN'}
                </button>
              </form>

              <div className="text-center mt-3 pt-2 border-top">
                <small className="text-muted">
                  {isRegisterMode ? 'Already registered? ' : "Don't have an account? "}
                  <span className="text-maroon fw-bold cursor-pointer" onClick={() => { setIsRegisterMode(!isRegisterMode); setFormError(''); }}>
                    {isRegisterMode ? 'Sign In' : 'Create Account'}
                  </span>
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. AI STYLIST CHATBOT WIDGET */}
      <AiAssistant currentUser={currentUser} />

      <style>{`
        .mirraw-storefront {
          color: #2b2b2b;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .text-maroon { color: #660018 !important; }
        .bg-maroon { background-color: #660018 !important; color: #ffffff !important; }

        .btn-maroon {
          background-color: #660018;
          color: #ffffff;
          border: 1px solid #660018;
          border-radius: 2px;
          font-size: 13px;
          letter-spacing: 1px;
        }
        .btn-maroon:hover {
          background-color: #4d0012;
          color: #ffffff;
        }

        .btn-cart-item-delete {
          position: absolute;
          top: 10px;
          right: 12px;
          background: transparent;
          border: none;
          color: #9ca3af;
          font-size: 16px;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .btn-cart-item-delete:hover {
          color: #dc2626;
        }

        .btn-card-wishlist {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5e7eb;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }

        .category-badge {
          background: #fdf2e7;
          color: #660018;
          border: 1px solid #f0e6dc;
        }

        .product-hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .product-hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
        }

        .mirraw-auth-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1060;
        }

        .mirraw-auth-modal {
          background: #ffffff;
          width: 100%;
          max-width: 420px;
        }

        .password-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          cursor: pointer;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .shop-locked-blur {
          filter: blur(6px);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default Shop;