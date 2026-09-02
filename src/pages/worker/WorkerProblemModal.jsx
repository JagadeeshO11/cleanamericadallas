import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { HiX, HiExclamationCircle, HiCamera, HiCheckCircle, HiShieldExclamation } from 'react-icons/hi';

export default function WorkerProblemModal({ isOpen, orderId, onClose, onSuccess }) {
  const reportWorkerProblem = useStore(s => s.reportWorkerProblem);

  const [category, setCategory] = useState('access_denied');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !orderId) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    reportWorkerProblem(orderId, {
      category,
      description,
      photo,
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
      <div className="modal-card problem-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="mh-title">
            <HiExclamationCircle className="mh-icon red" style={{ color: '#ef4444' }} />
            <div>
              <h3>Report On-Site Problem</h3>
              <p>Booking #{orderId} • Notify Dispatch & Customer</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <HiX />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <HiCheckCircle className="mss-icon green" />
            <h2>Problem Report Logged</h2>
            <p>Our Dallas operations dispatch team and customer support manager have been notified of this issue.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form">
            <div className="form-group">
              <label>Issue Type / Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="access_denied">Unable to Access Property / Gate Code Error</option>
                <option value="pre_existing_damage">Pre-existing Property Damage Observed</option>
                <option value="excessive_mess">Extreme Soil / Scope Deviation Beyond Booking</option>
                <option value="pet_hazard">Unsecured Pets or Safety Concern</option>
                <option value="equipment_fault">Supplies / Equipment Fault</option>
                <option value="other">Other On-Site Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label>Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Explain what happened at the job site..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label><HiCamera style={{ verticalAlign: 'middle', marginRight: 4 }} /> Attach Proof Photo (Preset / Sample)</label>
              <select value={photo} onChange={e => setPhoto(e.target.value)}>
                <option value="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80">Locked Gate / Access Barrier Photo</option>
                <option value="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80">Pre-existing Stain / Scratch Photo</option>
                <option value="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&q=80">Heavy Soil / Scope Misalignment</option>
              </select>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-modal-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit" style={{ background: '#ef4444' }}>
                Submit Problem Ticket
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
