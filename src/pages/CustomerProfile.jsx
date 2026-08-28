import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import { HiUser, HiPhone, HiMail, HiClipboardList, HiLogout, HiArrowRight } from 'react-icons/hi';
import './CustomerProfile.css';

export default function CustomerProfile() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const orders = useStore(s => s.orders);
  const navigate = useNavigate();
  const customerOrders = orders.filter(o => o.customer?.id === user?.id);

  const handleLogout = () => {
    logout();
    navigate('/signin', { replace: true });
  };

  return (
    <div className="customer-profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
        <div>
          <span className="profile-eyebrow">Customer account</span>
          <h1>{user?.name || 'Customer'}</h1>
          <p>Manage your account and bookings</p>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <h2>Personal information</h2>
          <div className="profile-row"><HiUser /><div><span>Name</span><strong>{user?.name || 'Not provided'}</strong></div></div>
          <div className="profile-row"><HiMail /><div><span>Email</span><strong>{user?.email || 'Not provided'}</strong></div></div>
          <div className="profile-row"><HiPhone /><div><span>Phone</span><strong>{user?.phone || 'Not provided'}</strong></div></div>
        </section>

        <section className="profile-card profile-actions-card">
          <h2>Quick actions</h2>
          <button onClick={() => navigate('/orders')}><HiClipboardList /> My Orders <HiArrowRight /></button>
          <button onClick={() => navigate('/browse')}>Browse Services <HiArrowRight /></button>
          <button className="profile-logout" onClick={handleLogout}><HiLogout /> Sign out</button>
          <div className="profile-stat"><strong>{customerOrders.length}</strong><span>Bookings</span></div>
        </section>
      </div>
    </div>
  );
}
