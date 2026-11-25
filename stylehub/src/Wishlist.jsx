import React from 'react';

const Wishlist = ({ 
  wishlist, 
  onClose, 
  onSelectProduct, 
  onRemoveFromWishlist, 
  onMoveToCart 
}) => {
  return (
    <div className="container-fluid px-0 py-2">
      {/* Header bar */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold m-0 text-maroon">MY WISHLIST ({wishlist.length} ITEMS)</h4>
          <small className="text-muted">Save your favorite pieces and move them to your bag anytime.</small>
        </div>
        <button className="btn btn-outline-dark btn-sm rounded-0 fw-semibold" onClick={onClose}>
          ← Back to Store
        </button>
      </div>

      {wishlist.length > 0 ? (
        /* Wishlist Grid */
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {wishlist.map((item) => (
            <div key={item.id} className="col">
              <div className="card h-100 border shadow-2xs rounded-0 position-relative">
                
                {/* Remove button */}
                <button 
                  className="btn-wishlist-remove position-absolute top-0 end-0 m-2 shadow-sm"
                  onClick={() => onRemoveFromWishlist(item.id)}
                  title="Remove from wishlist"
                >
                  ✕
                </button>

                {/* Product Image */}
                <div 
                  style={{ height: '320px', cursor: 'pointer' }}
                  onClick={() => onSelectProduct(item)}
                >
                  <img 
                    src={item.image_url} 
                    className="w-100 h-100 object-fit-cover" 
                    alt={item.name} 
                  />
                </div>

                {/* Details & Actions */}
                <div className="card-body p-3 bg-white text-center">
                  <span className="badge category-badge mb-1">{item.category || 'Women'}</span>
                  <h6 className="fw-bold text-dark text-truncate small mb-1">{item.name}</h6>
                  <h6 className="fw-bold text-maroon mb-3">₹{item.price}</h6>

                  <button 
                    type="button"
                    className="btn btn-maroon w-100 py-2 fw-bold small text-uppercase rounded-0"
                    onClick={() => onMoveToCart(item)}
                  >
                    MOVE TO BAG
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-5 my-5">
          <i className="bi bi-heart fs-1 text-muted"></i>
          <h5 className="fw-bold mt-3 text-dark">Your Wishlist is Empty</h5>
          <p className="text-muted small">Explore our collections and tap the heart icon on any piece to save it here.</p>
          <button className="btn btn-maroon px-4 py-2 rounded-0 mt-2 fw-semibold" onClick={onClose}>
            Start Exploring
          </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;