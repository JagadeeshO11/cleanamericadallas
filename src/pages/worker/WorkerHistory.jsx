import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import WorkerCompletedReportModal from './WorkerCompletedReportModal';
import { HiClock, HiLocationMarker, HiCheckCircle, HiDocumentText } from 'react-icons/hi';

export default function WorkerHistory() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);
  const [selectedReportJob, setSelectedReportJob] = useState(null);

  const completed = orders.filter(o =>
    (o.operator?.id === user?.id || user?.role === 'worker') && o.status === 'completed'
  );

  const totalEarned = completed.reduce((s, o) => s + (o.booking?.total || 0), 0);

  return (
    <div className="worker-page">
      <div className="wp-title">
        <HiClock className="wp-title-icon" />
        <h1>Completed Job History</h1>
      </div>

      <div className="history-summary">
        <div className="hs-item">
          <strong>{completed.length}</strong>
          <span>Total Completed</span>
        </div>
        <div className="hs-item">
          <strong>${totalEarned.toLocaleString()}</strong>
          <span>Total Earned</span>
        </div>
      </div>

      {completed.length === 0 ? (
        <div className="empty-msg">No completed jobs yet.</div>
      ) : (
        <div className="job-list">
          {completed.map(o => (
            <div key={o.id} className="job-item">
              <div className="ji-left">
                <HiCheckCircle style={{ width: 24, height: 24, color: '#10b981', flexShrink: 0 }} />
                <div>
                  <strong>{o.vehicle?.name}</strong>
                  <p>
                    <HiLocationMarker style={{ width: 11, height: 11, verticalAlign: 'middle' }} /> {o.booking?.location} · {o.booking?.date}
                  </p>
                </div>
              </div>
              <div className="ji-right" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <div className="ji-amount" style={{ color: '#10b981', fontWeight: '800' }}>${(o.booking?.total || 149).toLocaleString()}</div>
                <span className="status-chip completed">Completed</span>
                <button
                  style={{
                    background: '#18181b',
                    border: '1px solid #3f3f46',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={() => setSelectedReportJob(o)}
                >
                  <HiDocumentText /> View Completed Job Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPLETED REPORT MODAL */}
      <WorkerCompletedReportModal
        isOpen={!!selectedReportJob}
        order={selectedReportJob}
        onClose={() => setSelectedReportJob(null)}
      />
    </div>
  );
}
