import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import {
  HiChevronDown, HiChevronUp, HiClipboardList, HiCog,
  HiLogout, HiShoppingCart, HiLocationMarker, HiUser, HiBell, HiCheckCircle, HiSearch, HiX,
} from 'react-icons/hi';
import './Navbar.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png';

const DALLAS_LOCATIONS = [
  'Dallas, TX',
  'Plano, TX',
  'Frisco, TX',
  'Fort Worth, TX',
  'Arlington, TX',
  'Irving, TX',
  'McKinney, TX',
];

const SIGNIN_BY_ROLE = {
  customer: '/customer/signin',
  worker: '/worker/signin',
  admin: '/admin/signin',
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useStore(s => s.cart.length);
  const activeOrder = useStore(s => s.activeOrder);
  const navigate = useNavigate();

  const [dropOpen, setDropOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('Dallas, TX');
  const [searchQuery, setSearchQuery] = useState('');

  const dropRef = useRef();
  const locRef = useRef();
  const notifRef = useRef();

  useEffect(() => {
    const handler = e => {
      if (!dropRef.current?.contains(e.target)) setDropOpen(false);
      if (!locRef.current?.contains(e.target)) setLocOpen(false);
      if (!notifRef.current?.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    const role = user?.role || 'customer';
    logout();
    navigate(SIGNIN_BY_ROLE[role], { replace: true });
    setDropOpen(false);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const customer = user?.role === 'customer';

  const renderSearchForm = () => (
    <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
      <HiSearch className="nav-search-icon" />
      <input
        type="text"
        className="nav-search-input"
        placeholder="Search house cleaning, plumber, HVAC..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button type="button" className="nav-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
          <HiX style={{ width: 13, height: 13 }} />
        </button>
      )}
      <button type="submit" className="nav-search-submit-btn" aria-label="Submit search">
        <HiSearch style={{ width: 14, height: 14 }} />
        <span className="btn-text">Search</span>
      </button>
    </form>
  );

  return (
    <nav className="navbar">
      {/* ROW 1: Logo & Location on Left | Desktop Search in Center | Notifications, Cart, User on Right */}
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="brand" aria-label="Clean America Dallas home">
            <img src={LOGO_URL} alt="Clean America Dallas" className="brand-logo-image" />
          </Link>

          <div className="location-menu" ref={locRef}>
            <button className="location-btn" onClick={() => setLocOpen(o => !o)}>
              <HiLocationMarker className="loc-icon" />
              <span className="location-text">{selectedLoc}</span>
              <HiChevronDown className={`loc-chevron ${locOpen ? 'open' : ''}`} />
            </button>

            {locOpen && (
              <div className="location-dropdown">
                <div className="loc-drop-header">Select Dallas Metro Service Area</div>
                {DALLAS_LOCATIONS.map(loc => (
                  <button
                    key={loc}
                    className={`loc-drop-item ${loc === selectedLoc ? 'active' : ''}`}
                    onClick={() => { setSelectedLoc(loc); setLocOpen(false); }}
                  >
                    <HiLocationMarker style={{ width: 14, height: 14, color: loc === selectedLoc ? 'var(--primary)' : 'var(--text-muted)' }} />
                    <span>{loc}</span>
                    {loc === selectedLoc && <HiCheckCircle style={{ width: 14, height: 14, color: 'var(--primary)', marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Search Bar (Hidden on Mobile) */}
        <div className="nav-center desktop-only">
          {renderSearchForm()}
        </div>

        {/* Right Actions */}
        <div className="nav-right">
          <div className="notif-wrap" ref={notifRef}>
            <button className="icon-circle-btn" onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
              <HiBell className="nav-top-icon" />
              <span className="notif-badge" />
            </button>

            {notifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <strong>Notifications</strong>
                  <span className="notif-count">2 new</span>
                </div>
                <div className="notif-item">
                  <span className="notif-dot" />
                  <div>
                    <p><strong>Spring Promo: 15% OFF HVAC Tune-Up</strong></p>
                    <span>Book certified Dallas HVAC techs today</span>
                  </div>
                </div>
                {activeOrder && (
                  <div className="notif-item">
                    <span className="notif-dot active" />
                    <div>
                      <p><strong>Live Order #{activeOrder.id}</strong></p>
                      <span>Stage: {activeOrder.stages[activeOrder.stage]}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="cart-btn" onClick={() => navigate('/customer/cart')} aria-label="Cart">
            <HiShoppingCart className="cart-icon" />
            <span className="cart-label">Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <div className="user-menu" ref={dropRef}>
              <button className="avatar-btn" onClick={() => setDropOpen(o => !o)}>
                <span className="avatar-circle">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                <span className="avatar-name">{user?.name?.split(' ')[0] || user?.email || 'User'}</span>
                {dropOpen ? <HiChevronUp className="chevron-icon" /> : <HiChevronDown className="chevron-icon" />}
              </button>
              {dropOpen && (
                <div className="dropdown">
                  <div className="drop-header">
                    <strong>{user?.name || 'User'}</strong>
                    <span className={`role-tag ${user?.role}`}>{user?.role}</span>
                  </div>
                  <div className="drop-email">{user?.email}</div>
                  <hr />
                  {customer && (
                    <>
                      <Link to="/customer/profile" className="drop-item" onClick={() => setDropOpen(false)}>
                        <HiUser className="drop-icon" /> My Profile
                      </Link>
                      <Link to="/customer/orders" className="drop-item" onClick={() => setDropOpen(false)}>
                        <HiClipboardList className="drop-icon" /> My Bookings
                      </Link>
                    </>
                  )}
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="drop-item" onClick={() => setDropOpen(false)}>
                      <HiCog className="drop-icon" /> Admin Dashboard
                    </Link>
                  )}
                  {user?.role === 'worker' && (
                    <Link to="/worker" className="drop-item" onClick={() => setDropOpen(false)}>
                      <HiCog className="drop-icon" /> Pro Jobs
                    </Link>
                  )}
                  <button className="drop-item logout" onClick={handleLogout}>
                    <HiLogout className="drop-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/customer/signin" className="btn-ghost">Sign In</Link>
              <Link to="/customer/signup" className="btn-nav-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* ROW 2: Mobile Dedicated Search Row (Only visible on screens <= 768px) */}
      <div className="nav-mobile-search-row">
        {renderSearchForm()}
      </div>
    </nav>
  );
}
