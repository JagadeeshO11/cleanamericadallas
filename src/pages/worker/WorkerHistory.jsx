import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { HiClock, HiLocationMarker, HiCheckCircle } from 'react-icons/hi';

export default function WorkerHistory() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);

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
              <div className="ji-right">
                <div className="ji-amount">${o.booking?.total?.toLocaleString()}</div>
                <span className="status-chip completed">Completed</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
