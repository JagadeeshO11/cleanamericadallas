import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  HiClipboardList, HiLightningBolt, HiCheckCircle,
  HiCurrencyDollar, HiUsers, HiArrowRight, HiStar,
  HiCalculator, HiDocumentText, HiSupport, HiCamera, HiChartBar
} from 'react-icons/hi';
import { MdPendingActions } from 'react-icons/md';
import './Admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const orders = useStore(s => s.orders) || [];
  const leads = useStore(s => s.leads) || [];
  const contracts = useStore(s => s.contracts) || [];
  const quotes = useStore(s => s.quotes) || [];
  const complaints = useStore(s => s.complaints) || [];
  const expenses = useStore(s => s.expenses) || [];
  const getWorkers = useAuthStore(s => s.getWorkers);
  const workers = getWorkers();

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.booking?.total || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const netMargin = totalRevenue - totalExpenses;
  const activeContractsValue = contracts.reduce((s, c) => s + (c.monthlyValue || 0), 0);
  const openLeadsCount = leads.filter(l => l.status === 'new' || l.status === 'contacted').length;
  const openTicketsCount = complaints.filter(c => c.status !== 'resolved').length;

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['assigned', 'active'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    availableWorkers: workers.filter(w => w.available).length,
  };

  const recent = orders.slice(0, 5);

  const STAT_CARDS = [
    { label: 'Gross Revenue', val: `$${totalRevenue.toLocaleString()}`, Icon: HiCurrencyDollar, cls: 'green' },
    { label: 'Net Profit Margin', val: `$${netMargin.toLocaleString()}`, Icon: HiChartBar, cls: 'purple' },
    { label: 'Active Contracts / mo', val: `$${activeContractsValue.toLocaleString()}`, Icon: HiDocumentText, cls: 'blue' },
    { label: 'Open CRM Leads', val: openLeadsCount, Icon: HiUsers, cls: 'orange' },
    { label: 'Unassigned Dispatch', val: stats.pending, Icon: MdPendingActions, cls: 'yellow' },
    { label: 'Open Support Tickets', val: openTicketsCount, Icon: HiSupport, cls: 'red' },
  ];

  return (
    <div className="admin-page">
      <div className="dash-welcome">
        <p>Dallas Operations Command Center 👋</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STAT_CARDS.map(({ label, val, Icon, cls }) => (
          <div key={label} className={`stat-card ${cls}`}>
            <div className="sc-top">
              <div className="sc-val">{val}</div>
              <div className={`sc-icon-wrap ${cls}`}><Icon className="sc-icon" /></div>
            </div>
            <div className="sc-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid for all 13 Admin Requirements */}
      <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
        {[
          { label: 'Bookings & Dispatch', path: '/admin/orders', cls: 'orange' },
          { label: 'Customers & Leads', path: '/admin/customers', cls: 'blue' },
          { label: 'Dallas Pros', path: '/admin/workers', cls: 'green' },
          { label: 'Quotes & Contracts', path: '/admin/quotes', cls: 'purple' },
          { label: 'Invoices & Ledger', path: '/admin/payments', cls: 'yellow' },
          { label: 'Support & QA Photos', path: '/admin/quality', cls: 'red' },
          { label: 'P&L Reports', path: '/admin/reports', cls: 'teal' },
        ].map(({ label, path, cls }) => (
          <button key={path} className={`qa-btn ${cls}`} onClick={() => navigate(path)}>
            {label} <HiArrowRight style={{ width: 14, height: 14 }} />
          </button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="admin-section">
        <div className="as-header">
          <h2>Recent Dallas Bookings</h2>
          <button onClick={() => navigate('/admin/orders')}>
            View all <HiArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="empty-msg">No service bookings yet.</div>
        ) : (
          <div className="recent-orders-list">
            {recent.map(o => (
              <div key={o.id} className="ro-item" onClick={() => navigate('/admin/orders')}>
                <div className="ro-left">
                  <div className="ro-vehicle">{o.vehicle?.name}</div>
                  <div className="ro-meta">
                    <span className="mono">#{o.id.slice(-6)}</span>
                    <span>·</span>
                    <span>{o.customer?.name || 'Guest'}</span>
                  </div>
                </div>
                <div className="ro-right">
                  <div className="ro-amount">${o.booking?.total?.toLocaleString() || '—'}</div>
                  <span className={`status-chip ${o.status}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Service Pros */}
      <div className="admin-section" style={{ marginTop: 16 }}>
        <div className="as-header">
          <h2>Certified Dallas Pros</h2>
          <button onClick={() => navigate('/admin/workers')}>
            Manage Pros <HiArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
        <div className="worker-list">
          {workers.map(w => (
            <div key={w.id} className="worker-row">
              <div className="wr-avatar">{w.name?.charAt(0)?.toUpperCase() || 'W'}</div>
              <div className="wr-info">
                <strong>{w.name || 'Pro'}</strong>
                <span>{w.vehicle}</span>
              </div>
              <div className={`avail-dot ${w.available ? 'on' : 'off'}`} />
              <span className="wr-rating">
                <HiStar style={{ width: 12, height: 12, color: '#f59e0b' }} /> {w.rating}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

