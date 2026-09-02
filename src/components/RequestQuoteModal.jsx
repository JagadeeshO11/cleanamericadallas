import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  HiX, HiCalculator, HiSparkles, HiCheckCircle, HiHome, HiOfficeBuilding, HiCalendar, HiClock, HiDocumentText
} from 'react-icons/hi';
import './RequestQuoteModal.css';

export default function RequestQuoteModal({ isOpen, onClose, onSuccess }) {
  const user = useAuthStore(s => s.user);
  const requestQuote = useStore(s => s.requestQuote);

  const [formData, setFormData] = useState({
    serviceType: 'Deep House Cleaning & Detail',
    propertyType: 'Single Family Home',
    propertySize: '2,000 - 3,000 sq ft',
    frequency: 'One-Time Deep Clean',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTime: '09:00 AM',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    requestQuote({
      ...formData,
      customerId: user?.id || 'c1',
      customerName: user?.name || 'Dallas Customer',
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
      <div className="modal-card quote-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="mh-title">
            <HiCalculator className="mh-icon gold" />
            <div>
              <h3>Request Custom Cleaning Quote</h3>
              <p>Get a precise, itemized price quote for your Dallas property</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <HiX />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <HiCheckCircle className="mss-icon green" />
            <h2>Quote Request Submitted!</h2>
            <p>Our Dallas estimation team is building your custom quote. You will receive an instant notification in your portal shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form">
            <div className="form-group">
              <label>Service Category</label>
              <select
                value={formData.serviceType}
                onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="Deep House Cleaning & Detail">Deep House Cleaning & Detail</option>
                <option value="Move-In / Move-Out Sanitize">Move-In / Move-Out Sanitize</option>
                <option value="Commercial Office Sanitizing">Commercial Office Sanitizing</option>
                <option value="Post-Construction Clean Up">Post-Construction Clean Up</option>
                <option value="Eco Floor & Carpet Extraction">Eco Floor & Carpet Extraction</option>
                <option value="Window & Pressure Washing Combo">Window & Pressure Washing Combo</option>
              </select>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Property Type</label>
                <select
                  value={formData.propertyType}
                  onChange={e => setFormData({ ...formData, propertyType: e.target.value })}
                >
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Apartment / Condo">Apartment / Condo</option>
                  <option value="Townhome">Townhome</option>
                  <option value="Commercial Office / Suite">Commercial Office / Suite</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Size (Sq Ft)</label>
                <select
                  value={formData.propertySize}
                  onChange={e => setFormData({ ...formData, propertySize: e.target.value })}
                >
                  <option value="Under 1,000 sq ft">Under 1,000 sq ft</option>
                  <option value="1,000 - 2,000 sq ft">1,000 - 2,000 sq ft</option>
                  <option value="2,000 - 3,000 sq ft">2,000 - 3,000 sq ft</option>
                  <option value="3,000 - 5,000 sq ft">3,000 - 5,000 sq ft</option>
                  <option value="5,000+ sq ft (Custom)">5,000+ sq ft (Custom)</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Preferred Date</label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Time Slot</label>
                <select
                  value={formData.preferredTime}
                  onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                >
                  <option value="08:00 AM">Morning (8:00 AM - 11:00 AM)</option>
                  <option value="12:00 PM">Afternoon (12:00 PM - 3:00 PM)</option>
                  <option value="04:00 PM">Late Afternoon (4:00 PM - 7:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Service Frequency</label>
              <select
                value={formData.frequency}
                onChange={e => setFormData({ ...formData, frequency: e.target.value })}
              >
                <option value="One-Time Deep Clean">One-Time Deep Clean</option>
                <option value="Weekly Clean (15% OFF)">Weekly Clean (15% OFF)</option>
                <option value="Bi-Weekly Clean (10% OFF)">Bi-Weekly Clean (10% OFF)</option>
                <option value="Monthly Clean (5% OFF)">Monthly Clean (5% OFF)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Special Instructions / Specific Requirements</label>
              <textarea
                rows={3}
                placeholder="e.g. Focus on kitchen cabinets, high ceilings, pet hair treatment..."
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-modal-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit gold">
                <HiSparkles /> Submit Quote Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
