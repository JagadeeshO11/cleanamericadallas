import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import PaymentModal from '../components/PaymentModal';
import ComplaintModal from '../components/ComplaintModal';
import {
  HiCalendar, HiClock, HiLocationMarker, HiPhone, HiUser, HiStar,
  HiRefresh, HiChevronRight, HiCheckCircle, HiSparkles, HiCreditCard,
  HiSupport, HiX, HiPlus, HiTag
} from 'react-icons/hi';
import './UpcomingJobs.css';

export default function UpcomingJobs() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders) || [];
  const invoices = useStore(s => s.invoices) || [];
  const rescheduleOrder = useStore(s => s.rescheduleOrder);
  const cancelOrder = useStore(s => s.cancelOrder);
  const navigate = useNavigate();

  const [rescheduleOrderObj, setRescheduleOrderObj] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', time: '09:00 AM' });
  const [payInvoice, setPayInvoice] = useState(null);
  const [complaintOrderId, setComplaintOrderId] = useState(null);

  const myOrders = orders.filter(o => o.customer?.id === user?.id || !user);
  
  // Filter for upcoming jobs (scheduled or active, not completed or cancelled)
  const upcomingJobs = myOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

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
      setPayInvoice({
        id: `INV-${order.id.slice(-4)}`,
        orderId: order.id,
        serviceName: order.vehicle?.name || 'Dallas Cleaning Service',
        amount: order.booking?.total || 149,
        tax: 12.29,
        discount: 0,
        total: (order.booking?.total || 149) + 12.29,
        status: 'unpaid'
      });
    }
  };

  return (
    <div className="upcoming-jobs-page">
      {/* HEADER BANNER */}
      <div className="uj-header">
        <div>
          <div className="uj-eyebrow">
            <HiSparkles className="uje-icon" /> Dallas Scheduled Services
          </div>
          <h1>Upcoming Services & Appointments</h1>
          <p>Manage future cleaning & maintenance appointments, track assigned Dallas pros, view invoices, and reschedule dates.</p>
        </div>
        <button className="uj-new-btn" onClick={() => navigate('/browse')}>
          <HiPlus style={{ width: 16, height: 16 }} /> Book New Service
        </button>
      </div>

      {/* SERVICES GRID */}
      {upcomingJobs.length === 0 ? (
        <div className="uj-empty-card">
          <HiCalendar className="uj-empty-icon" />
          <h2>No Upcoming Services Scheduled</h2>
          <p>You have no scheduled Dallas home cleaning or service appointments right now.</p>
          <button className="btn-primary-gold" onClick={() => navigate('/browse')}>
            Browse & Book Service
          </button>
        </div>
      ) : (
        <div className="uj-grid">
          {upcomingJobs.map(job => {
            const isAssigned = job.status === 'assigned' || job.status === 'active';
            const linkedInvoice = invoices.find(i => i.orderId === job.id);
            const isInvoicePaid = linkedInvoice?.status === 'paid';

            return (
              <div key={job.id} className="uj-job-card">
                <div className="ujc-header">
                  <div className="ujc-title-group">
                    <span className="ujc-id">Job #{job.id}</span>
                    <h3>{job.vehicle?.name}</h3>
                  </div>
                  <span className={`status-chip ${job.status}`}>
                    {isAssigned ? '🔴 Pro En Route' : '📅 Scheduled'}
                  </span>
                </div>

                <div className="ujc-body">
                  <div className="ujc-media-row">
                    <img
                      src={job.vehicle?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80'}
                      alt={job.vehicle?.name}
                      className="ujc-img"
                    />
                    <div className="ujc-details">
                      <div className="ujc-row">
                        <HiLocationMarker className="ujc-icon gold" />
                        <span>Address: <strong>{job.booking?.location || 'Dallas, TX'}</strong></span>
                      </div>
                      <div className="ujc-row">
                        <HiCalendar className="ujc-icon blue" />
                        <span>Scheduled Date: <strong>{job.scheduledDate || job.booking?.date || 'Upcoming'}</strong></span>
                      </div>
                      <div className="ujc-row">
                        <HiClock className="ujc-icon green" />
                        <span>Time Window: <strong>{job.scheduledTime || job.booking?.time || '09:00 AM'}</strong></span>
                      </div>
                      <div className="ujc-row">
                        <HiTag className="ujc-icon purple" />
                        <span>Service Total: <strong>${job.booking?.total?.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* PRO ASSIGNED BOX */}
                  {job.operator ? (
                    <div className="ujc-pro-box">
                      <div className="upb-left">
                        <div className="upb-avatar">{job.operator.name?.charAt(0) || 'P'}</div>
                        <div>
                          <strong>{job.operator.name}</strong>
                          <span>Dallas Certified Pro • ⭐ {job.operator.rating || '4.9'}</span>
                        </div>
                      </div>
                      {job.operator.phone && (
                        <a href={`tel:${job.operator.phone}`} className="upb-call-btn">
                          <HiPhone /> Call Pro
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="ujc-dispatch-box">
                      <span>⏱️ Dispatch Status:</span>
                      <strong>Matching Certified Dallas Pro for your shift window...</strong>
                    </div>
                  )}
                </div>

                {/* ACTIONS FOOTER */}
                <div className="ujc-footer">
                  <div className="ujc-actions-wrap">
                    <button className="btn-uj-outline" onClick={() => handleOpenReschedule(job)}>
                      <HiRefresh /> Reschedule
                    </button>

                    <button className="btn-uj-outline" onClick={() => handlePayInvoiceForOrder(job)}>
                      <HiCreditCard /> {isInvoicePaid ? 'View Invoice' : 'Pay Invoice'}
                    </button>

                    <button className="btn-uj-outline" onClick={() => setComplaintOrderId(job.id)}>
                      <HiSupport /> Support
                    </button>

                    {job.status === 'active' && (
                      <button className="btn-uj-track" onClick={() => navigate(`/customer/track/${job.id}`)}>
                        Track Live Pro <HiChevronRight />
                      </button>
                    )}

                    <button className="btn-uj-cancel" onClick={() => cancelOrder(job.id)}>
                      Cancel
                    </button>
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
                  <p>Job #{rescheduleOrderObj.id} • {rescheduleOrderObj.vehicle?.name}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setRescheduleOrderObj(null)}>
                <HiX />
              </button>
            </div>

            <div className="modal-body-form">
              <div className="form-group">
                <label>Select New Date</label>
                <input
                  type="date"
                  value={rescheduleForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select New Arrival Time Window</label>
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

      {/* REUSABLE MODALS */}
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
