import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  HiX, HiExclamationCircle, HiCheckCircle, HiSupport, HiShieldExclamation
} from 'react-icons/hi';
import './ComplaintModal.css';

export default function ComplaintModal({ isOpen, initialOrderId, onClose, onSuccess }) {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);
  const submitComplaint = useStore(s => s.submitComplaint);

  const [orderId, setOrderId] = useState(initialOrderId || (orders[0]?.id || 'General'));
  const [category, setCategory] = useState('quality');
  const [priority, setPriority] = useState('medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitComplaint({
      orderId,
      customerId: user?.id || 'c1',
      customerName: user?.name || 'Sarah Connor',
      category,
      priority,
      subject,
      description,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card complaint-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="mh-title">
            <HiSupport className="mh-icon purple" />
            <div>
              <h3>Submit Complaint / Service Request</h3>
              <p>Dallas 24/7 Resolution Guarantee • Dedicated Support Ticket</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <HiX />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <HiCheckCircle className="mss-icon green" />
            <h2>Service Request Ticket Created!</h2>
            <p>Our Dallas Customer Experience Team has received your request. We aim to address all requests within 2 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form">
            <div className="form-group">
              <label>Associated Service Booking</label>
              <select value={orderId} onChange={e => setOrderId(e.target.value)}>
                <option value="General">General Account / Non-Booking Inquiry</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    Booking #{o.id} - {o.vehicle?.name} ({o.booking?.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Issue Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="quality">Quality of Cleaning Spot</option>
                  <option value="timeliness">Pro Arrival / Timeliness</option>
                  <option value="pro_behavior">Specialist Conduct</option>
                  <option value="billing">Billing / Invoice Query</option>
                  <option value="damage">Property Damage Claim</option>
                  <option value="other">General Support / Request</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low - General Feedback</option>
                  <option value="medium">Medium - Standard Resolution</option>
                  <option value="high">High - Urgent Resolution</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Subject / Brief Summary</label>
              <input
                type="text"
                placeholder="e.g. Missed kitchen counters or invoice query"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Detailed Explanation</label>
              <textarea
                rows={4}
                placeholder="Please describe the issue or service request in detail so our Dallas manager can resolve it promptly..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="complaint-guarantee-note">
              <HiShieldExclamation style={{ color: '#8b5cf6', width: 20, height: 20 }} />
              <span>Clean America Dallas 100% Satisfaction Guarantee: Free re-clean or full resolution provided on verified issues.</span>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-modal-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit purple">
                <HiSupport /> Submit Support Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
