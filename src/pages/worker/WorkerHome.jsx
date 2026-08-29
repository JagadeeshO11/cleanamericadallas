import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import {
  HiStar, HiBriefcase, HiCheckCircle, HiCurrencyDollar,
  HiLocationMarker, HiCalendar, HiUser, HiArrowRight,
} from 'react-icons/hi';
import { MdHomeRepairService } from 'react-icons/md';

export default function WorkerHome() {
  const user = useAuthStore(s => s.user);
  const updateWorkerAvailability = useAuthStore(s => s.updateWorkerAvailability);
  const orders = useStore(s => s.orders);
  const advanceStage = useStore(s => s.advanceStage);

  const myOrders = orders.filter(o => o.operator?.id === user?.id || user?.role === 'worker');
  const activeJob = myOrders.find(o => ['assigned', 'active'].includes(o.status));
  const completedJobs = myOrders.filter(o => o.status === 'completed');
  const earnings = completedJobs.reduce((s, o) => s + (o.booking?.total || 0), 0);

  const STATS = [
    { Icon: HiStar, val: `${user?.rating || 4.9}★`, label: 'Pro Rating', color: '#f59e0b' },
    { Icon: HiBriefcase, val: (user?.jobsDone || 0) + completedJobs.length, label: 'Jobs Completed', color: '#3b82f6' },
    { Icon: HiCheckCircle, val: completedJobs.length, label: 'Completed', color: '#10b981' },
    { Icon: HiCurrencyDollar, val: `$${earnings.toLocaleString()}`, label: 'Earnings', color: '#8b5cf6' },
  ];

  return (
    <div className="worker-page">
      {/* Header */}
      <div className="worker-header">
        <div className="wh-left">
          <div className="wh-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'W'}</div>
          <div>
            <h1>Hey, {user?.name?.split(' ')[0] || 'Pro'}! 👋</h1>
            <p className="wh-vehicle">
              <MdHomeRepairService style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 4 }} />
              {user?.vehicle || 'Dallas Home Service Pro'}
            </p>
          </div>
        </div>
        <div className="avail-toggle">
          <span>Dallas Online Status:</span>
          <button
            className={`toggle-btn ${user?.available ? 'on' : 'off'}`}
            onClick={() => user?.id && updateWorkerAvailability(user.id, !user.available)}
          >
            {user?.available ? '● Online' : '○ Offline'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="worker-stats">
        {STATS.map(({ Icon, val, label, color }) => (
          <div key={label} className="ws-card">
            <div className="ws-icon-wrap" style={{ background: color + '18', color }}>
              <Icon className="ws-icon" />
            </div>
            <strong>{val}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Active Job */}
      {activeJob ? (
        <div className="active-job-card">
          <div className="aj-badge">🔴 Active Appointment</div>
          <h2>{activeJob.vehicle?.name}</h2>
          <div className="aj-details">
            <div className="aj-row"><HiLocationMarker className="aj-icon" /><strong>{activeJob.booking?.location}</strong></div>
            <div className="aj-row"><HiCalendar className="aj-icon" /><strong>{activeJob.booking?.date}</strong></div>
            <div className="aj-row">
              <HiUser className="aj-icon" />
              <strong>{activeJob.customer?.name}</strong>
              <span className="aj-phone">{activeJob.customer?.phone}</span>
            </div>
          </div>
          <div className="aj-stage">Current Stage: <strong>{activeJob.stages[activeJob.stage]}</strong></div>
          {activeJob.stage < activeJob.stages.length - 1 && (
            <button className="aj-advance" onClick={() => advanceStage(activeJob.id)}>
              Mark as: {activeJob.stages[activeJob.stage + 1]}
              <HiArrowRight style={{ width: 16, height: 16 }} />
            </button>
          )}
        </div>
      ) : (
        <div className="no-active-job">
          <span>🟢</span>
          <p>{user?.available ? 'You are online in Dallas. Waiting for new service requests...' : 'Turn status online to start receiving Dallas bookings.'}</p>
        </div>
      )}
    </div>
  );
}
