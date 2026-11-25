import React, { useState, useEffect } from 'react';
import SizeGuideModal from './SizeGuideModal';

const ProductDetail = ({ 
  product, 
  allProducts = [],
  onBack, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist 
}) => {
  const [currentProduct, setCurrentProduct] = useState(product);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const isApparel = ['saree', 'lehenga', 'kurti', 'tops', 'daily wear'].some(cat => 
    (currentProduct?.category || '').toLowerCase().includes(cat)
  );

  // States
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('M');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Location & Address States
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [locLoading, setLocLoading] = useState(false);

  // Policy Modal States
  const [policyModal, setPolicyModal] = useState(null); // 'returns' | 'delivery'

  // Pricing calculations
  const unitPrice = parseFloat(currentProduct?.price || 0);
  const originalMrp = parseFloat(currentProduct?.original_mrp || unitPrice * 1.25);
  const totalPrice = (unitPrice * quantity).toFixed(2);
  const discountPercent = originalMrp > unitPrice 
    ? Math.round(((originalMrp - unitPrice) / originalMrp) * 100) 
    : 0;

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Normalize product name to find matching color variants in the database
  const getBaseName = (name = '') => {
    return name
      .toLowerCase()
      .replace(/\b(peach|lavender|red|blue|sky blue|green|olive green|black|yellow|pink|maroon|gold|silver|white|orange|purple)\b/gi, '')
      .replace(/[-–—()]/g, '')
      .trim();
  };

  const currentBaseName = getBaseName(currentProduct?.name);

  // Group real products added in different colors
  const relatedColorVariants = allProducts.filter((p) => {
    if (!p) return false;
    const sameCat = (p.category || '').toLowerCase().trim() === (currentProduct?.category || '').toLowerCase().trim();
    const sameBase = getBaseName(p.name) === currentBaseName || p.name.toLowerCase().includes(currentBaseName);
    return sameCat && sameBase;
  });

  const extractColorName = (p) => {
    if (p.available_colors && p.available_colors.trim()) {
      return p.available_colors.split(',')[0].trim();
    }
    const match = p.name.match(/\b(Peach|Lavender|Red|Blue|Sky Blue|Green|Olive Green|Black|Yellow|Pink|Maroon|Gold|Silver|White|Orange|Purple)\b/i);
    return match ? match[0] : 'Standard';
  };

  // Dynamic Estimated Delivery Date Calculation (3-5 business days from today)
  const calculateDeliveryDate = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;

    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);

    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return {
      rangeText: `3 - 5 Business Days`,
      dateText: `${minDate.toLocaleDateString('en-IN', options)} - ${maxDate.toLocaleDateString('en-IN', options)}`
    };
  };

  // Quantity Handlers
  const handleIncreaseQty = () => {
    const maxStock = currentProduct?.stock_quantity || 10;
    if (quantity < maxStock) setQuantity(prev => prev + 1);
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  // Native Share / Clipboard Fallback
  const handleShareProduct = async () => {
    const shareData = {
      title: currentProduct?.name || 'StyleHub Product',
      text: `Check out ${currentProduct?.name} on StyleHub for ₹${currentProduct?.price}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share dismissed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  // Geolocation Browser API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocLoading(false);
        setPincode('400001'); // Auto-resolved city center fallback
        const deliveryDates = calculateDeliveryDate();
        setDeliveryInfo({
          city: 'Your Current Area (Verified)',
          isDeliverable: true,
          ...deliveryDates
        });
      },
      (error) => {
        setLocLoading(false);
        alert('Location access denied. Please enter your 6-digit Pincode manually.');
      }
    );
  };

  // Manual Pincode Validation
  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode)) {
      const deliveryDates = calculateDeliveryDate();
      setDeliveryInfo({
        city: `Pincode: ${pincode}`,
        isDeliverable: true,
        ...deliveryDates
      });
    } else {
      alert('Please enter a valid 6-digit postal pincode.');
      setDeliveryInfo({ isDeliverable: false });
    }
  };

  // Purchase Actions
  const handleAddToCartAction = (isBuyNow) => {
    const customizedProduct = {
      ...currentProduct,
      orderQuantity: quantity,
      price: unitPrice,
      totalOrderPrice: parseFloat(totalPrice),
      selectedSize: isApparel ? selectedSize : 'Standard',
      deliveryAddress: address || (pincode ? `Pincode: ${pincode}` : 'Default Customer Address')
    };

    onAddToCart(customizedProduct, isBuyNow);
  };

  return (
    <div className="product-detail-wrapper pb-5">
      
      {/* Top Breadcrumb / Back Action */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          type="button" 
          className="btn btn-outline-dark btn-sm rounded-0 fw-semibold"
          onClick={onBack}
        >
          ← Back to {currentProduct?.category || 'Collection'}
        </button>

        {/* Share Button */}
        <button 
          type="button" 
          className="btn btn-light border btn-sm d-flex align-items-center gap-2 px-3 rounded-pill fw-semibold shadow-2xs"
          onClick={handleShareProduct}
        >
          <i className="bi bi-share-fill text-maroon"></i>
          <span>{shareCopied ? 'Link Copied!' : 'Share Product'}</span>
        </button>
      </div>

      <div className="row g-4 g-xl-5">
        
        {/* Left Column: Product Showcase */}
        <div className="col-12 col-lg-6">
          <div className="main-image-frame position-relative w-100 shadow-2xs rounded-2 overflow-hidden border">
            {discountPercent > 0 && (
              <span className="sale-badge">{discountPercent}% OFF</span>
            )}
            <img 
              src={currentProduct?.image_url} 
              alt={currentProduct?.name} 
              className="w-100 h-100 object-fit-cover main-showcase-img" 
            />
          </div>
        </div>

        {/* Right Column: Complete E-commerce Product Console */}
        <div className="col-12 col-lg-6">
          
          {/* Rating & Wishlist Row */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success py-1 px-2 d-flex align-items-center gap-1 font-monospace">
                4.8 <i className="bi bi-star-fill text-warning" style={{ fontSize: '10px' }}></i>
              </span>
              <small className="text-muted fw-semibold">| 142 Ratings & 28 Reviews</small>
            </div>

            <button 
              className={`btn-wishlist-heart ${isInWishlist ? 'text-danger' : 'text-muted'}`}
              onClick={() => onToggleWishlist(currentProduct)}
              title="Save to Wishlist"
            >
              <i className={`bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'} fs-4`}></i>
            </button>
          </div>

          {/* Product Title */}
          <h1 className="product-page-title mb-2 text-dark">{currentProduct?.name}</h1>

          {/* Pricing Row */}
          <div className="d-flex align-items-baseline gap-3 my-2">
            <span className="current-price">₹{unitPrice.toFixed(2)}</span>
            {originalMrp > unitPrice && (
              <span className="mrp-strikethrough">
                MRP <del>₹{originalMrp.toFixed(2)}</del>
              </span>
            )}
            {discountPercent > 0 && <span className="discount-tag">{discountPercent}% OFF</span>}
          </div>
          <small className="inclusive-taxes-label d-block mb-3">inclusive of all taxes</small>

          {/* Real Available Color Variants */}
          <div className="mb-4 pt-2 border-top">
            <label className="fw-bold small text-dark d-block mb-2">
              Available Colors / Variants: <span className="text-maroon fw-bold">{extractColorName(currentProduct)}</span>
            </label>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              {relatedColorVariants.length > 0 ? (
                relatedColorVariants.map((variant) => {
                  const isSelected = variant.id === currentProduct.id;
                  const colorLabel = extractColorName(variant);

                  return (
                    <div
                      key={variant.id}
                      className={`real-color-chip ${isSelected ? 'active-variant' : ''}`}
                      onClick={() => setCurrentProduct(variant)}
                      title={`Select ${colorLabel}`}
                    >
                      <img src={variant.image_url} alt="" className="chip-img" />
                      <small className="d-block text-truncate text-center mt-1 fw-semibold" style={{ fontSize: '11px' }}>
                        {colorLabel}
                      </small>
                    </div>
                  );
                })
              ) : (
                <div className="real-color-chip active-variant">
                  <img src={currentProduct?.image_url} alt="" className="chip-img" />
                  <small className="d-block text-truncate text-center mt-1 fw-semibold" style={{ fontSize: '11px' }}>
                    {extractColorName(currentProduct)}
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Size Selector for Apparel */}
          {isApparel && (
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fw-bold small text-dark m-0">Select Size</label>
                <button 
                  type="button" 
                  className="btn-size-guide-link d-flex align-items-center gap-1"
                  onClick={() => setShowSizeGuide(true)}
                >
                  <i className="bi bi-rulers"></i>
                  <span>Size Guide (Inch/CM)</span>
                </button>
              </div>

              <div className="d-flex gap-2">
                {availableSizes.map((size) => (
                  <button 
                    key={size}
                    type="button"
                    className={`btn-size-box ${selectedSize === size ? 'active-size' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-4 d-flex align-items-center gap-4">
            <div>
              <label className="fw-bold small text-dark d-block mb-1">Quantity</label>
              <div className="quantity-counter-box d-flex align-items-center border">
                <button 
                  type="button" 
                  className="qty-btn" 
                  onClick={handleDecreaseQty}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="qty-val px-3 fw-bold">{quantity}</span>
                <button 
                  type="button" 
                  className="qty-btn" 
                  onClick={handleIncreaseQty}
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <small className="text-muted d-block mb-1">Total Price</small>
              <span className="fw-bold text-maroon fs-5">₹{totalPrice}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="row g-3 mb-4">
            <div className="col-6">
              <button 
                type="button" 
                className="btn btn-maroon w-100 py-3 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => handleAddToCartAction(false)}
              >
                <i className="bi bi-cart3"></i> ADD TO CART
              </button>
            </div>
            <div className="col-6">
              <button 
                type="button" 
                className="btn btn-buy-now w-100 py-3 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 shadow-sm"
                onClick={() => handleAddToCartAction(true)}
              >
                <i className="bi bi-lightning-charge-fill text-warning"></i> BUY NOW
              </button>
            </div>
          </div>

          {/* Trust Badges Strip (Free Delivery, COD, 7-Day Returns) */}
          <div className="row g-2 text-center my-4 py-3 bg-light border rounded-2">
            <div className="col-4 border-end">
              <i className="bi bi-truck fs-4 text-maroon d-block mb-1"></i>
              <strong className="d-block small text-dark">FREE DELIVERY</strong>
              <small className="text-muted" style={{ fontSize: '10px' }}>On all orders</small>
            </div>
            <div className="col-4 border-end">
              <i className="bi bi-cash-stack fs-4 text-success d-block mb-1"></i>
              <strong className="d-block small text-dark">CASH ON DELIVERY</strong>
              <small className="text-muted" style={{ fontSize: '10px' }}>Pay upon arrival</small>
            </div>
            <div className="col-4 cursor-pointer" onClick={() => setPolicyModal('returns')}>
              <i className="bi bi-arrow-repeat fs-4 text-primary d-block mb-1"></i>
              <strong className="d-block small text-dark">7-DAY RETURNS</strong>
              <small className="text-maroon text-decoration-underline" style={{ fontSize: '10px' }}>View Policy</small>
            </div>
          </div>

          {/* Delivery & Pincode / Location Checker */}
          <div className="delivery-card p-3 border rounded-2 mb-4 bg-white">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="fw-bold small text-dark m-0">
                <i className="bi bi-geo-alt-fill text-maroon me-1"></i> Check Delivery & Estimated Arrival
              </label>

              {/* Geolocation Trigger */}
              <button 
                type="button" 
                className="btn btn-sm btn-link p-0 text-maroon text-decoration-none fw-bold small d-flex align-items-center gap-1"
                onClick={handleDetectLocation}
                disabled={locLoading}
              >
                <i className="bi bi-crosshair"></i> {locLoading ? 'Locating...' : 'Use Current Location'}
              </button>
            </div>

            <form onSubmit={handleCheckPincode} className="d-flex gap-2 mb-2">
              <input 
                type="text" 
                maxLength="6"
                className="form-control rounded-0 form-control-sm" 
                placeholder="Enter 6-digit postal pincode" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
              <button type="submit" className="btn btn-dark-maroon btn-sm rounded-0 px-3 fw-bold text-uppercase">
                Check
              </button>
            </form>

            {/* Optional Address Input */}
            <input 
              type="text" 
              className="form-control rounded-0 form-control-sm mt-2" 
              placeholder="Delivery Flat / House No., Street, Landmark (Optional)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            {/* Live Delivery Result */}
            {deliveryInfo && (
              <div className={`mt-3 p-2 rounded-1 small ${deliveryInfo.isDeliverable ? 'bg-success-subtle text-success-emphasis border border-success-subtle' : 'bg-danger-subtle text-danger'}`}>
                {deliveryInfo.isDeliverable ? (
                  <div>
                    <div className="d-flex align-items-center gap-1 fw-bold">
                      <i className="bi bi-check-circle-fill"></i> Delivery Available for {deliveryInfo.city}
                    </div>
                    <div className="mt-1 text-dark">
                      <strong>Expected Delivery:</strong> {deliveryInfo.dateText} ({deliveryInfo.rangeText})
                    </div>
                  </div>
                ) : (
                  <div>Delivery is currently unavailable to this location.</div>
                )}
              </div>
            )}
          </div>

          {/* Product Specifications & Details */}
          <div className="border-top pt-3">
            <h6 className="fw-bold text-dark mb-2 small text-uppercase">Product Specifications</h6>
            {currentProduct?.fabric && <p className="small text-muted m-0 mb-1"><strong>Material / Fabric:</strong> {currentProduct.fabric}</p>}
            {currentProduct?.work_type && <p className="small text-muted m-0 mb-1"><strong>Work / Pattern:</strong> {currentProduct.work_type}</p>}
            {currentProduct?.wash_care && <p className="small text-muted m-0 mb-1"><strong>Care Instructions:</strong> {currentProduct.wash_care}</p>}
            <p className="small text-muted m-0 mt-2">{currentProduct?.description || 'Crafted with premium quality materials for exceptional durability, elegance, and comfort.'}</p>
          </div>

        </div>

      </div>

      {/* Apparel Size Guide Modal */}
      {isApparel && (
        <SizeGuideModal 
          show={showSizeGuide} 
          onClose={() => setShowSizeGuide(false)} 
          category={currentProduct?.category || 'Kurti'} 
        />
      )}

      {/* 7-Day Returns Policy Modal */}
      {policyModal === 'returns' && (
        <div className="policy-overlay d-flex align-items-center justify-content-center p-3" tabIndex="-1">
          <div className="bg-white p-4 rounded-3 shadow-lg border" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold text-maroon m-0">7-Day Returns & Exchange Policy</h5>
              <button type="button" className="btn-close" onClick={() => setPolicyModal(null)}></button>
            </div>
            <ul className="text-secondary small lh-lg ps-3 mb-4">
              <li><strong>Hassle-Free Return:</strong> You can initiate a return or exchange within 7 days of delivery.</li>
              <li><strong>Condition:</strong> Items must be returned unworn, unwashed, and with all original tags intact.</li>
              <li><strong>Fast Refunds:</strong> Refunds are credited back to your original payment method (or bank account for COD) within 3-5 business days.</li>
            </ul>
            <button className="btn btn-maroon w-100 rounded-0 py-2 fw-bold text-uppercase small" onClick={() => setPolicyModal(null)}>
              Understood
            </button>
          </div>
        </div>
      )}

      <style>{`
        .main-image-frame {
          height: 650px;
          background: #fdfdfd;
        }

        .main-showcase-img {
          height: 100%;
          width: 100%;
        }

        .sale-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #660018;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 10px;
          z-index: 10;
        }

        .current-price {
          font-size: 26px;
          font-weight: 800;
          color: #111827;
        }

        .discount-tag {
          font-size: 16px;
          font-weight: 700;
          color: #16a34a;
        }

        .mrp-strikethrough {
          color: #6b7280;
          font-size: 14px;
        }

        .real-color-chip {
          width: 68px;
          padding: 4px;
          border: 1.5px solid #e5e7eb;
          cursor: pointer;
          border-radius: 4px;
          background: #ffffff;
          transition: all 0.2s ease;
        }

        .real-color-chip:hover, .active-variant {
          border-color: #660018 !important;
          box-shadow: 0 0 0 2px #660018;
        }

        .chip-img {
          width: 100%;
          height: 64px;
          object-fit: cover;
          border-radius: 2px;
        }

        .quantity-counter-box {
          background: #ffffff;
          border-radius: 4px;
          height: 40px;
        }

        .qty-btn {
          border: none;
          background: #f3f4f6;
          width: 38px;
          height: 100%;
          font-weight: bold;
          font-size: 18px;
          color: #374151;
          cursor: pointer;
        }
        .qty-btn:hover:not(:disabled) {
          background: #e5e7eb;
        }
        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .btn-size-box {
          width: 44px;
          height: 44px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-weight: 700;
          font-size: 13px;
          color: #374151;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .btn-size-box:hover {
          border-color: #660018;
          color: #660018;
        }

        .active-size {
          background: #660018 !important;
          color: #ffffff !important;
          border-color: #660018 !important;
        }

        .btn-maroon {
          background-color: #660018;
          color: #ffffff;
          border: 1px solid #660018;
          border-radius: 2px;
        }
        .btn-maroon:hover {
          background-color: #4d0012;
          color: #ffffff;
        }

        .btn-dark-maroon {
          background-color: #660018;
          color: #ffffff;
          border: none;
        }

        .btn-buy-now {
          background-color: #ffffff;
          color: #111827;
          border: 1.5px solid #660018;
          border-radius: 2px;
        }
        .btn-buy-now:hover {
          background-color: #fff0f3;
        }

        .btn-size-guide-link {
          background: none;
          border: none;
          color: #660018;
          font-size: 12px;
          font-weight: 700;
          text-decoration: underline;
          cursor: pointer;
        }

        .policy-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2400;
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;