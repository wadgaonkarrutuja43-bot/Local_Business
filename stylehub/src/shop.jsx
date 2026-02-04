import React, { useState } from 'react';

const Shop = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // --- EXISTING STATES ---
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // --- NEW STATES FOR WISHLIST ---
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  const menuCategories = {
    Men: [
      { title: 'Topwear', items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts'] },
      { title: 'Bottomwear', items: ['Jeans', 'Casual Trousers', 'Shorts', 'Track Pants'] },
    ],
    Women: [
      { title: 'Ethnic Wear', items: ['Sarees', 'Kurtas & Suits', 'Lehenga Cholis', 'Leggings'] },
      { title: 'Western Wear', items: ['Dresses', 'Tops', 'Tshirts', 'Skirts'] },
    ],
    Kids: [
      { title: 'Boys Clothing', items: ['T-Shirts', 'Shirts', 'Shorts', 'Jeans'] },
      { title: 'Girls Clothing', items: ['Dresses', 'Tops', 'Lehenga Choli', 'Party Wear'] },
    ]
  };

  const allItems = [
    { id: 1, title: 'SAREES', category: 'All', discount: '50-80% OFF', price: 2999, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=500' },
    { id: 2, title: 'CASUAL WEAR', category: 'All', discount: '40-80% OFF', price: 1299, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500' },
    { id: 3, title: 'MENS WEAR', category: 'All', discount: '30-70% OFF', price: 1599, image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=500' },
    { id: 4, title: 'WESTERN WEAR', category: 'All', discount: '40-80% OFF', price: 1999, image: 'https://i.pinimg.com/originals/79/c7/50/79c7508e21b8b7ded737a31553d97298.jpg' },
    { id: 5, title: 'LOUNGEWEAR', category: 'All', discount: '50-70% OFF', price: 999, image: 'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1722970066-Low_Res-EBJ2280-PJ1905M_AGAVE-F_2c7c2c59-abe1-4979-93e8-98c10f9de571.jpg?crop=0.978xw:0.814xh;0.00962xw,0.169xh&resize=980:*' },
    { id: 6, title: 'SPORTS WEAR', category: 'All', discount: '30-80% OFF', price: 1499, image: 'https://betterme.world/articles/wp-content/uploads/2023/01/shutterstock_1811825188-scaled.jpg' },
    { id: 7, title: 'KIDS WEAR', category: 'All', discount: '20-50% OFF', price: 799, image: 'https://i.pinimg.com/originals/ce/68/67/ce6867b6fd5af452f00cbbd2502f4762.png' },
    { id: 8, title: 'MENS ETHNIC WEAR', category: 'All', discount: '40-60% OFF', price: 2499, image: 'https://i.pinimg.com/originals/56/c7/5f/56c75f47e5ad53bd37b9522b0957d325.jpg' },
    { id: 9, title: 'OFFICE WEAR', category: 'All', discount: '10-40% OFF', price: 1899, image: 'https://ds393qgzrxwzn.cloudfront.net/cat1/img/images/0/6Csth9CQI7.jpg' },
    { id: 10, title: 'INCLUSIVE STYLES', category: 'All', discount: '30-60% OFF', price: 1299, image: 'https://img.freepik.com/premium-photo/inclusive-fashion-diverse-models-showcasing-fashion-styles_1280275-26415.jpg' },
    { id: 101, category: 'Sarees', title: 'Traditional Silk Saree', discount: '60% OFF', price: 4500, image: 'https://i.pinimg.com/736x/ed/25/31/ed25319b73006d44fe2b71ee1da033be.jpg' },
    { id: 102, category: 'Sarees', title: 'Embellished Party Saree', discount: '50% OFF', price: 5999, image: 'https://i.pinimg.com/1200x/bb/fa/9d/bbfa9dcd0a3b76994031dd72bc105751.jpg' },
    { id: 103, category: 'Sarees', title: 'Designer Floral Saree', discount: '40% OFF', price: 3200, image: 'https://i.pinimg.com/1200x/c6/50/65/c6506552f573ba0cc7504351e0f37b4f.jpg' },
    { id: 104, category: 'Sarees', title: 'Classic Weave Saree', discount: '70% OFF', price: 8500, image: 'https://i.pinimg.com/736x/62/70/59/62705951bbfd51522a6eab6ff9c72586.jpg' },
    { id: 105, category: 'Sarees', title: 'Luxury Ethnic Saree', discount: '55% OFF', price: 9999, image: 'https://i.pinimg.com/1200x/69/53/51/69535167b5fe695ce32a12a675afd5b2.jpg' },
    { id: 501, category: 'T-Shirts', title: 'Oversized Cotton Tee', discount: '30% OFF', price: 1299, image: 'https://i.pinimg.com/736x/4df0/b9/4df0b9655129c82bd4c049f59d74c898.jpg' },
    { id: 502, category: 'T-Shirts', title: 'Graphic Print Tee', discount: '40% OFF', price: 999, image: 'https://i.pinimg.com/736x/0ec7f35c1ac08fef410300897ea89ed1.jpg' },
    { id: 503, category: 'T-Shirts', title: 'Cotton Basic Tee', discount: '20% OFF', price: 799, image: 'https://i.pinimg.com/736x/dd/99/fd/dd99fd46615cd6749b55d6f452767b7e.jpg' },
    { id: 504, category: 'T-Shirts', title: 'Urban Fit Tee', discount: '50% OFF', price: 1499, image: 'https://i.pinimg.com/1200x/3b/84/e4/3b84e47037fab43ed0080f2dc77447d8.jpg' }
  ];

  const getDisplayItems = () => {
    let items = allItems;
    if (selectedCategory) items = items.filter(item => item.category === selectedCategory);
    if (searchQuery) items = items.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return items;
  };

  // --- CART FUNCTIONS ---
  const addToBag = (product) => {
    setCart([...cart, product]);
    setShowCart(true);
    setShowWishlist(false);
    setSelectedProduct(null);
  };

  // --- WISHLIST FUNCTIONS ---
  const toggleWishlist = (product) => {
    const isExist = wishlist.find(item => item.id === product.id);
    if (isExist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const renderWishlist = () => (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 className="fw-black m-0">MY WISHLIST ({wishlist.length} ITEMS)</h2>
        <button className="btn btn-outline-dark btn-sm rounded-0" onClick={() => setShowWishlist(false)}>CLOSE</button>
      </div>

      {wishlist.length > 0 ? (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {wishlist.map((item) => (
            <div key={item.id} className="col">
              <div className="card border-0 rounded-0 shadow-sm h-100 position-relative">
                <button 
                  className="btn-close position-absolute top-0 end-0 m-2 bg-white rounded-circle p-2 shadow-sm"
                  style={{ zIndex: 10, fontSize: '10px' }}
                  onClick={() => removeFromWishlist(item.id)}
                ></button>
                <div style={{ height: '320px', overflow: 'hidden' }}>
                  <img src={item.image} className="card-img-top rounded-0 h-100 w-100" style={{ objectFit: 'cover' }} alt="" />
                </div>
                <div className="card-body text-center p-3 border-top">
                  <h6 className="fw-bold small text-uppercase mb-1">{item.title}</h6>
                  <p className="text-danger fw-black mb-3">₹{Math.floor(item.price * 0.5)}</p>
                  <button 
                    className="btn btn-danger w-100 rounded-0 fw-bold small py-2"
                    onClick={() => { addToBag(item); removeFromWishlist(item.id); }}
                  >
                    MOVE TO BAG
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <h4 className="fw-bold mb-3">Your Wishlist is Empty</h4>
          <p className="text-muted">Save items that you like in your wishlist to buy them later.</p>
          <button className="btn btn-outline-danger px-5 rounded-0 mt-3" onClick={() => setShowWishlist(false)}>CONTINUE SHOPPING</button>
        </div>
      )}
    </div>
  );

  const renderCart = () => (
    <div className="container py-5">
      <h2 className="fw-black mb-4">SHOPPING BAG ({cart.length} ITEMS)</h2>
      {orderPlaced ? (
        <div className="text-center py-5">
          <h3 className="text-success fw-bold">Order Placed Successfully!</h3>
          <p>Thank you for shopping with us.</p>
          <button className="btn btn-danger rounded-0" onClick={() => {setCart([]); setOrderPlaced(false); setShowCart(false);}}>CONTINUE SHOPPING</button>
        </div>
      ) : cart.length > 0 ? (
        <div className="row">
          <div className="col-md-8">
            {cart.map((item, idx) => (
              <div key={idx} className="d-flex border p-3 mb-3 gap-3">
                <img src={item.image} style={{ width: '100px', height: '120px', objectFit: 'cover' }} alt="" />
                <div className="flex-grow-1">
                  <h6 className="fw-bold m-0">{item.title}</h6>
                  <p className="text-muted small mb-2">{item.category}</p>
                  <p className="fw-bold text-danger">₹{Math.floor(item.price * 0.5)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <div className="border p-4 bg-light">
              <h6 className="fw-bold mb-3">PRICE DETAILS</h6>
              <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{cart.reduce((acc, curr) => acc + curr.price, 0)}</span></div>
              <div className="d-flex justify-content-between mb-2 text-success"><span>Discount</span><span>-₹{cart.reduce((acc, curr) => acc + (curr.price * 0.5), 0)}</span></div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-4"><span>Total Amount</span><span>₹{cart.reduce((acc, curr) => acc + (curr.price * 0.5), 0)}</span></div>
              <button className="btn btn-danger w-100 rounded-0 fw-bold py-3" onClick={() => setOrderPlaced(true)}>PLACE ORDER</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-5">
          <p>Your bag is empty</p>
          <button className="btn btn-outline-dark rounded-0" onClick={() => setShowCart(false)}>GO BACK</button>
        </div>
      )}
    </div>
  );

  const renderProductDetail = () => (
    <div className="container py-5">
      <button className="btn btn-link text-dark p-0 mb-4 text-decoration-none" onClick={() => setSelectedProduct(null)}>
        ← BACK TO COLLECTION
      </button>
      <div className="row g-5">
        <div className="col-md-6">
          <img src={selectedProduct.image} className="img-fluid w-100 shadow-sm" style={{ maxHeight: '700px', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
        <div className="col-md-6">
          <h2 className="fw-black mb-1">{selectedProduct.title}</h2>
          <p className="text-muted mb-3">{selectedProduct.category} Special Collection</p>
          <hr />
          <div className="d-flex align-items-center gap-3 mb-4">
            <h2 className="m-0 fw-black text-danger">₹{Math.floor(selectedProduct.price * 0.5)}</h2>
            <span className="text-muted text-decoration-line-through">MRP ₹{selectedProduct.price}</span>
            <span className="badge bg-warning text-dark">{selectedProduct.discount}</span>
          </div>
          <p className="small fw-bold text-success mb-4">inclusive of all taxes</p>
          
          <h6 className="fw-bold mb-3">SELECT SIZE</h6>
          <div className="d-flex gap-2 mb-4">
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button key={size} className="btn btn-outline-dark rounded-0 px-4">{size}</button>
            ))}
          </div>

          <div className="d-grid gap-2">
            <button className="btn btn-danger btn-lg rounded-0 fw-bold py-3" onClick={() => addToBag(selectedProduct)}>ADD TO BAG</button>
            <button 
              className={`btn btn-lg rounded-0 fw-bold py-3 ${wishlist.some(i => i.id === selectedProduct.id) ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => toggleWishlist(selectedProduct)}
            >
              {wishlist.some(i => i.id === selectedProduct.id) ? '♥ IN WISHLIST' : '♡ WISHLIST'}
            </button>
          </div>
          
          <div className="mt-5">
            <h6 className="fw-bold">PRODUCT DETAILS</h6>
            <p className="text-muted small">
              This premium {selectedProduct.category} is crafted from high-quality fabric, ensuring both comfort and style. 
              Perfect for everyday wear or special occasions. Features a modern fit and durable stitching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGrid = (data, label) => (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-black m-0" style={{ letterSpacing: '2px' }}>{label}</h3>
        {selectedCategory && (
          <button className="btn btn-sm btn-outline-danger" onClick={() => setSelectedCategory(null)}>VIEW ALL</button>
        )}
      </div>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4">
        {data.map((item) => (
          <div key={item.id} className="col" onClick={() => {setSelectedProduct(item); setShowCart(false); setShowWishlist(false);}} style={{ cursor: 'pointer' }}>
            <div className="card border-0 rounded-0 shadow-sm category-card h-100">
              <div className="position-relative overflow-hidden" style={{ height: '350px' }}>
                <img src={item.image} className="card-img-top rounded-0 h-100 w-100" alt={item.title} style={{ objectFit: 'cover', objectPosition: 'top center' }} />
              </div>
              <div className="card-body text-center bg-white border-top p-3">
                <p className="m-0 fw-bold text-dark small text-uppercase" style={{ fontSize: '12px' }}>{item.title}</p>
                <h5 className="m-0 fw-black text-danger mt-1">{item.discount}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- NEW APPENDED STATE FOR CHECKOUT FLOW ---
  const [checkoutStep, setCheckoutStep] = useState(null); // 'login', 'details', 'address', 'payment', 'success'

  // --- NEW APPENDED RENDER FUNCTIONS ---
  const renderCheckoutFlow = () => {
    switch (checkoutStep) {
      case 'login':
        return (
          <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-0 border-0 p-4">
                <h4 className="fw-black text-center mb-4">LOGIN OR SIGNUP</h4>
                <div className="mb-3">
                  <input type="text" className="form-control rounded-0 p-3" placeholder="Mobile Number or Email" />
                </div>
                <p className="small text-muted mb-4">By continuing, I agree to the Terms of Use & Privacy Policy</p>
                <button className="btn btn-danger w-100 rounded-0 fw-bold py-3" onClick={() => setCheckoutStep('details')}>CONTINUE</button>
              </div>
            </div>
          </div>
        );
      case 'details':
        return (
          <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
              <h4 className="fw-black mb-4">ORDER DETAILS</h4>
              <div className="card rounded-0 border p-4 mb-4">
                <p className="fw-bold mb-2">Items in Cart: {cart.length}</p>
                <p className="mb-0">Estimated Delivery: 3-5 Business Days</p>
                <hr />
                <h5 className="fw-black text-danger">Total: ₹{cart.reduce((acc, curr) => acc + (curr.price * 0.5), 0)}</h5>
              </div>
              <button className="btn btn-danger w-100 rounded-0 fw-bold py-3" onClick={() => setCheckoutStep('address')}>PROCEED TO ADDRESS</button>
            </div>
          </div>
        );
      case 'address':
        return (
          <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
              <h4 className="fw-black mb-4">SHIPPING ADDRESS</h4>
              <div className="row g-3 mb-4">
                <div className="col-12"><input type="text" className="form-control rounded-0" placeholder="Full Name" /></div>
                <div className="col-12"><input type="text" className="form-control rounded-0" placeholder="Pincode" /></div>
                <div className="col-12"><textarea className="form-control rounded-0" placeholder="Address (House No, Building, Street, Area)"></textarea></div>
                <div className="col-md-6"><input type="text" className="form-control rounded-0" placeholder="City" /></div>
                <div className="col-md-6"><input type="text" className="form-control rounded-0" placeholder="State" /></div>
              </div>
              <button className="btn btn-danger w-100 rounded-0 fw-bold py-3" onClick={() => setCheckoutStep('payment')}>SAVE & PROCEED TO PAYMENT</button>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="container py-5">
            <div className="mx-auto" style={{ maxWidth: '600px' }}>
              <h4 className="fw-black mb-4">PAYMENT OPTIONS</h4>
              <div className="list-group rounded-0 mb-4">
                <label className="list-group-item d-flex gap-3 py-3">
                  <input className="form-check-input flex-shrink-0" type="radio" name="pay" defaultChecked />
                  <span>Cash On Delivery (Cash/UPI)</span>
                </label>
                <label className="list-group-item d-flex gap-3 py-3">
                  <input className="form-check-input flex-shrink-0" type="radio" name="pay" />
                  <span>Credit / Debit Card</span>
                </label>
                <label className="list-group-item d-flex gap-3 py-3">
                  <input className="form-check-input flex-shrink-0" type="radio" name="pay" />
                  <span>PhonePe / Google Pay / UPI</span>
                </label>
              </div>
              <button className="btn btn-danger w-100 rounded-0 fw-bold py-3" onClick={() => { setCheckoutStep('success'); setOrderPlaced(true); }}>PAY NOW</button>
            </div>
          </div>
        );
      case 'success':
        return (
          <div className="container py-5 text-center">
            <div className="order-animation mb-4">
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
            </div>
            <h2 className="fw-black text-success">ORDER PLACED!</h2>
            <p className="text-muted">Your style is on its way. Reference ID: #MYN{Math.floor(Math.random() * 999999)}</p>
            <button className="btn btn-outline-dark rounded-0 px-5 py-3 mt-4" onClick={() => { setCheckoutStep(null); setCart([]); setShowCart(false); setOrderPlaced(false); }}>CONTINUE SHOPPING</button>
          </div>
        );
      default:
        return renderCart();
    }
  };

  // --- TRIGGER FOR NEW FLOW (Append logic to handle Place Order click) ---
  const handlePlaceOrderClick = () => {
    setCheckoutStep('login');
  };

  return (
    <div className="shop-page bg-white" style={{ minHeight: '100vh' }}>
      <div className="shop-nav sticky-top bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4 py-3">
          <div className="row align-items-center g-3">
            <div className="col-auto">
              <div className="d-flex gap-4 fw-bold text-uppercase small nav-links">
                {['Women', 'Men', 'Kids'].map((mainCat) => (
                  <div className="nav-item-dropdown d-none d-lg-block" key={mainCat}>
                    <span className="nav-link-text">{mainCat}</span>
                    <div className="mega-menu">
                      <div className="row p-4">
                        {menuCategories[mainCat].map((sub, idx) => (
                          <div className="col-6" key={idx}>
                            <h6 className="fw-bold text-danger mb-2 small">{sub.title}</h6>
                            <ul className="list-unstyled">
                              {sub.items.map((item, i) => (
                                <li key={i} className="py-1 text-muted small hover-item" 
                                    onClick={() => { setSelectedCategory(item); setSelectedProduct(null); setShowCart(false); setShowWishlist(false); }}>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <span onClick={() => {setSelectedCategory(null); setSelectedProduct(null); setShowCart(false); setShowWishlist(false);}} className="nav-link-text">Shop</span>
                <span onClick={() => {setShowWishlist(true); setShowCart(false); setSelectedProduct(null);}} className="nav-link-text">Wishlist ({wishlist.length})</span>
                <span onClick={() => {setShowCart(true); setShowWishlist(false); setSelectedProduct(null);}} className="nav-link-text text-danger">Bag ({cart.length})</span>
                <span onClick={onBack} className="nav-link-text text-primary">Home</span>
              </div>
            </div>
            <div className="col">
              <input 
                type="text" 
                className="form-control bg-light border-0 shadow-none rounded-0" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setSelectedCategory(null); setSelectedProduct(null); setShowCart(false); setShowWishlist(false);}}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="content-container">
        {checkoutStep ? (
          renderCheckoutFlow()
        ) : showCart ? (
          <div className="container py-5">
            <h2 className="fw-black mb-4">SHOPPING BAG ({cart.length} ITEMS)</h2>
            {cart.length > 0 ? (
              <div className="row">
                <div className="col-md-8">
                  {cart.map((item, idx) => (
                    <div key={idx} className="d-flex border p-3 mb-3 gap-3">
                      <img src={item.image} style={{ width: '100px', height: '120px', objectFit: 'cover' }} alt="" />
                      <div className="flex-grow-1">
                        <h6 className="fw-bold m-0">{item.title}</h6>
                        <p className="text-muted small mb-2">{item.category}</p>
                        <p className="fw-bold text-danger">₹{Math.floor(item.price * 0.5)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="col-md-4">
                  <div className="border p-4 bg-light">
                    <h6 className="fw-bold mb-3">PRICE DETAILS</h6>
                    <div className="d-flex justify-content-between mb-2"><span>Total MRP</span><span>₹{cart.reduce((acc, curr) => acc + curr.price, 0)}</span></div>
                    <div className="d-flex justify-content-between mb-2 text-success"><span>Discount</span><span>-₹{cart.reduce((acc, curr) => acc + (curr.price * 0.5), 0)}</span></div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold mb-4"><span>Total Amount</span><span>₹{cart.reduce((acc, curr) => acc + (curr.price * 0.5), 0)}</span></div>
                    <button className="btn btn-danger w-100 rounded-0 fw-bold py-3" onClick={handlePlaceOrderClick}>PLACE ORDER</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <p>Your bag is empty</p>
                <button className="btn btn-outline-dark rounded-0" onClick={() => setShowCart(false)}>GO BACK</button>
              </div>
            )}
          </div>
        ) : showWishlist ? (
          renderWishlist()
        ) : selectedProduct ? (
          renderProductDetail()
        ) : selectedCategory ? (
          renderGrid(getDisplayItems(), `RESULTS FOR: ${selectedCategory.toUpperCase()}`)
        ) : (
          <>
            {renderGrid(allItems.slice(0, 5), "TOP TRENDS")}
            <div className="py-2 bg-dark text-white text-center small fw-bold" style={{letterSpacing:'4px'}}>NEW SEASON DROP</div>
            {renderGrid(allItems.slice(5, 10), "ESSENTIALS")}
          </>
        )}
      </div>

      <style>{`
        .nav-item-dropdown { position: relative; padding-bottom: 10px; cursor: pointer; }
        .mega-menu { 
          display: none; position: absolute; top: 100%; left: 0; 
          width: 450px; background: white; box-shadow: 0 15px 30px rgba(0,0,0,0.1); 
          z-index: 2000; border-top: 3px solid #ff3f6c; 
        }
        .nav-item-dropdown:hover .mega-menu { display: block; }
        .hover-item:hover { color: #ff3f6c !important; font-weight: bold; cursor: pointer;}
        .category-card { transition: all 0.3s ease; }
        .category-card:hover { transform: translateY(-8px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .fw-black { font-weight: 900; }
        .nav-link-text:hover { color: #ff3f6c; cursor: pointer; }

        /* Animation Styles */
        .success-checkmark { width: 80px; height: 115px; margin: 0 auto; }
        .check-icon { width: 80px; height: 80px; position: relative; border-radius: 50%; box-sizing: content-box; border: 4px solid #4CAF50; }
        .check-icon::before { top: 3px; left: -2px; width: 30px; transform-origin: 100% 50%; border-radius: 100px 0 0 100px; }
        .check-icon::after { top: 0; left: 30px; width: 60px; transform-origin: 0 50%; border-radius: 0 100px 100px 0; animation: rotate-circle 4.25s ease-in; }
        .icon-line { height: 5px; background-color: #4CAF50; display: block; border-radius: 2px; position: absolute; z-index: 10; }
        .line-tip { top: 46px; left: 14px; width: 25px; transform: rotate(45deg); }
        .line-long { top: 38px; right: 8px; width: 47px; transform: rotate(-45deg); }
        @keyframes rotate-circle { 0% { transform: rotate(-45deg); } 5% { transform: rotate(-45deg); } 12% { transform: rotate(-405deg); } 100% { transform: rotate(-405deg); } }
      `}</style>
    </div>
  );
};

export default Shop;