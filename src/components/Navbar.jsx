import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import {
  HiChevronDown, HiChevronUp, HiClipboardList, HiCog,
  HiLogout, HiShoppingCart, HiLocationMarker, HiUser, HiBell, HiCheckCircle, HiSearch, HiX,
  HiHome, HiTruck, HiChartBar, HiUsers, HiClock, HiCurrencyDollar, HiTag, HiOutlineLocationMarker, HiTrash, HiArrowRight,
} from 'react-icons/hi';
import { MdEngineering } from 'react-icons/md';
import './Navbar.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1788115820/67d7f845-394b-4216-80b8-2a2548de8cab.png';

// ONLY 3 Dallas area suggestions as requested
const DALLAS_SUGGESTIONS = [
  'Dallas, TX',
  'Plano, TX',
  'Frisco, TX',
];

const SIGNIN_BY_ROLE = {
  customer: '/customer/signin',
  worker: '/worker/signin',
  admin: '/admin/signin',
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cart = useStore(s => s.cart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const cartCount = cart.length;
  const activeOrder = useStore(s => s.activeOrder);

  const notifications = useStore(s => s.notifications) || [];
  const markAllNotificationsRead = useStore(s => s.markAllNotificationsRead);
  const clearNotifications = useStore(s => s.clearNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const navigate = useNavigate();
  const location = useLocation();

  const [dropOpen, setDropOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [cartPreviewOpen, setCartPreviewOpen] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState('Dallas, TX');
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropRef = useRef();
  const locRef = useRef();
  const notifRef = useRef();
  const cartRef = useRef();

  useEffect(() => {
    const handler = e => {
      if (!dropRef.current?.contains(e.target)) setDropOpen(false);
      if (!locRef.current?.contains(e.target)) setLocOpen(false);
      if (!notifRef.current?.contains(e.target)) setNotifOpen(false);
      if (!cartRef.current?.contains(e.target)) setCartPreviewOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleAutoDetect = () => {
    setIsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => {
            setSelectedLoc('Dallas, TX (Auto-Detected)');
            setIsDetecting(false);
            setLocOpen(false);
          }, 500);
        },
        () => {
          setTimeout(() => {
            setSelectedLoc('Dallas, TX (Detected)');
            setIsDetecting(false);
            setLocOpen(false);
          }, 500);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setSelectedLoc('Dallas, TX (Auto-Detected)');
        setIsDetecting(false);
        setLocOpen(false);
      }, 500);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (Number(item.vehicle?.rate) || 0), 0);

  const isActive = path =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

  const getDesktopNavTabs = () => {
    if (user?.role === 'admin') {
      return [
        { to: '/', Icon: HiHome, label: 'Customer Site' },
        { to: '/admin', Icon: HiChartBar, label: 'Dashboard' },
        { to: '/admin/orders', Icon: HiClipboardList, label: 'Bookings' },
        { to: '/admin/workers', Icon: MdEngineering, label: 'Dallas Pros' },
        { to: '/admin/customers', Icon: HiUsers, label: 'Customers' },
        { to: '/admin/products', Icon: HiTag, label: 'Services & Rates' },
      ];
    }
    if (user?.role === 'worker') {
      return [
        { to: '/', Icon: HiHome, label: 'Customer Site' },
        { to: '/worker', Icon: HiCog, label: 'Pro Dashboard' },
        { to: '/worker/orders', Icon: HiClipboardList, label: 'Jobs & Orders' },
        { to: '/worker/history', Icon: HiClock, label: 'History' },
        { to: '/worker/wallet', Icon: HiCurrencyDollar, label: 'Wallet' },
      ];
    }
    return [
      { to: '/', Icon: HiHome, label: 'Home' },
      { to: '/browse', Icon: HiTruck, label: 'Book Services' },
      { to: user ? '/customer/orders' : '/customer/signin', Icon: HiClipboardList, label: 'My Bookings' },
    ];
  };

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
        <HiSearch style={{ width: 15, height: 15 }} />
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
                {/* Auto Detect Action */}
                <button
                  className="loc-auto-detect-btn"
                  onClick={handleAutoDetect}
                  disabled={isDetecting}
                >
                  <span className="loc-autodetect-icon">{isDetecting ? '⏳' : '🎯'}</span>
                  <div className="loc-autodetect-text">
                    <strong>{isDetecting ? 'Detecting Location...' : 'Auto-Detect My Location'}</strong>
                    <span>GPS / Dallas Metro Area</span>
                  </div>
                </button>

                <div className="loc-drop-header">Dallas Metro Area (Top 3)</div>
                {DALLAS_SUGGESTIONS.map(loc => (
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

        {/* Desktop Search Bar (Integrated in Main Row) */}
        <div className="nav-center desktop-only">
          {renderSearchForm()}
        </div>

        {/* Desktop Top Nav Links (Visible on Desktop & Tablet) */}
        <div className="nav-desktop-links desktop-only">
          {getDesktopNavTabs().map(({ to, Icon, label }) => (
            <Link key={to} to={to} className={`nav-desktop-link ${isActive(to) ? 'active' : ''}`}>
              <Icon className="ndl-icon" />
              <span>{label}</span>
            </Link>
          ))}
          {activeOrder && user?.role === 'customer' && (
            <Link
              to={`/customer/track/${activeOrder.id}`}
              className={`nav-desktop-link live ${isActive(`/customer/track/${activeOrder.id}`) ? 'active' : ''}`}
            >
              <HiLocationMarker className="ndl-icon" />
              <span>Live Track</span>
              <span className="nav-live-pulse" />
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="nav-right">
          <div className="notif-wrap" ref={notifRef}>
          <button
            className="icon-circle-btn"
            onClick={() => {
              setNotifOpen(o => !o);
              if (!notifOpen && unreadCount > 0) markAllNotificationsRead();
            }}
            aria-label="Notifications"
          >
            <HiBell className="nav-top-icon" />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <div className="notif-header-title">
                  <strong>Notification Events</strong>
                  {unreadCount > 0 && <span className="notif-count">{unreadCount} new</span>}
                </div>
                <div className="notif-hdr-actions">
                  {unreadCount > 0 && (
                    <button className="notif-hdr-btn" onClick={markAllNotificationsRead}>
                      Mark Read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button className="notif-hdr-btn clear" onClick={clearNotifications}>
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="notif-empty">
                  <HiBell style={{ width: 28, height: 28, color: 'var(--text-muted)', marginBottom: 6 }} />
                  <p>No notification events yet</p>
                  <span>Real-time updates on bookings, pro assignments & promos will appear here</span>
                </div>
              ) : (
                <div className="notif-list">
                  {notifications.map(n => (
                    <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                      <span className={`notif-dot ${!n.read ? 'active' : ''}`} />
                      <div className="notif-content">
                        <p><strong>{n.title}</strong></p>
                        <span>{n.body}</span>
                        <div className="notif-time">{n.time || 'Just now'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

          {/* Interactive Cart Button with Hover / Click Preview Drawer */}
          <div className="cart-menu-wrap" ref={cartRef}>
            <button
              className={`cart-btn ${cartCount > 0 ? 'has-items' : ''}`}
              onClick={() => setCartPreviewOpen(o => !o)}
              onMouseEnter={() => setCartPreviewOpen(true)}
              aria-label="Cart Preview"
            >
              <HiShoppingCart className="cart-icon" />
              <span className="cart-label">Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {cartPreviewOpen && (
              <div className="cart-preview-dropdown" onMouseLeave={() => setCartPreviewOpen(false)}>
                <div className="cpd-header">
                  <div>
                    <strong>Your Service Cart</strong>
                    <span className="cpd-count-tag">{cartCount} item{cartCount !== 1 ? 's' : ''}</span>
                  </div>
                  <button className="cpd-close" onClick={() => setCartPreviewOpen(false)}>
                    <HiX style={{ width: 14, height: 14 }} />
                  </button>
                </div>

                {cartCount === 0 ? (
                  <div className="cpd-empty">
                    <HiShoppingCart style={{ width: 32, height: 32, color: 'var(--text-muted)', marginBottom: 8 }} />
                    <p>Your cart is empty</p>
                    <span>Add trusted Dallas home services to get started</span>
                    <button className="cpd-browse-btn" onClick={() => { setCartPreviewOpen(false); navigate('/browse'); }}>
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cpd-items-list">
                      {cart.map((item) => (
                        <div key={item.cartId} className="cpd-item">
                          <img
                            src={item.vehicle?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&q=80'}
                            alt={item.vehicle?.name}
                            className="cpd-item-img"
                          />
                          <div className="cpd-item-info">
                            <strong>{item.vehicle?.name || 'Dallas Service'}</strong>
                            <span>{item.booking?.date || 'Scheduled Service'}</span>
                            <div className="cpd-item-price">${item.vehicle?.rate || 0}</div>
                          </div>
                          <button
                            className="cpd-item-remove"
                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.cartId); }}
                            title="Remove item"
                          >
                            <HiTrash style={{ width: 14, height: 14 }} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="cpd-footer">
                      <div className="cpd-total-row">
                        <span>Total Estimate:</span>
                        <strong>${cartTotal.toFixed(2)}</strong>
                      </div>
                      <div className="cpd-actions">
                        <button
                          className="cpd-view-cart-btn"
                          onClick={() => { setCartPreviewOpen(false); navigate('/customer/cart'); }}
                        >
                          View Cart
                        </button>
                        <button
                          className="cpd-checkout-btn"
                          onClick={() => { setCartPreviewOpen(false); navigate('/customer/cart'); }}
                        >
                          Checkout <HiArrowRight style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {user ? (
            <button
              type="button"
              className="avatar-btn desktop-only"
              onClick={() => {
                if (user?.role === 'admin') navigate('/admin');
                else if (user?.role === 'worker') navigate('/worker');
                else navigate('/customer/profile');
              }}
              title={`Logged in as ${user.name || user.email} - View Profile`}
              aria-label="View Profile"
            >
              <span className="avatar-circle">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
            </button>
          ) : (
            <div className="auth-btns">
              <Link to="/customer/signin" className="btn-ghost">Sign In</Link>
              <Link to="/customer/signup" className="btn-nav-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Dedicated Search Row (Only visible on screens <= 768px) */}
      <div className="nav-mobile-search-row">
        {renderSearchForm()}
      </div>
    </nav>
  );
}
