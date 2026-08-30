import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { HiHome, HiClipboardList, HiClock, HiCurrencyDollar, HiUser, HiBell } from 'react-icons/hi';
import './Worker.css';
import './WorkerTheme.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1788114865/0e7be675-4f29-45fc-9ef5-a9809350eaa9.png';

const NAV = [
  { to: '/worker', icon: HiHome, label: 'Home' },
  { to: '/worker/orders', icon: HiClipboardList, label: 'Orders' },
  { to: '/worker/history', icon: HiClock, label: 'History' },
  { to: '/worker/wallet', icon: HiCurrencyDollar, label: 'Wallet' },
  { to: '/worker/profile', icon: HiUser, label: 'Profile' },
];

export default function WorkerLayout() {
  const user = useAuthStore(s => s.user);
  const notifications = useStore(s => s.notifications) || [];
  const markAllNotificationsRead = useStore(s => s.markAllNotificationsRead);
  const clearNotifications = useStore(s => s.clearNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef();

  useEffect(() => {
    const handler = e => {
      if (!notifRef.current?.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
        <div className="wth-user-actions">
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
                    <span>Real-time updates on job dispatches & stage changes will appear here</span>
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

          <div className="wth-user">
            <div className="wth-avatar-wrap">
              <div className="wth-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'W'}</div>
              <span className={`wth-dot ${user?.available ? 'online' : 'offline'}`} title={user?.available ? 'Online' : 'Offline'} />
            </div>
            <div className="wth-info">
              <strong>{user?.name?.split(' ')[0] || 'Worker'}</strong>
              <span className={`wth-status ${user?.available ? 'online' : 'offline'}`}>
                {user?.available ? 'Online' : 'Offline'}
              </span>
            </div>
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
