import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useState, useRef, useEffect } from 'react';
import {
  HiHome, HiClipboardList, HiUsers, HiLogout, HiChevronDown,
  HiTag, HiChartBar, HiCreditCard
} from 'react-icons/hi';
import { MdEngineering } from 'react-icons/md';
import './Admin.css';
import './AdminTheme.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1788114865/0e7be675-4f29-45fc-9ef5-a9809350eaa9.png';

const NAV_ITEMS = [
  { to: '/admin', icon: HiHome, label: 'Dashboard', end: true },
  { to: '/admin/orders', icon: HiClipboardList, label: 'Bookings' },
  { to: '/admin/customers', icon: HiUsers, label: 'Customers' },
  { to: '/admin/workers', icon: MdEngineering, label: 'Dallas Pros' },
  { to: '/admin/products', icon: HiTag, label: 'Services & Rates' },
  { to: '/admin/reports', icon: HiChartBar, label: 'Analytics Reports' },
  { to: '/admin/payments', icon: HiCreditCard, label: 'Payouts & Revenue' },
];

export default function AdminLayout() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  const handleLogout = () => {
    logout();
    navigate('/admin/signin', { replace: true });
  };

  useEffect(() => {
    const handler = (e) => { if (!dropRef.current?.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="admin-layout-container">
      {/* DESKTOP LEFT SIDEBAR NAVIGATION */}
      <aside className="admin-sidebar">
        <div className="asb-brand">
          <Link to="/">
            <img src={LOGO_URL} alt="Clean America Dallas" className="asb-logo-img" />
          </Link>
          <span className="asb-badge">Admin Operations</span>
        </div>

        <nav className="asb-menu">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `asb-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="asb-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="asb-footer">
          <div className="asb-user-card">
            <div className="asb-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <div className="asb-user-info">
              <strong>{user?.name || 'Admin'}</strong>
              <span>{user?.email}</span>
            </div>
          </div>

          <button className="asb-logout-btn" onClick={handleLogout}>
            <HiLogout style={{ width: 16, height: 16 }} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="admin-main-wrapper">
        {/* MOBILE ONLY TOP HEADER */}
        <header className="admin-top-header mobile-only-header">
          <div className="ath-brand">
            <img src={LOGO_URL} alt="Clean America" className="ath-logo-image" style={{ width: 95, height: 32, objectFit: 'contain' }} />
            <span className="ath-badge">Admin</span>
          </div>

          <div className="ath-user" ref={dropRef}>
            <button className="ath-user-btn" onClick={() => setDropOpen(o => !o)}>
              <div className="ath-avatar">{user?.name?.charAt(0)}</div>
              <HiChevronDown className={`ath-chevron ${dropOpen ? 'open' : ''}`} />
            </button>
            {dropOpen && (
              <div className="ath-dropdown">
                <div className="ath-drop-header">
                  <div className="ath-drop-avatar">{user?.name?.charAt(0)}</div>
                  <div>
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                  </div>
                </div>
                <hr className="ath-drop-divider" />
                <button className="ath-drop-item logout" onClick={handleLogout}>
                  <HiLogout className="ath-drop-icon" /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>

        {/* MOBILE ONLY BOTTOM NAV */}
        <nav className="admin-bottom-nav mobile-only-nav">
          {NAV_ITEMS.slice(0, 5).map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `abn-item ${isActive ? 'active' : ''}`}>
              <Icon className="abn-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
