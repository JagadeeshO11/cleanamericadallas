import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import WorkerJobModal from './WorkerJobModal';
import WorkerCompletedReportModal from './WorkerCompletedReportModal';
import {
  HiStar, HiBriefcase, HiCheckCircle, HiCurrencyDollar,
  HiLocationMarker, HiCalendar, HiUser, HiArrowRight, HiSparkles, HiRefresh,
  HiClipboardCheck, HiCamera, HiClock, HiDocumentText
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
  const [selectedModalJob, setSelectedModalJob] = useState(null);
  const [selectedReportJob, setSelectedReportJob] = useState(null);

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
          <div className="aj-header">
            <span className="aj-badge">🔴 Active Dallas Appointment</span>
            <span className="status-chip active">Active</span>
          </div>
          <h2>{activeJob.vehicle?.name}</h2>
          <div className="aj-details">
            <div className="aj-row"><HiLocationMarker className="aj-icon" /><span>{activeJob.booking?.location}</span></div>
            <div className="aj-row"><HiCalendar className="aj-icon" /><span>{activeJob.booking?.date}</span></div>
            <div className="aj-row"><HiUser className="aj-icon" /><span>{activeJob.customer?.name} {activeJob.customer?.phone && <span className="aj-phone">{activeJob.customer.phone}</span>}</span></div>
          </div>
          <div className="aj-stage-bar">
            <span>Stage:</span> <strong>{activeJob.stages[activeJob.stage]}</strong>
          </div>
          <div className="aj-footer" style={{ flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="aj-amount-wrap">
                <span className="aj-amount-sub">Est. Total</span>
                <strong className="aj-amount">${(activeJob.booking?.total || activeJob.vehicle?.rate || 149).toLocaleString()}</strong>
              </div>
              {activeJob.stage < activeJob.stages.length - 1 && (
                <button className="aj-advance-btn" onClick={() => advanceStage(activeJob.id)}>
                  <span>Mark: {activeJob.stages[activeJob.stage + 1]}</span>
                  <HiArrowRight style={{ width: 15, height: 15 }} />
                </button>
              )}
            </div>

            <button
              className="btn-launch-job-drawer"
              style={{
                background: 'linear-gradient(135deg, #ff6b00, #f59e0b)',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={() => setSelectedModalJob(activeJob)}
            >
              <HiClipboardCheck style={{ width: 18, height: 18 }} />
              Open Job Execution Drawer (Check-In, Checklist, Photos)
            </button>
          </div>
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

      {/* JOB EXECUTION MODAL */}
      <WorkerJobModal
        isOpen={!!selectedModalJob}
        order={selectedModalJob}
        onClose={() => setSelectedModalJob(null)}
      />


      {/* TODAY'S JOBS SECTION */}
      <div className="worker-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>🔥 Today's Scheduled Jobs</h2>
          <span style={{ fontSize: '0.8rem', color: '#ff6b00', fontWeight: '700' }}>
            {myOrders.filter(o => o.status !== 'completed').length} Pending / Active
          </span>
        </div>

        {myOrders.filter(o => o.status !== 'completed').length === 0 ? (
          <div className="empty-msg">No jobs scheduled for today yet. Click "Load Demo Data" to test.</div>
        ) : (
          <div className="job-list">
            {myOrders.filter(o => o.status !== 'completed').map(o => (
              <div key={o.id} className="job-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="ji-left">
                    <div className="ji-thumb">
                      <img
                        src={o.vehicle?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&q=70'}
                        alt={o.vehicle?.name}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&q=70'; }}
                      />
                    </div>
                    <div>
                      <strong style={{ color: '#fff', fontSize: '1rem' }}>{o.vehicle?.name}</strong>
                      <p style={{ margin: '3px 0 0 0', color: '#a1a1aa', fontSize: '0.82rem' }}>
                        <HiLocationMarker style={{ width: 12, height: 12, verticalAlign: 'middle', color: '#f59e0b' }} /> {o.booking?.location || 'Dallas, TX'}
                      </p>
                      <p style={{ margin: '2px 0 0 0', color: '#60a5fa', fontSize: '0.8rem' }}>
                        Customer: <strong>{o.customer?.name || 'Dallas Customer'}</strong> ({o.customer?.phone || '(214) 555-0192'})
                      </p>
                    </div>
                  </div>
                  <div className="ji-right" style={{ textAlign: 'right' }}>
                    <div className="ji-amount" style={{ color: '#10b981', fontWeight: '800' }}>
                      ${(o.booking?.total || o.vehicle?.rate || 149).toLocaleString()}
                    </div>
                    <span className={`status-chip ${o.status}`}>{o.status}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: '1px solid #27272a', paddingTop: 10 }}>
                  <button
                    className="btn-launch-execution"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b00, #f59e0b)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onClick={() => setSelectedModalJob(o)}
                  >
                    <HiClipboardCheck style={{ width: 16, height: 16 }} />
                    Check-In, Checklist, Photos & Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED JOB HISTORY & REVIEWS */}
      <div className="worker-section" style={{ marginTop: 24 }}>
        <h2>Completed Jobs & Customer Reviews</h2>
        {completedJobs.length === 0 ? (
          <div className="empty-msg">No completed job reports yet.</div>
        ) : (
          <div className="job-list">
            {completedJobs.map(o => (
              <div key={o.id} className="job-item completed-mobile-card">
                <div className="ji-left">
                  <div className="ji-thumb">
                    <img
                      src={o.vehicle?.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120&q=70'}
                      alt={o.vehicle?.name}
                    />
                  </div>
                  <div>
                    <strong>{o.vehicle?.name}</strong>
                    <p><HiLocationMarker style={{ width: 11, height: 11, verticalAlign: 'middle' }} /> {o.booking?.location} · {o.booking?.date}</p>
                    <div style={{ color: '#f59e0b', fontSize: '0.8rem', marginTop: 2 }}>
                      <HiStar style={{ verticalAlign: 'middle', marginRight: 2 }} /> 5.0 Rating • "Excellent clean & fast execution!"
                    </div>
                  </div>
                </div>
                <div className="ji-right" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div className="ji-amount" style={{ color: '#10b981', fontWeight: '800' }}>+${(o.booking?.total || 149).toLocaleString()}</div>
                  <span className="status-chip completed">Completed & Payout Claimed</span>
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
                    <HiDocumentText /> View Full Job Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMPLETED REPORT MODAL */}
      <WorkerCompletedReportModal
        isOpen={!!selectedReportJob}
        order={selectedReportJob}
        onClose={() => setSelectedReportJob(null)}
      />
    </div>
  );
}
