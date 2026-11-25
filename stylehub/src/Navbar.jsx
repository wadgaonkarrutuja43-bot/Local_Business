import React from 'react';

const Navbar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categoriesList,
  cartCount,
  wishlistCount,
  currentUser,
  onOpenProfile,
  onOpenWishlist,
  onOpenCart,
  onSignOut,
  onLogoClick
}) => {
  return (
    <header className="global-top-header sticky-top bg-white border-bottom shadow-2xs">
      
      {/* Top Header Row */}
      <div className="container-fluid px-lg-5 py-3">
        <div className="row align-items-center g-3">
          
          {/* Logo */}
          <div className="col-auto">
            <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={onLogoClick}>
              <h2 className="brand-header-logo m-0">
                STYLE<span className="brand-logo-accent">HUB</span>
              </h2>
            </div>
          </div>

          {/* Search Bar */}
          <div className="col-12 col-md-5 mx-auto">
            <div className="input-group global-search-bar">
              <input 
                type="text" 
                className="form-control border-end-0" 
                placeholder="Search products across all collections..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!currentUser}
              />
              <button className="btn btn-outline-secondary border-start-0 bg-white text-muted px-3" type="button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>

          {/* User Controls */}
          <div className="col-auto">
            <div className="d-flex align-items-center gap-4 text-center">
              
              {/* Profile / Dashboard */}
              <div className="cursor-pointer" onClick={onOpenProfile}>
                <i className="bi bi-person fs-5 d-block text-maroon"></i>
                <span className="header-icon-label">
                  {currentUser ? (currentUser.role === 'admin' ? 'Dashboard' : 'Profile') : 'Profile'}
                </span>
              </div>

              {/* Wishlist */}
              <div className="cursor-pointer position-relative" onClick={onOpenWishlist}>
                <i className={`bi ${wishlistCount > 0 ? 'bi-heart-fill text-danger' : 'bi-heart'} fs-5 d-block`}></i>
                <span className="header-icon-label">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {wishlistCount}
                  </span>
                )}
              </div>

              {/* Shopping Bag */}
              <div className="cursor-pointer position-relative" onClick={onOpenCart}>
                <i className="bi bi-bag fs-5 d-block"></i>
                <span className="header-icon-label">Bag</span>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-maroon">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Signout Button */}
              {currentUser && (
                <button className="btn btn-sm btn-outline-danger rounded-circle ms-2" onClick={onSignOut} title="Sign Out">
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* Main Categories Navigation */}
      <nav className="border-top bg-white">
        <div className="container-fluid px-lg-5">
          <ul className="nav justify-content-center flex-nowrap overflow-auto py-2">
            {categoriesList.map((cat) => (
              <li key={cat} className="nav-item">
                <span 
                  className={`nav-link main-cat-link text-uppercase ${selectedCategory === cat ? 'active-main-cat' : ''}`}
                  onClick={() => {
                    if (currentUser) {
                      setSelectedCategory(cat);
                    }
                  }}
                >
                  {cat}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <style>{`
        .brand-header-logo {
          font-weight: 800;
          letter-spacing: 3px;
          color: #660018;
          font-size: 24px;
        }

        .brand-logo-accent {
          color: #2b2b2b;
          font-weight: 300;
        }

        .global-search-bar input {
          border: 1px solid #d1d5db;
          padding: 8px 16px;
          font-size: 14px;
        }

        .header-icon-label {
          font-size: 11px;
          font-weight: 600;
          color: #374151;
          display: block;
        }

        .main-cat-link {
          color: #374151;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 16px !important;
          letter-spacing: 0.5px;
          cursor: pointer;
        }

        .main-cat-link:hover, .active-main-cat {
          color: #660018 !important;
          border-bottom: 2px solid #660018;
        }

        .text-maroon { color: #660018 !important; }
        .bg-maroon { background-color: #660018 !important; color: #ffffff !important; }
      `}</style>
    </header>
  );
};

export default Navbar;