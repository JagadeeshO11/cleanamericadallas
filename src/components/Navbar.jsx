import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import { HiChevronDown, HiChevronUp, HiClipboardList, HiCog, HiLogout, HiShoppingCart, HiLocationMarker, HiUser } from 'react-icons/hi';
import { MdEngineering } from 'react-icons/md';
import { GiCrane, GiPickelhaube } from 'react-icons/gi';
import { FaTractor, FaRoad, FaSpa, FaLeaf } from 'react-icons/fa';
import { TbTruckDelivery } from 'react-icons/tb';
import './Navbar.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png';
const CAT_NAV = [
  { id: 'excavation', label: 'Excavation', Icon: GiPickelhaube },
  { id: 'transport', label: 'Transport', Icon: TbTruckDelivery },
  { id: 'road', label: 'Road', Icon: FaRoad },
  { id: 'lifting', label: 'Lifting', Icon: GiCrane },
  { id: 'agricultural', label: 'Agricultural', Icon: FaTractor },
  { id: 'native', label: 'Native', Icon: FaLeaf },
  { id: 'beauty', label: 'Beauty', Icon: FaSpa },
  { id: 'other', label: 'Other', Icon: MdEngineering },
];

const SIGNIN_BY_ROLE = {
  customer: '/customer/signin',
  worker: '/worker/signin',
  admin: '/admin/signin',
};

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useStore(s => s.cart.length);
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const [loc, setLoc] = useState('');
  const dropRef = useRef();

  useEffect(() => {
    const handler = e => { if (!dropRef.current?.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    const role = user?.role || 'customer';
    logout();
    navigate(SIGNIN_BY_ROLE[role], { replace: true });
    setDropOpen(false);
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
        const data = await res.json();
        if (data.address) setLoc(data.address.suburb || data.address.city_district || data.address.city || 'Unknown');
      } catch { setLoc('Location unavailable'); }
    }, () => setLoc('Enable location'));
  }, []);

  const customer = user?.role === 'customer';

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" className="brand" aria-label="Clean America home"><img src={LOGO_URL} alt="Clean America" className="brand-logo-image" /></Link>
          <div className="location-row"><HiLocationMarker className="loc-icon" /><span className="location-text">{loc || 'Detecting...'}</span></div>
        </div>
        <div className="nav-right">
          {customer && <button className="cart-btn" onClick={() => navigate('/customer/cart')}><HiShoppingCart className="cart-icon" /><span className="cart-label">Cart</span>{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>}
          {user && (
            <div className="user-menu" ref={dropRef}>
              <button className="avatar-btn" onClick={() => setDropOpen(o => !o)}><span className="avatar-circle">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span><span className="avatar-name">{user?.name?.split(' ')[0] || user?.email || 'User'}</span>{dropOpen ? <HiChevronUp className="chevron-icon" /> : <HiChevronDown className="chevron-icon" />}</button>
              {dropOpen && <div className="dropdown">
                <div className="drop-header"><strong>{user?.name || 'User'}</strong><span className={`role-tag ${user?.role}`}>{user?.role}</span></div>
                <div className="drop-email">{user?.email}</div><hr />
                {customer && <><Link to="/customer/profile" className="drop-item" onClick={() => setDropOpen(false)}><HiUser className="drop-icon" /> My Profile</Link><Link to="/customer/orders" className="drop-item" onClick={() => setDropOpen(false)}><HiClipboardList className="drop-icon" /> My Orders</Link></>}
                {user?.role === 'admin' && <Link to="/admin" className="drop-item" onClick={() => setDropOpen(false)}><HiCog className="drop-icon" /> Admin Panel</Link>}
                {user?.role === 'worker' && <Link to="/worker" className="drop-item" onClick={() => setDropOpen(false)}><HiCog className="drop-icon" /> My Jobs</Link>}
                <button className="drop-item logout" onClick={handleLogout}><HiLogout className="drop-icon" /> Logout</button>
              </div>}
            </div>
          )}
        </div>
      </div>
      <div className="cat-nav-row">{CAT_NAV.map(({ id, label, Icon }) => <button key={id} className="cat-nav-item" onClick={() => navigate(`/browse?cat=${id}`)}><Icon className="cat-nav-icon" /><span>{label}</span></button>)}</div>
    </nav>
  );
}
