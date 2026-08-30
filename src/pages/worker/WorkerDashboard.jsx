import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import {
  HiStar, HiBriefcase, HiCheckCircle, HiCurrencyDollar,
  HiLocationMarker, HiCalendar, HiUser, HiArrowRight, HiSparkles, HiRefresh
} from 'react-icons/hi';
import { MdHomeRepairService } from 'react-icons/md';
import './Worker.css';
import './WorkerMobileFix.css';

export default function WorkerDashboard() {
  const user = useAuthStore(s => s.user);
  const updateWorkerAvailability = useAuthStore(s => s.updateWorkerAvailability);
  const orders = useStore(s => s.orders);
  const placeOrder = useStore(s => s.placeOrder);
  const advanceStage = useStore(s => s.advanceStage);

  const [demoNotice, setDemoNotice] = useState('');

  const myOrders = orders.filter(o => o.operator?.id === user?.id || user?.role === 'worker');
  const activeJob = myOrders.find(o => ['assigned', 'active'].includes(o.status));
  const completedJobs = myOrders.filter(o => o.status === 'completed');
  const earnings = completedJobs.reduce((s, o) => s + (Number(o.booking?.total) || 0), 0);

  const handleLoadDemoData = () => {
    const demoWorker = user || { id: 'w1', name: 'Alex Johnson (Pro)', role: 'worker' };
    
    // Create an active demo job
    const activeDemo = placeOrder(
      { id: 'house-clean', name: 'Deep House Cleaning & Sanitation', rate: 149, unit: 'visit', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80' },
      { location: '4210 Preston Rd, Plano, TX 75024', date: 'Today, 2:00 PM', duration: 1, total: 149 },
      { id: 'c-demo1', name: 'Sarah Jenkins', phone: '(214) 555-0192' }
    );
    useStore.getState().assignWorker(activeDemo.id, demoWorker);

    // Create completed demo jobs for history & earnings
    const completedDemo1 = placeOrder(
      { id: 'ac-tuneup', name: 'HVAC & AC Summer Tune-Up', rate: 89, unit: 'service', image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=500&q=80' },
      { location: '3812 Turtle Creek Blvd, Dallas, TX 75219', date: 'Yesterday', duration: 1, total: 89 },
      { id: 'c-demo2', name: 'Robert Miller', phone: '(214) 555-0841' }
    );
    useStore.getState().assignWorker(completedDemo1.id, demoWorker);
    useStore.getState().advanceStage(completedDemo1.id);
    useStore.getState().advanceStage(completedDemo1.id);
    useStore.getState().advanceStage(completedDemo1.id);
    useStore.getState().advanceStage(completedDemo1.id);

    setDemoNotice('Demo Dallas appointments loaded! Click "Mark as Next Stage" below to test live worker workflow.');
    setTimeout(() => setDemoNotice(''), 6000);
  };

  const STATS = [
    { Icon: HiStar, val: `${user?.rating || 4.9}★`, label: 'Pro Rating', color: '#f59e0b' },
    { Icon: HiBriefcase, val: (user?.jobsDone || 3) + completedJobs.length, label: 'Jobs Completed', color: '#2E7D32' },
    { Icon: HiCheckCircle, val: completedJobs.length || 1, label: 'On Platform', color: '#10b981' },
    { Icon: HiCurrencyDollar, val: `$${(earnings + 238).toLocaleString()}`, label: 'Total Earnings', color: '#8b5cf6' },
  ];

  return (
    <div className="worker-page">
      {/* Worker Header Card with Fixed Avatar Status Overlay */}
      <div className="worker-header">
        <div className="wh-left">
          <div className="wh-avatar-wrap">
            <div className="wh-avatar">{user?.name?.charAt(0)?.toUpperCase() || 'W'}</div>
            <span className={`wh-status-dot ${user?.available ? 'online' : 'offline'}`} title={user?.available ? 'Online' : 'Offline'} />
          </div>
          <div className="wh-user-meta">
            <h1>Hey, {user?.name?.split(' ')[0] || 'Pro'}! 👋</h1>
            <p className="wh-vehicle">
              <MdHomeRepairService style={{ width: 15, height: 15, verticalAlign: 'middle', marginRight: 4 }} />
              {user?.vehicle || 'Dallas Certified Home Pro'}
            </p>
          </div>
        </div>

        <div className="wh-right-actions">
          <button className="demo-data-btn" onClick={handleLoadDemoData} title="Load sample Dallas appointments">
            <HiSparkles style={{ width: 15, height: 15 }} />
            <span>Load Demo Data</span>
          </button>

          <div className="avail-toggle">
            <span className="avail-label">Status:</span>
            <button
              className={`toggle-btn ${user?.available ? 'on' : 'off'}`}
              onClick={() => user?.id && updateWorkerAvailability(user.id, !user.available)}
            >
              {user?.available ? '● Online' : '○ Offline'}
            </button>
          </div>
        </div>
      </div>

      {demoNotice && (
        <div className="demo-notice-banner">
          <HiSparkles style={{ width: 18, height: 18, flexShrink: 0 }} />
          <span>{demoNotice}</span>
        </div>
      )}

      {/* Stats Cards */}
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

      {/* Active Job Spotlight Card */}
      {activeJob ? (
        <div className="active-job-card">
          <div className="aj-badge">🔴 Active Dallas Appointment</div>
          <h2>{activeJob.vehicle?.name}</h2>
          <div className="aj-details">
            <div className="aj-row"><HiLocationMarker className="aj-icon" /><strong>{activeJob.booking?.location}</strong></div>
            <div className="aj-row"><HiCalendar className="aj-icon" /><strong>{activeJob.booking?.date}</strong></div>
            <div className="aj-row"><HiUser className="aj-icon" /><strong>{activeJob.customer?.name}</strong><span className="aj-phone">{activeJob.customer?.phone}</span></div>
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
        <div className="no-active-job-card">
          <div className="naj-content">
            <h3>No Active Job Assigned Right Now</h3>
            <p>Click <strong>"Load Demo Data"</strong> above to simulate an incoming Dallas service appointment!</p>
            <button className="btn-load-demo" onClick={handleLoadDemoData}>
              <HiRefresh style={{ width: 15, height: 15 }} /> Load Demo Dallas Appointment
            </button>
          </div>
        </div>
      )}

      {/* Job History Section */}
      <div className="worker-section">
        <h2>Job History</h2>
        {myOrders.length === 0 ? (
          <div className="empty-msg">No jobs assigned yet. Click "Load Demo Data" above or set status to Online to receive jobs.</div>
        ) : (
          <div className="job-list">
            {myOrders.map(o => (
              <div key={o.id} className="job-item">
                <div className="ji-left">
                  <div className="ji-thumb">
                    <img
                      src={o.vehicle?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&q=70'}
                      alt={o.vehicle?.name}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&q=70'; }}
                    />
                  </div>
                  <div>
                    <strong>{o.vehicle?.name}</strong>
                    <p><HiLocationMarker style={{ width: 11, height: 11, verticalAlign: 'middle' }} /> {o.booking?.location} · {o.booking?.date}</p>
                  </div>
                </div>
                <div className="ji-right">
                  <div className="ji-amount">${o.booking?.total?.toLocaleString()}</div>
                  <span className={`status-chip ${o.status}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
