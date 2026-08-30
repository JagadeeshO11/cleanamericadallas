import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { HiLocationMarker, HiCalendar, HiUser, HiArrowRight, HiClipboardList } from 'react-icons/hi';

export default function WorkerOrders() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);
  const advanceStage = useStore(s => s.advanceStage);

  const activeOrders = orders.filter(o =>
    (o.operator?.id === user?.id || user?.role === 'worker') && ['assigned', 'active', 'pending'].includes(o.status)
  );

  return (
    <div className="worker-page">
      <div className="wp-title">
        <HiClipboardList className="wp-title-icon" />
        <h1>Active Appointments</h1>
      </div>

      {activeOrders.length === 0 ? (
        <div className="empty-msg">No active service appointments right now.</div>
      ) : (
        <div className="order-cards">
          {activeOrders.map(o => (
            <div key={o.id} className="order-card">
              <div className="oc-header">
                <div>
                  <div className="oc-id">#{o.id}</div>
                  <div className="oc-vehicle">{o.vehicle?.name}</div>
                </div>
                <span className={`status-chip ${o.status}`}>{o.status}</span>
              </div>
              <div className="oc-details">
                <div className="oc-row"><HiLocationMarker className="oc-icon" /><span>{o.booking?.location}</span></div>
                <div className="oc-row"><HiCalendar className="oc-icon" /><span>{o.booking?.date} · {o.booking?.duration || 1} {o.vehicle?.unit || 'visit'}</span></div>
                <div className="oc-row"><HiUser className="oc-icon" /><span>{o.customer?.name} {o.customer?.phone && <span className="oc-phone">{o.customer.phone}</span>}</span></div>
              </div>
              <div className="oc-stage-bar">
                <span>Stage:</span> <strong>{o.stages[o.stage]}</strong>
              </div>
              <div className="oc-footer">
                <div className="oc-amount-wrap">
                  <span className="oc-amount-sub">Total</span>
                  <div className="oc-amount">${o.booking?.total?.toLocaleString()}</div>
                </div>
                {o.stage < o.stages.length - 1 && (
                  <button className="oc-advance-btn" onClick={() => advanceStage(o.id)}>
                    <span>{o.stages[o.stage + 1]}</span>
                    <HiArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
