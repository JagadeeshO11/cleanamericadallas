import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import {
  HiHome, HiTruck, HiClipboardList, HiUser,
  HiChartBar, HiCollection, HiUsers, HiSearch,
  HiCog, HiLocationMarker, HiCalculator, HiCalendar,
} from 'react-icons/hi';
import './BottomNav.css';

const customerTabs = [
  { to: '/',                  Icon: HiHome,          label: 'Home' },
  { to: '/customer/upcoming', Icon: HiCalendar,      label: 'Upcoming' },
  { to: '/customer/orders',   Icon: HiClipboardList, label: 'Bookings' },
  { to: '/customer/quotes',   Icon: HiCalculator,    label: 'Quotes' },
  { to: '/customer/profile',  Icon: HiUser,          label: 'Account' },
];

const adminTabs = [
  { to: '/admin',         Icon: HiChartBar,   label: 'Dashboard' },
  { to: '/admin/orders',  Icon: HiCollection, label: 'Orders' },
  { to: '/admin/workers', Icon: HiUsers,      label: 'Workers' },
  { to: '/admin/customers', Icon: HiUsers,    label: 'Customers' },
];

const workerTabs = [
  { to: '/worker',         Icon: HiCog,          label: 'My Jobs' },
  { to: '/worker/orders',  Icon: HiClipboardList, label: 'Orders' },
  { to: '/worker/schedule', Icon: HiLocationMarker, label: 'Schedule' },
  { to: '/worker/history', Icon: HiCollection,   label: 'History' },
  { to: '/worker/profile', Icon: HiUser,         label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const user = useAuthStore(s => s.user);
  const activeOrder = useStore(s => s.activeOrder);

  const isActive = path =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname === path || location.pathname.startsWith(path + '/');

  let tabs = customerTabs;
  if (user?.role === 'admin') tabs = adminTabs;
  else if (user?.role === 'worker') tabs = workerTabs;

  return (
    <nav className="bottom-nav">
      {tabs.map(({ to, Icon, label }) => (
        <Link key={to} to={to} className={`bn-tab ${isActive(to) ? 'active' : ''}`}>
          <Icon className="bn-icon" />
          <span className="bn-label">{label}</span>
          {isActive(to) && <span className="bn-dot" />}
        </Link>
      ))}

      {activeOrder && user?.role === 'customer' && (
        <Link
          to={`/customer/track/${activeOrder.id}`}
          className={`bn-tab live ${isActive(`/customer/track/${activeOrder.id}`) ? 'active' : ''}`}
        >
          <HiLocationMarker className="bn-icon" />
          <span className="bn-label">Live</span>
          <span className="live-ring" />
        </Link>
      )}
    </nav>
  );
}
