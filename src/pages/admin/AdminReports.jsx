import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { HiCurrencyDollar, HiClipboardList, HiUsers, HiStar } from 'react-icons/hi';
import './Admin.css';

export default function AdminReports() {
  const orders = useStore(s => s.orders);
  const getWorkers = useAuthStore(s => s.getWorkers);
  const workers = getWorkers();

  const completed = orders.filter(o => o.status === 'completed');
  const totalRevenue = completed.reduce((s, o) => s + (o.booking?.total || 0), 0);
  const avgOrderValue = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Dallas Analytics & Reports</h1>
          <p>Performance metrics for Clean America Dallas</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-metric">
          <div className="rm-icon-wrap" style={{ background: 'rgba(76,175,22,.12)', color: 'var(--primary)' }}>
            <HiCurrencyDollar className="rm-icon" />
          </div>
          <strong>${totalRevenue.toLocaleString()}</strong>
          <span>Total Dallas Revenue</span>
        </div>
        <div className="report-metric">
          <div className="rm-icon-wrap" style={{ background: 'rgba(59,130,246,.12)', color: '#3b82f6' }}>
            <HiClipboardList className="rm-icon" />
          </div>
          <strong>{completed.length}</strong>
          <span>Completed Appointments</span>
        </div>
        <div className="report-metric">
          <div className="rm-icon-wrap" style={{ background: 'rgba(245,158,11,.12)', color: '#f59e0b' }}>
            <HiStar className="rm-icon" />
          </div>
          <strong>${avgOrderValue.toLocaleString()}</strong>
          <span>Average Service Ticket</span>
        </div>
      </div>

      <div className="admin-section" style={{ marginTop: 24 }}>
        <h2>Top Performing Dallas Pros</h2>
        <div className="top-workers-list">
          {workers.map((w, idx) => {
            const wCompleted = completed.filter(o => o.operator?.id === w.id);
            const wRev = wCompleted.reduce((s, o) => s + (o.booking?.total || 0), 0);
            return (
              <div key={w.id} className="top-worker-row">
                <div className="top-rank">#{idx + 1}</div>
                <div className="top-info">
                  <strong className="top-name">{w.name}</strong>
                  <span className="top-spec">{w.vehicle}</span>
                </div>
                <div className="top-stats">
                  <span className="top-count">{wCompleted.length} jobs</span>
                  <strong className="top-rev">${wRev.toLocaleString()}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
