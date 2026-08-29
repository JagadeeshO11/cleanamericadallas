import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { HiStar, HiPhone } from 'react-icons/hi';
import { MdHomeRepairService } from 'react-icons/md';
import './Admin.css';

export default function AdminWorkers() {
  const getWorkers = useAuthStore(s => s.getWorkers);
  const updateWorkerAvailability = useAuthStore(s => s.updateWorkerAvailability);
  const orders = useStore(s => s.orders);
  const workers = getWorkers();

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Dallas Pro Management</h1>
          <p>Monitor certified Dallas service providers & live availability status</p>
        </div>
      </div>

      <div className="workers-grid">
        {workers.map(w => {
          const workerOrders = orders.filter(o => o.operator?.id === w.id);
          const activeJob = orders.find(o => o.operator?.id === w.id && ['assigned', 'active'].includes(o.status));

          return (
            <div key={w.id} className="worker-card">
              <div className="wc-top">
                <div className="wc-avatar">{w.name?.charAt(0)?.toUpperCase() || 'P'}</div>
                <div className={`wc-status ${w.available ? 'on' : 'off'}`}>
                  {w.available ? '● Available' : '● Busy'}
                </div>
              </div>

              <h3>{w.name || 'Dallas Pro'}</h3>

              <p className="wc-vehicle">
                <MdHomeRepairService style={{ width: 15, height: 15, verticalAlign: 'middle', marginRight: 6, color: 'var(--primary)' }} />
                {w.vehicle || 'Dallas Certified Home Pro'}
              </p>

              <p className="wc-phone">
                <HiPhone style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 6, color: 'var(--text-muted)' }} />
                {w.phone || '+1 214-555-0192'}
              </p>

              <div className="wc-stats">
                <div>
                  <strong>
                    <HiStar style={{ width: 14, height: 14, color: '#f59e0b', verticalAlign: 'middle', marginRight: 2 }} />
                    {w.rating || 4.9}
                  </strong>
                  <span>Rating</span>
                </div>
                <div>
                  <strong>{w.jobsDone || 0}</strong>
                  <span>Completed</span>
                </div>
                <div>
                  <strong>{workerOrders.length}</strong>
                  <span>Active Jobs</span>
                </div>
              </div>

              {activeJob && (
                <div className="active-job-badge">
                  🔴 Live Appointment: {activeJob.vehicle?.name}
                </div>
              )}

              <button
                className={`toggle-avail ${w.available ? 'set-busy' : 'set-avail'}`}
                onClick={() => updateWorkerAvailability(w.id, !w.available)}
              >
                {w.available ? 'Mark Status: Busy' : 'Mark Status: Available'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
