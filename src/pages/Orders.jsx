import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  HiClipboardList, HiSearch, HiLocationMarker, HiCalendar, HiClock,
  HiChevronRight, HiCheckCircle, HiPhone, HiSparkles, HiUser, HiRefresh
} from 'react-icons/hi';
import './Orders.css';

export default function Orders() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  const customerOrders = orders.filter(order => order.customer?.id === user?.id || !user);

  const filteredOrders = customerOrders.filter(order => {
    const isComplete = order.stage === order.stages.length - 1;
    if (activeTab === 'active' && isComplete) return false;
    if (activeTab === 'completed' && !isComplete) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = order.vehicle?.name?.toLowerCase().includes(q);
      const matchLoc = order.booking?.location?.toLowerCase().includes(q);
      const matchId = order.id?.toLowerCase().includes(q);
      return matchName || matchLoc || matchId;
    }
    return true;
  });

  const activeCount = customerOrders.filter(o => o.stage < o.stages.length - 1).length;
  const completedCount = customerOrders.filter(o => o.stage === o.stages.length - 1).length;

  return (
    <div className="orders-page">
      {/* Header Banner */}
      <div className="orders-header">
        <div>
          <h1>My Service Bookings</h1>
          <p className="orders-sub">Track active appointments and view service receipts across Dallas Metro</p>
        </div>
        <button className="new-booking-btn" onClick={() => navigate('/browse')}>
          <HiSparkles style={{ width: 16, height: 16 }} /> Book New Service
        </button>
      </div>

      {/* Control Bar: Tabs & Search Input */}
      <div className="orders-controls">
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Bookings ({customerOrders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active In-Progress ({activeCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="orders-search-box">
          <HiSearch className="osb-icon" />
          <input
            type="text"
            placeholder="Search by service or address..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="orders-empty-card">
          <div className="oec-icon-wrap">
            <HiClipboardList className="oec-icon" />
          </div>
          <h2>No Service Bookings Found</h2>
          <p>
            {searchQuery
              ? `No bookings matching "${searchQuery}". Try clearing your search.`
              : 'You have no active or previous home service bookings yet.'}
          </p>
          <button className="btn-primary" onClick={() => navigate('/browse')}>
            Browse Dallas Home Services
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => {
            const isComplete = order.stage === order.stages.length - 1;
            const progressPercent = Math.round(((order.stage + 1) / order.stages.length) * 100);

            return (
              <div key={order.id} className="order-card">
                {/* Card Header */}
                <div className="oc-header">
                  <div className="oc-id-wrap">
                    <span className="oc-id">Booking #{order.id}</span>
                    <span className="oc-time">Placed {order.placedAt || 'Recently'}</span>
                  </div>
                  <div className={`oc-status-badge ${isComplete ? 'complete' : 'active'}`}>
                    {isComplete ? (
                      <>
                        <HiCheckCircle style={{ width: 14, height: 14 }} /> Completed
                      </>
                    ) : (
                      <>
                        <span className="live-dot" /> Live Tracking
                      </>
                    )}
                  </div>
                </div>

                {/* Main Body */}
                <div className="oc-body">
                  <img
                    src={order.vehicle?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'}
                    alt={order.vehicle?.name}
                    className="oc-img"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'; }}
                  />

                  <div className="oc-details">
                    <div className="oc-title-row">
                      <h3>{order.vehicle?.name}</h3>
                      <div className="oc-price">${order.booking?.total?.toFixed(2)}</div>
                    </div>

                    <div className="oc-info-rows">
                      <div className="oc-info-item">
                        <HiLocationMarker className="oii-icon" />
                        <span>{order.booking?.location || 'Dallas Metro, TX'}</span>
                      </div>
                      <div className="oc-info-item">
                        <HiCalendar className="oii-icon" />
                        <span>{order.booking?.date || 'Scheduled Service'}</span>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="oc-progress-box">
                      <div className="opb-header">
                        <span className="opb-stage-name">
                          {isComplete ? 'Service Completed & Verified' : order.stages[order.stage]}
                        </span>
                        <span className="opb-percent">{progressPercent}%</span>
                      </div>
                      <div className="opb-bar-track">
                        <div className="opb-bar-fill" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>

                    {/* Assigned Pro Box */}
                    {order.operator && (
                      <div className="oc-pro-box">
                        <div className="opb-left">
                          <div className="opb-avatar">{order.operator.name?.charAt(0) || 'P'}</div>
                          <div>
                            <strong>{order.operator.name}</strong>
                            <span className="opb-sub">Dallas Certified Pro • ⭐ {order.operator.rating || '4.9'}</span>
                          </div>
                        </div>
                        {order.operator.phone && (
                          <a href={`tel:${order.operator.phone}`} className="opb-phone-btn" title="Call assigned pro">
                            <HiPhone style={{ width: 14, height: 14 }} /> Call
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="oc-footer">
                  <div className="ocf-left">
                    <span className="pay-tag">{order.booking?.paymentMethod || 'Paid Online'}</span>
                  </div>
                  <button className="btn-track-order" onClick={() => navigate(`/customer/track/${order.id}`)}>
                    Track Live Appointment <HiChevronRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
