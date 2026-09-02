import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import {
  HiUser, HiPhone, HiMail, HiClipboardList, HiLogout, HiArrowRight,
  HiLocationMarker, HiShieldCheck, HiStar, HiCreditCard, HiSparkles,
  HiClock, HiCheckCircle, HiChevronRight, HiShoppingBag, HiCog,
  HiCalculator, HiDocumentReport, HiSupport, HiCalendar
} from 'react-icons/hi';
import './CustomerProfile.css';

export default function CustomerProfile() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const orders = useStore(s => s.orders);
  const quotes = useStore(s => s.quotes) || [];
  const invoices = useStore(s => s.invoices) || [];
  const complaints = useStore(s => s.complaints) || [];
  const activeOrder = useStore(s => s.activeOrder);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState('123 Elm Street, Dallas, TX 75201');

  const customerOrders = orders.filter(o => o.customer?.id === user?.id || !o.customer);
  const completedCount = customerOrders.filter(o => o.status === 'completed').length;
  const unpaidInvoices = invoices.filter(i => (i.customerId === user?.id || !user) && i.status === 'unpaid').length;
  const pendingQuotes = quotes.filter(q => (q.customerId === user?.id || !user) && q.status === 'quoted').length;

  const handleLogout = () => {
    logout();
    navigate('/customer/signin', { replace: true });
  };

  return (
    <div className="customer-profile-page">
      {/* PROFILE HERO HEADER */}
      <div className="profile-hero">
        <div className="profile-hero-main">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'C'}</div>
            <span className="profile-status-dot" title="Account Active" />
          </div>
          <div className="profile-hero-info">
            <div className="profile-badges">
              <span className="profile-eyebrow">
                <HiShieldCheck className="badge-icon" /> Verified Dallas Customer
              </span>
              <span className="profile-tier-badge">
                <HiSparkles className="badge-icon" /> VIP Gold Member
              </span>
            </div>
            <h1>{user?.name || 'Valued Customer'}</h1>
            <p className="profile-subtext">Dallas Metro Area • Member since 2026</p>
          </div>
        </div>

        <div className="profile-hero-actions">
          <button className="btn-hero-secondary" onClick={() => setEditing(e => !e)}>
            <HiCog className="btn-icon" /> {editing ? 'Done Editing' : 'Account Settings'}
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW ROW */}
      <div className="profile-stats-grid">
        <div className="p-stat-card" onClick={() => navigate('/customer/orders')} style={{ cursor: 'pointer' }}>
          <div className="p-stat-icon-wrap gold">
            <HiClipboardList className="p-stat-icon" />
          </div>
          <div className="p-stat-details">
            <strong>{customerOrders.length}</strong>
            <span>Total Bookings</span>
          </div>
        </div>

        <div className="p-stat-card" onClick={() => navigate('/customer/quotes')} style={{ cursor: 'pointer' }}>
          <div className="p-stat-icon-wrap blue">
            <HiCalculator className="p-stat-icon" />
          </div>
          <div className="p-stat-details">
            <strong>{quotes.length} {pendingQuotes > 0 ? `(${pendingQuotes} Ready)` : ''}</strong>
            <span>Service Quotes</span>
          </div>
        </div>

        <div className="p-stat-card" onClick={() => navigate('/customer/invoices')} style={{ cursor: 'pointer' }}>
          <div className="p-stat-icon-wrap green">
            <HiDocumentReport className="p-stat-icon" />
          </div>
          <div className="p-stat-details">
            <strong>{invoices.length} {unpaidInvoices > 0 ? `(${unpaidInvoices} Unpaid)` : ''}</strong>
            <span>Invoices</span>
          </div>
        </div>

        <div className="p-stat-card" onClick={() => navigate('/customer/support')} style={{ cursor: 'pointer' }}>
          <div className="p-stat-icon-wrap purple">
            <HiSupport className="p-stat-icon" />
          </div>
          <div className="p-stat-details">
            <strong>{complaints.length}</strong>
            <span>Support Tickets</span>
          </div>
        </div>
      </div>

      {/* ACTIVE ORDER SPOTLIGHT BANNER */}
      {activeOrder && (
        <div className="profile-active-order-banner">
          <div className="paob-left">
            <span className="paob-live-badge">
              <span className="live-dot" /> LIVE ORDER TRACKING
            </span>
            <h3>Order #{activeOrder.id} - {activeOrder.serviceName || 'Cleaning Service'}</h3>
            <p>Status: <strong>{activeOrder.stages?.[activeOrder.stage] || 'In Progress'}</strong></p>
          </div>
          <button className="paob-track-btn" onClick={() => navigate(`/customer/track/${activeOrder.id}`)}>
            <HiLocationMarker style={{ width: 16, height: 16 }} />
            <span>Track Live Pro</span>
            <HiChevronRight style={{ width: 14, height: 14 }} />
          </button>
        </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="profile-grid">
        {/* LEFT COLUMN: INFORMATION & ADDRESS */}
        <div className="profile-col-main">
          <section className="profile-card">
            <div className="profile-card-header">
              <h2>Personal Details</h2>
              <span className="pch-tag">Encrypted & Secure</span>
            </div>
            <div className="profile-row">
              <HiUser className="p-row-icon" />
              <div>
                <span>Full Name</span>
                <strong>{user?.name || 'Customer Name'}</strong>
              </div>
            </div>
            <div className="profile-row">
              <HiMail className="p-row-icon" />
              <div>
                <span>Email Address</span>
                <strong>{user?.email || 'customer@example.com'}</strong>
              </div>
            </div>
            <div className="profile-row">
              <HiPhone className="p-row-icon" />
              <div>
                <span>Phone Number</span>
                <strong>{user?.phone || '(214) 555-0199'}</strong>
              </div>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <h2>Default Service Address</h2>
              <button className="pch-link-btn" onClick={() => {
                const newAdd = prompt('Enter new Dallas service address:', address);
                if (newAdd) setAddress(newAdd);
              }}>Edit</button>
            </div>
            <div className="profile-row">
              <HiLocationMarker className="p-row-icon gold" />
              <div>
                <span>Primary Location</span>
                <strong>{address}</strong>
              </div>
            </div>
            <div className="address-meta-row">
              <span className="addr-badge">Dallas Metro Area</span>
              <span className="addr-badge">Gate Code: #4821</span>
            </div>
          </section>

          <section className="profile-card">
            <div className="profile-card-header">
              <h2>Payment Preferences</h2>
            </div>
            <div className="profile-row">
              <HiCreditCard className="p-row-icon green" />
              <div>
                <span>Primary Payment Method</span>
                <strong>Visa ending in 4242 (Default)</strong>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS */}
        <div className="profile-col-side">
          <section className="profile-card profile-actions-card">
            <h2>Customer Portal Services</h2>

            <button className="action-btn" onClick={() => navigate('/customer/upcoming')}>
              <HiCalendar className="ab-icon" style={{ color: '#ff6b00' }} />
              <div className="ab-text">
                <strong>Upcoming Services & Schedule</strong>
                <span>Manage future Dallas service appointments</span>
              </div>
              <HiArrowRight className="ab-arrow" />
            </button>

            <button className="action-btn" onClick={() => navigate('/customer/orders')}>
              <HiClipboardList className="ab-icon" />
              <div className="ab-text">
                <strong>All Bookings & History</strong>
                <span>View completed & active Dallas jobs</span>
              </div>
              <HiArrowRight className="ab-arrow" />
            </button>

            <button className="action-btn" onClick={() => navigate('/customer/quotes')}>
              <HiCalculator className="ab-icon" style={{ color: '#f59e0b' }} />
              <div className="ab-text">
                <strong>Quotations & Service Approvals</strong>
                <span>Request & approve custom cleaning quotes</span>
              </div>
              <HiArrowRight className="ab-arrow" />
            </button>

            <button className="action-btn" onClick={() => navigate('/customer/invoices')}>
              <HiDocumentReport className="ab-icon" style={{ color: '#10b981' }} />
              <div className="ab-text">
                <strong>Invoices & Payments</strong>
                <span>View itemized receipts & pay online</span>
              </div>
              <HiArrowRight className="ab-arrow" />
            </button>

            <button className="action-btn" onClick={() => navigate('/customer/support')}>
              <HiSupport className="ab-icon" style={{ color: '#8b5cf6' }} />
              <div className="ab-text">
                <strong>Service Requests & Complaints</strong>
                <span>Dallas 24/7 resolution support</span>
              </div>
              <HiArrowRight className="ab-arrow" />
            </button>

            <button className="action-btn" onClick={() => navigate('/browse')}>
              <HiShoppingBag className="ab-icon" />
              <div className="ab-text">
                <strong>Book New Dallas Service</strong>
                <span>Browse certified Dallas pros</span>
              </div>
              <HiArrowRight className="ab-arrow" />
            </button>

            <div className="profile-support-card">
              <HiShieldCheck className="psc-icon" />
              <div>
                <strong>Clean America Guarantee</strong>
                <p>100% Satisfaction or money back</p>
              </div>
            </div>

            <button className="profile-logout-btn" onClick={handleLogout}>
              <HiLogout className="logout-icon" />
              <span>Sign Out of Account</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}


