import { useState } from 'react';
import { useStore } from '../../store/useStore';
import WorkerProblemModal from './WorkerProblemModal';
import {
  HiX, HiLocationMarker, HiPhone, HiUser, HiClock, HiCheckCircle,
  HiClipboardCheck, HiCamera, HiExclamationCircle, HiShieldCheck, HiSparkles, HiKey,
  HiLightningBolt, HiUpload, HiTrash, HiCheck, HiTag
} from 'react-icons/hi';
import './WorkerJobModal.css';

export default function WorkerJobModal({ isOpen, order, onClose, onSuccess }) {
  const getJobProgress = useStore(s => s.getJobProgress);
  const jobProgress = getJobProgress(order?.id);
  const checkInJob = useStore(s => s.checkInJob);
  const checkOutJob = useStore(s => s.checkOutJob);
  const toggleChecklistItem = useStore(s => s.toggleChecklistItem);
  const addJobPhoto = useStore(s => s.addJobPhoto);
  const submitJobCompletionReport = useStore(s => s.submitJobCompletionReport);

  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'checklist' | 'photos' | 'report'
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [lockUpConfirmed, setLockUpConfirmed] = useState(true);
  const [newPhotoType, setNewPhotoType] = useState('before');
  const [newPhotoPreset, setNewPhotoPreset] = useState('https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80');
  const [photoFeedback, setPhotoFeedback] = useState('');

  if (!isOpen || !order) return null;

  const checklist = jobProgress.checklist || [];
  const completedChecklistCount = checklist.filter(c => c.done).length;
  const checklistPercent = checklist.length > 0 ? Math.round((completedChecklistCount / checklist.length) * 100) : 0;

  const handleCheckIn = () => {
    checkInJob(order.id);
  };

  const handleCheckOut = () => {
    checkOutJob(order.id);
  };

  const handleAddPhoto = () => {
    addJobPhoto(order.id, newPhotoType, newPhotoPreset);
    setPhotoFeedback(`✅ ${newPhotoType === 'before' ? 'Before' : 'After'} proof photo added!`);
    setTimeout(() => setPhotoFeedback(''), 3000);
  };

  const handleSubmitFinalReport = (e) => {
    e.preventDefault();
    submitJobCompletionReport(order.id, {
      notes: completionNotes,
      lockUpConfirmed
    });
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="modal-overlay wjm-overlay" onClick={onClose}>
      <div className="modal-card worker-job-drawer-card" onClick={e => e.stopPropagation()}>
        
        {/* TOP ACCENT BAR */}
        <div className="wjm-top-accent" />

        {/* MODAL HEADER */}
        <div className="wjm-modal-header">
          <div className="wjm-header-left">
            <span className="wjm-job-id-chip">Dallas Job #{order.id}</span>
            <h2>{order.vehicle?.name}</h2>
            <p className="wjm-sub-address">
              <HiLocationMarker className="wjm-hdr-icon" /> {order.booking?.location || 'Dallas, TX'}
            </p>
          </div>
          <button className="wjm-close-btn" onClick={onClose} aria-label="Close modal">
            <HiX />
          </button>
        </div>

        {/* CHECK-IN / CHECK-OUT INTERACTIVE BAR */}
        <div className={`wjm-checkin-bar ${jobProgress.checkedInAt ? 'checked-in' : ''}`}>
          <div className="wcb-info">
            <span className="wcb-live-dot" />
            <div>
              <strong className="wcb-status-title">
                {jobProgress.checkedOutAt
                  ? 'Job Completed & Checked Out'
                  : jobProgress.checkedInAt
                  ? 'Active On-Site Execution'
                  : 'Pending Pro Arrival'}
              </strong>
              <span className="wcb-time-text">
                {jobProgress.checkedOutAt
                  ? `Checked Out at ${jobProgress.checkedOutAt}`
                  : jobProgress.checkedInAt
                  ? `Checked In at ${jobProgress.checkedInAt}`
                  : 'Tap Check-In upon arriving at Dallas residence'}
              </span>
            </div>
          </div>

          <div className="wcb-actions">
            {!jobProgress.checkedInAt ? (
              <button className="btn-action-checkin" onClick={handleCheckIn}>
                <HiLightningBolt /> Check-In at Location
              </button>
            ) : !jobProgress.checkedOutAt ? (
              <button className="btn-action-checkout" onClick={handleCheckOut}>
                <HiCheckCircle /> Complete & Check-Out
              </button>
            ) : (
              <span className="wcb-done-badge"><HiCheck /> Shift Finished</span>
            )}
          </div>
        </div>

        {/* TAB NAVIGATION PILLS */}
        <div className="wjm-nav-pills">
          <button
            className={`wjm-pill ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <HiLocationMarker /> Property Details
          </button>
          <button
            className={`wjm-pill ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <HiClipboardCheck /> Checklist ({completedChecklistCount}/{checklist.length})
          </button>
          <button
            className={`wjm-pill ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            <HiCamera /> Photos ({(jobProgress.beforePhotos?.length || 0) + (jobProgress.afterPhotos?.length || 0)})
          </button>
          <button
            className={`wjm-pill ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            <HiShieldCheck /> Final Report
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="wjm-modal-body">
          
          {/* TAB 1: PROPERTY DETAILS & CUSTOMER CONTACT */}
          {activeTab === 'details' && (
            <div className="wjm-tab-pane">
              <div className="wjm-card-box">
                <div className="wcb-hdr">
                  <HiUser className="wcb-hdr-icon blue" />
                  <h4>Customer Contact & Entry</h4>
                </div>
                <div className="wcb-grid">
                  <div className="wcb-item">
                    <span>Dallas Homeowner:</span>
                    <strong>{order.customer?.name || 'Dallas Customer'}</strong>
                  </div>
                  <div className="wcb-item">
                    <span>Contact Phone:</span>
                    <strong className="phone-wrap">
                      {order.customer?.phone || '(214) 555-0192'}
                      <a href={`tel:${order.customer?.phone || '2145550192'}`} className="wcb-call-badge">
                        <HiPhone /> Call Customer
                      </a>
                    </strong>
                  </div>
                  <div className="wcb-item highlight-entry">
                    <span>Gate Code & Lockbox:</span>
                    <strong className="code-text"><HiKey /> Gate Code: #4821 • Lockbox: #0921</strong>
                  </div>
                </div>
              </div>

              <div className="wjm-card-box">
                <div className="wcb-hdr">
                  <HiClock className="wcb-hdr-icon gold" />
                  <h4>Schedule & Service Payout</h4>
                </div>
                <div className="wcb-grid">
                  <div className="wcb-item">
                    <span>Shift Window:</span>
                    <strong>{order.scheduledTime || '09:00 AM'} ({order.booking?.date || 'Today'})</strong>
                  </div>
                  <div className="wcb-item">
                    <span>Estimated Payout:</span>
                    <strong className="payout-green">${(order.booking?.total || 149).toFixed(2)} USD</strong>
                  </div>
                </div>
              </div>

              {order.booking?.notes && (
                <div className="wjm-instructions-box">
                  <HiSparkles className="ib-icon" />
                  <div>
                    <strong>Customer Special Instructions:</strong>
                    <p>"{order.booking.notes}"</p>
                  </div>
                </div>
              )}

              <div className="wjm-actions-row">
                <button className="btn-wjm-problem" onClick={() => setIsProblemModalOpen(true)}>
                  <HiExclamationCircle /> Report On-Site Problem / Barrier
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CLEANING CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="wjm-tab-pane">
              <div className="wjm-progress-card">
                <div className="wpc-header">
                  <span>Shift Cleaning Progress</span>
                  <strong className="wpc-percent">{checklistPercent}% Completed</strong>
                </div>
                <div className="wpc-track">
                  <div className="wpc-fill" style={{ width: `${checklistPercent}%` }} />
                </div>
              </div>

              <div className="wjm-checklist-list">
                {checklist.map(item => (
                  <div
                    key={item.id}
                    className={`wjm-checklist-row ${item.done ? 'checked' : ''}`}
                    onClick={() => toggleChecklistItem(order.id, item.id)}
                  >
                    <div className="wjm-checkbox">
                      {item.done && <HiCheck />}
                    </div>
                    <span className="wjm-task-text">{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BEFORE & AFTER PHOTOS */}
          {activeTab === 'photos' && (
            <div className="wjm-tab-pane">
              <div className="wjm-uploader-card">
                <div className="wuc-header">
                  <HiCamera className="wuc-icon" />
                  <div>
                    <h4>Proof of Performance Photos</h4>
                    <p>Upload mandatory before & after inspection photos for customer approval</p>
                  </div>
                </div>

                <div className="wuc-controls">
                  <div className="wuc-select-group">
                    <label>Photo Type</label>
                    <select value={newPhotoType} onChange={e => setNewPhotoType(e.target.value)}>
                      <option value="before">📷 Before Cleaning Inspection</option>
                      <option value="after">✨ After Cleaning Result</option>
                    </select>
                  </div>

                  <div className="wuc-select-group">
                    <label>Sample Photo Preset</label>
                    <select value={newPhotoPreset} onChange={e => setNewPhotoPreset(e.target.value)}>
                      <option value="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80">Pre-Clean Kitchen / Living Room</option>
                      <option value="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&q=80">Post-Clean Polished Flooring</option>
                      <option value="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80">Sanitized Bath & Fixture</option>
                    </select>
                  </div>

                  <button className="btn-wuc-upload" onClick={handleAddPhoto}>
                    <HiUpload /> Upload Photo
                  </button>
                </div>

                {photoFeedback && <div className="wuc-feedback">{photoFeedback}</div>}
              </div>

              {/* PHOTO GALLERY GRID */}
              <div className="wjm-gallery-grid">
                <div className="wgb-column">
                  <div className="wgb-hdr">
                    <span>📷 Before Cleaning ({jobProgress.beforePhotos?.length || 0})</span>
                  </div>
                  <div className="wgb-photos">
                    {jobProgress.beforePhotos?.map((img, idx) => (
                      <div key={idx} className="wgb-photo-card">
                        <img src={img} alt="Before clean" className="wgb-img" />
                        <span className="wgb-tag before">Before</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="wgb-column">
                  <div className="wgb-hdr">
                    <span>✨ After Cleaning ({jobProgress.afterPhotos?.length || 0})</span>
                  </div>
                  <div className="wgb-photos">
                    {jobProgress.afterPhotos?.map((img, idx) => (
                      <div key={idx} className="wgb-photo-card">
                        <img src={img} alt="After clean" className="wgb-img" />
                        <span className="wgb-tag after">After</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FINAL REPORT & PAYOUT CLAIM */}
          {activeTab === 'report' && (
            <form onSubmit={handleSubmitFinalReport} className="wjm-tab-pane">
              <div className="wjm-summary-card">
                <h4>Shift Execution Summary</h4>
                <div className="ws-row">
                  <span>Arrival Status:</span>
                  <strong className="green">{jobProgress.checkedInAt ? `Checked In at ${jobProgress.checkedInAt}` : 'Verified On-Site'}</strong>
                </div>
                <div className="ws-row">
                  <span>Checklist Progress:</span>
                  <strong>{completedChecklistCount}/{checklist.length} Tasks Verified ({checklistPercent}%)</strong>
                </div>
                <div className="ws-row">
                  <span>Proof Photos:</span>
                  <strong>{(jobProgress.beforePhotos?.length || 0) + (jobProgress.afterPhotos?.length || 0)} Inspection Photos Attached</strong>
                </div>
              </div>

              <div className="wjm-form-group">
                <label>Job Notes & Next Visit Recommendation</label>
                <textarea
                  rows={3}
                  placeholder="Notes for homeowner, key location details, or recommendations..."
                  value={completionNotes}
                  onChange={e => setCompletionNotes(e.target.value)}
                />
              </div>

              <div className="wjm-form-group">
                <label className="wjm-checkbox-label">
                  <input
                    type="checkbox"
                    checked={lockUpConfirmed}
                    onChange={e => setLockUpConfirmed(e.target.checked)}
                  />
                  <span>I confirm property has been locked securely & lights turned off.</span>
                </label>
              </div>

              <button type="submit" className="btn-submit-payout-report">
                <HiCheckCircle /> Submit Completion Report & Request Payout
              </button>
            </form>
          )}

        </div>
      </div>

      {/* PROBLEM TICKET MODAL */}
      <WorkerProblemModal
        isOpen={isProblemModalOpen}
        orderId={order.id}
        onClose={() => setIsProblemModalOpen(false)}
      />
    </div>
  );
}
