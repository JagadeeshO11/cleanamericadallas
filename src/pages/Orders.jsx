import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import ReviewModal from '../components/ReviewModal';
import PaymentModal from '../components/PaymentModal';
import ComplaintModal from '../components/ComplaintModal';
import {
  HiClipboardList, HiSearch, HiLocationMarker, HiCalendar, HiClock,
  HiChevronRight, HiCheckCircle, HiPhone, HiSparkles, HiUser, HiRefresh,
  HiStar, HiCreditCard, HiSupport, HiX
} from 'react-icons/hi';
import './Orders.css';

export default function Orders() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);
  const invoices = useStore(s => s.invoices);
  const rescheduleOrder = useStore(s => s.rescheduleOrder);
  const cancelOrder = useStore(s => s.cancelOrder);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'upcoming' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [reviewOrder, setReviewOrder] = useState(null);
  const [payInvoice, setPayInvoice] = useState(null);
  const [complaintOrderId, setComplaintOrderId] = useState(null);
  const [rescheduleOrderObj, setRescheduleOrderObj] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '09:00 AM' });

  const customerOrders = orders.filter(order => order.customer?.id === user?.id || !user);

  const filteredOrders = customerOrders.filter(order => {
    const isComplete = order.stage === order.stages.length - 1;
    const isUpcoming = order.stage === 0 && order.status !== 'cancelled';

    if (activeTab === 'upcoming' && !isUpcoming) return false;
    if (activeTab === 'active' && (isComplete || isUpcoming)) return false;
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

  const upcomingCount = customerOrders.filter(o => o.stage === 0 && o.status !== 'cancelled').length;
  const activeCount = customerOrders.filter(o => o.stage > 0 && o.stage < o.stages.length - 1).length;
  const completedCount = customerOrders.filter(o => o.stage === o.stages.length - 1).length;

  const handleOpenReschedule = (order) => {
    setRescheduleOrderObj(order);
    setRescheduleForm({
      date: order.scheduledDate || order.booking?.date || new Date().toISOString().split('T')[0],
      time: order.scheduledTime || order.booking?.time || '09:00 AM',
    });
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleOrderObj) return;
    rescheduleOrder(rescheduleOrderObj.id, rescheduleForm.date, rescheduleForm.time);
    setRescheduleOrderObj(null);
  };

  const handlePayInvoiceForOrder = (order) => {
    const inv = invoices.find(i => i.orderId === order.id);
    if (inv) {
      setPayInvoice(inv);
    } else {
      // Create fallback invoice structure
      setPayInvoice({
        id: `INV-${order.id.slice(-4)}`,
        orderId: order.id,
        serviceName: order.vehicle?.name || 'Cleaning Service',
        amount: order.booking?.total || 150,
        tax: 12.38,
        discount: 0,
        total: (order.booking?.total || 150) + 12.38,
        status: 'unpaid'
      });
    }
  };

  return (
    <div className="orders-page">
      {/* Header Banner */}
      <div className="orders-header">
        <div>
          <h1>My Service Bookings & Jobs</h1>
          <p className="orders-sub">Track upcoming appointments, manage schedules, view invoices, and leave pro reviews.</p>
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
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming Scheduled ({upcomingCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            🚚 In-Progress Live ({activeCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            ✅ Completed ({completedCount})
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
              : 'You have no active, upcoming, or completed home service bookings yet.'}
          </p>
          <button className="btn-primary" onClick={() => navigate('/browse')}>
            Browse Dallas Home Services
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => {
            const isComplete = order.stage === order.stages.length - 1;
            const isUpcoming = order.stage === 0 && order.status !== 'cancelled';
            const progressPercent = Math.round(((order.stage + 1) / order.stages.length) * 100);
            const linkedInvoice = invoices.find(i => i.orderId === order.id);
            const isInvoicePaid = linkedInvoice?.status === 'paid';

            return (
              <div key={order.id} className="order-card">
                {/* Card Header */}
                <div className="oc-header">
                  <div className="oc-id-wrap">
                    <span className="oc-id">Booking #{order.id}</span>
                    <span className="oc-time">Placed {order.placedAt || 'Recently'}</span>
                  </div>
                  <div className={`oc-status-badge ${isComplete ? 'complete' : isUpcoming ? 'upcoming' : 'active'}`}>
                    {isComplete ? (
                      <>
                        <HiCheckCircle style={{ width: 14, height: 14 }} /> Completed
                      </>
                    ) : isUpcoming ? (
                      <>
                        <HiCalendar style={{ width: 14, height: 14 }} /> Scheduled Upcoming
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
                        <span>Date: <strong>{order.scheduledDate || order.booking?.date || 'Scheduled Service'}</strong></span>
                      </div>
                      <div className="oc-info-item">
                        <HiClock className="oii-icon" />
                        <span>Time Window: <strong>{order.scheduledTime || order.booking?.time || '09:00 AM'}</strong></span>
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
                    <span className={`pay-tag ${isInvoicePaid ? 'paid' : ''}`}>
                      {isInvoicePaid ? 'Paid' : (order.booking?.paymentMethod || 'Invoice Pending')}
                    </span>
                  </div>

                  <div className="oc-action-buttons" style={{ flexWrap: 'wrap', gap: 6 }}>
                    {/* INDIVIDUAL CHECKOUT ORDER INVOICE & SUPPORT BUTTONS */}
                    <button className="btn-action-outline" onClick={() => handlePayInvoiceForOrder(order)}>
                      <HiCreditCard /> {isInvoicePaid ? 'View Invoice' : 'Pay Invoice'}
                    </button>

                    <button className="btn-action-outline" onClick={() => setComplaintOrderId(order.id)}>
                      <HiSupport /> Support
                    </button>

                    {/* UPCOMING ACTIONS */}
                    {isUpcoming && (
                      <>
                        <button className="btn-action-outline" onClick={() => handleOpenReschedule(order)}>
                          <HiRefresh /> Reschedule
                        </button>
                        <button className="btn-action-cancel" onClick={() => cancelOrder(order.id)}>
                          Cancel
                        </button>
                      </>
                    )}

                    {/* IN-PROGRESS ACTION */}
                    {!isComplete && !isUpcoming && (
                      <button className="btn-track-order" onClick={() => navigate(`/customer/track/${order.id}`)}>
                        Track Live Pro <HiChevronRight style={{ width: 16, height: 16 }} />
                      </button>
                    )}

                    {/* COMPLETED ACTIONS */}
                    {isComplete && (
                      <button className="btn-action-gold" onClick={() => setReviewOrder(order)}>
                        <HiStar /> Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleOrderObj && (
        <div className="modal-overlay" onClick={() => setRescheduleOrderObj(null)}>
          <div className="modal-card reschedule-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiRefresh className="mh-icon gold" />
                <div>
                  <h3>Reschedule Appointment</h3>
                  <p>Booking #{rescheduleOrderObj.id} • {rescheduleOrderObj.vehicle?.name}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setRescheduleOrderObj(null)}>
                <HiX />
              </button>
            </div>

            <div className="modal-body-form">
              <div className="form-group">
                <label>New Service Date</label>
                <input
                  type="date"
                  value={rescheduleForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Arrival Time Window</label>
                <select
                  value={rescheduleForm.time}
                  onChange={e => setRescheduleForm({ ...rescheduleForm, time: e.target.value })}
                >
                  <option value="08:00 AM">Morning (08:00 AM - 10:00 AM)</option>
                  <option value="10:00 AM">Late Morning (10:00 AM - 12:00 PM)</option>
                  <option value="01:00 PM">Afternoon (01:00 PM - 03:00 PM)</option>
                  <option value="04:00 PM">Late Afternoon (04:00 PM - 06:00 PM)</option>
                </select>
              </div>

              <div className="modal-footer-actions">
                <button className="btn-modal-cancel" onClick={() => setRescheduleOrderObj(null)}>
                  Cancel
                </button>
                <button className="btn-modal-submit gold" onClick={handleConfirmReschedule}>
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE MODALS INTEGRATED */}
      <ReviewModal
        isOpen={!!reviewOrder}
        order={reviewOrder}
        onClose={() => setReviewOrder(null)}
      />

      <PaymentModal
        isOpen={!!payInvoice}
        invoice={payInvoice}
        onClose={() => setPayInvoice(null)}
      />

      <ComplaintModal
        isOpen={!!complaintOrderId}
        initialOrderId={complaintOrderId}
        onClose={() => setComplaintOrderId(null)}
      />
    </div>
  );
}

