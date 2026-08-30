import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { HiHome, HiClipboardList, HiClock, HiCurrencyDollar, HiUser } from 'react-icons/hi';
import './Worker.css';
import './WorkerTheme.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png';

const NAV = [
  { to: '/worker', icon: HiHome, label: 'Home' },
  { to: '/worker/orders', icon: HiClipboardList, label: 'Orders' },
  { to: '/worker/history', icon: HiClock, label: 'History' },
  { to: '/worker/wallet', icon: HiCurrencyDollar, label: 'Wallet' },
  { to: '/worker/profile', icon: HiUser, label: 'Profile' },
];

export default function WorkerLayout() {
  const user = useAuthStore(s => s.user);
  if (!user) return null;

  return (
    <div className="worker-layout">
      <header className="worker-top-header">
        <div className="wth-brand">
          <img src={LOGO_URL} alt="Clean America Dallas" className="wth-logo-img" />
          <span className="wth-badge">Dallas Pro</span>
        </div>
        <nav className="worker-top-nav">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/worker'} className={({ isActive }) => `wtn-item ${isActive ? 'active' : ''}`}>
              <Icon className="wtn-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="wth-user">
          <div className="wth-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'W'}</div>
          <div className="wth-info">
            <strong>{user?.name?.split(' ')[0] || 'Worker'}</strong>
            <span className={`wth-status ${user?.available ? 'online' : 'offline'}`}>
              {user?.available ? '● Online' : '○ Offline'}
            </span>
          </div>
        </div>
      </header>
      <div className="worker-content"><Outlet /></div>
      <nav className="worker-bottom-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/worker'} className={({ isActive }) => `wbn-item ${isActive ? 'active' : ''}`}>
            <Icon className="wbn-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
