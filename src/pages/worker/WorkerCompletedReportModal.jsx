import { useStore } from '../../store/useStore';
import {
  HiX, HiCheckCircle, HiClock, HiLocationMarker, HiUser, HiStar,
  HiShieldCheck, HiCamera, HiClipboardCheck, HiDocumentText, HiCurrencyDollar, HiPrinter
} from 'react-icons/hi';
import './WorkerCompletedReportModal.css';

export default function WorkerCompletedReportModal({ isOpen, order, onClose }) {
  const getJobProgress = useStore(s => s.getJobProgress);

  if (!isOpen || !order) return null;

  const jobProgress = getJobProgress(order.id);
  const report = jobProgress?.completionReport || {
    submittedAt: '04:30 PM',
    notes: 'Full house deep sanitization completed. Kitchen surfaces disinfected, bathrooms scrubbed, and hardwood floors steam mopped.',
    lockUpConfirmed: true,
    checklistCompleted: 7,
    totalChecklist: 7,
    beforeCount: jobProgress.beforePhotos?.length || 1,
    afterCount: jobProgress.afterPhotos?.length || 1
  };

  const checklist = jobProgress.checklist || [];
  const beforePhotos = jobProgress.beforePhotos || ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80'];
  const afterPhotos = jobProgress.afterPhotos || ['https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&q=80'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay report-modal-overlay" onClick={onClose}>
      <div className="modal-card completed-report-card" onClick={e => e.stopPropagation()}>
        {/* HEADER */}
        <div className="cbr-header">
          <div className="cbr-hdr-left">
            <span className="cbr-badge">
              <HiShieldCheck /> Verified Completed Job Report
            </span>
            <h2>{order.vehicle?.name}</h2>
            <p className="cbr-sub">
              <HiLocationMarker className="cbr-icon gold" /> {order.booking?.location || 'Dallas, TX'} • Job #{order.id}
            </p>
          </div>

          <div className="cbr-hdr-right">
            <button className="btn-print-report" onClick={handlePrint} title="Print / Export PDF">
              <HiPrinter /> Print Report
            </button>
            <button className="cbr-close-btn" onClick={onClose} aria-label="Close modal">
              <HiX />
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="cbr-metrics-grid">
          <div className="cm-box">
            <div className="cm-icon-wrap green">
              <HiCheckCircle />
            </div>
            <div>
              <span>Execution Status</span>
              <strong>100% Completed</strong>
            </div>
          </div>

          <div className="cm-box">
            <div className="cm-icon-wrap blue">
              <HiClock />
            </div>
            <div>
              <span>Check-In / Out</span>
              <strong>{jobProgress.checkedInAt || '09:00 AM'} - {jobProgress.checkedOutAt || '11:45 AM'}</strong>
            </div>
          </div>

          <div className="cm-box">
            <div className="cm-icon-wrap purple">
              <HiClipboardCheck />
            </div>
            <div>
              <span>Tasks Verified</span>
              <strong>{report.checklistCompleted} / {report.totalChecklist} Tasks Done</strong>
            </div>
          </div>

          <div className="cm-box">
            <div className="cm-icon-wrap gold">
              <HiCurrencyDollar />
            </div>
            <div>
              <span>Job Settlement</span>
              <strong>${(order.booking?.total || 149).toFixed(2)} USD (Paid)</strong>
            </div>
          </div>
        </div>

        {/* MAIN BODY SCROLL */}
        <div className="cbr-body">
          {/* CUSTOMER & PRO VERIFICATION */}
          <div className="cbr-section-card">
            <h4><HiUser className="csc-icon" /> Service & Execution Details</h4>
            <div className="cbr-info-grid">
              <div className="ci-item">
                <span>Dallas Homeowner:</span>
                <strong>{order.customer?.name || 'Dallas Resident'}</strong>
              </div>
              <div className="ci-item">
                <span>Assigned Pro:</span>
                <strong>{order.operator?.name || 'Dallas Certified Cleaner'} (⭐ 4.9)</strong>
              </div>
              <div className="ci-item">
                <span>Scheduled Date:</span>
                <strong>{order.scheduledDate || order.booking?.date || 'Today'} ({order.scheduledTime || '09:00 AM'})</strong>
              </div>
              <div className="ci-item">
                <span>Security Lock-Up:</span>
                <strong className="green">✓ Doors & Windows Confirmed Locked</strong>
              </div>
            </div>
          </div>

          {/* CHECKLIST SUMMARY */}
          <div className="cbr-section-card">
            <h4><HiClipboardCheck className="csc-icon green" /> Verified Cleaning Checklist</h4>
            <div className="cbr-checklist-grid">
              {checklist.map(item => (
                <div key={item.id} className="cbr-chk-item">
                  <HiCheckCircle className="chk-icon green" />
                  <span>{item.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROOF OF WORK PHOTOS */}
          <div className="cbr-section-card">
            <h4><HiCamera className="csc-icon orange" /> Inspection Proof Photos</h4>
            <div className="cbr-photos-row">
              <div className="cbr-photo-group">
                <span className="cbr-photo-label before">Before Cleaning Inspection</span>
                <div className="cbr-photo-thumbs">
                  {beforePhotos.map((img, i) => (
                    <img key={i} src={img} alt="Before" className="cbr-thumb" />
                  ))}
                </div>
              </div>

              <div className="cbr-photo-group">
                <span className="cbr-photo-label after">After Cleaning Result</span>
                <div className="cbr-photo-thumbs">
                  {afterPhotos.map((img, i) => (
                    <img key={i} src={img} alt="After" className="cbr-thumb" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* WORKER REPORT NOTES */}
          <div className="cbr-section-card">
            <h4><HiDocumentText className="csc-icon blue" /> Pro Job Summary Notes</h4>
            <div className="cbr-notes-box">
              <p>"{report.notes}"</p>
              <span className="cbr-time-stamp">Submitted at {report.submittedAt || '4:30 PM'} • Verified by Clean America Dallas Ops</span>
            </div>
          </div>

          {/* CUSTOMER REVIEW */}
          <div className="cbr-review-card">
            <div className="crc-header">
              <div className="crc-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <HiStar key={s} className="star-icon gold" />
                ))}
              </div>
              <span className="crc-tag">Customer Review • Verified 5.0 Rating</span>
            </div>
            <p className="crc-comment">"The cleaner arrived right on time, completed every single task on the checklist thoroughly, and left the home sparkling clean. Highly recommended Dallas service!"</p>
            <span className="crc-author">- {order.customer?.name || 'Dallas Customer'}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
