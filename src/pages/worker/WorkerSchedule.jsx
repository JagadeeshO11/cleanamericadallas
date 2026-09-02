import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import WorkerJobModal from './WorkerJobModal';
import {
  HiCalendar, HiClock, HiLocationMarker, HiUser, HiCheckCircle, HiChevronRight, HiSparkles
} from 'react-icons/hi';
import './WorkerSchedule.css';

export default function WorkerSchedule() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);

  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'upcoming' | 'all'
  const [selectedJob, setSelectedJob] = useState(null);

  const myOrders = orders.filter(o => o.operator?.id === user?.id || user?.role === 'worker');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredJobs = myOrders.filter(order => {
    const jobDate = order.scheduledDate || order.booking?.date;
    const isToday = jobDate === todayStr || jobDate?.toLowerCase().includes('today') || order.status === 'active';

    if (activeTab === 'today') return isToday;
    if (activeTab === 'upcoming') return !isToday && order.status !== 'completed';
    return true;
  });

  const todayCount = myOrders.filter(o => {
    const d = o.scheduledDate || o.booking?.date;
    return d === todayStr || d?.toLowerCase().includes('today') || o.status === 'active';
  }).length;

  return (
    <div className="worker-page schedule-page">
      {/* HEADER */}
      <div className="ws-header">
        <div>
          <h1>Pro Service Schedule</h1>
          <p>View Today's Dallas Appointments & Upcoming Shift Calendar</p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="ws-controls">
        <div className="ws-tabs">
          <button
            className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            🔥 Today's Jobs ({todayCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming Shifts ({myOrders.length - todayCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Assigned ({myOrders.length})
          </button>
        </div>
      </div>

      {/* SCHEDULE LIST */}
      {filteredJobs.length === 0 ? (
        <div className="ws-empty-card">
          <HiCalendar className="wec-icon" />
          <h2>No Appointments Scheduled</h2>
          <p>You have no assigned Dallas jobs for this filter view.</p>
        </div>
      ) : (
        <div className="ws-grid">
          {filteredJobs.map(job => {
            const isComplete = job.status === 'completed';
            const isActive = job.status === 'active' || job.status === 'assigned';

            return (
              <div key={job.id} className={`ws-job-card ${job.status}`}>
                <div className="wsjc-header">
                  <div className="wsjc-time-badge">
                    <HiClock /> {job.scheduledTime || '09:00 AM'}
                  </div>
                  <span className={`status-chip ${job.status}`}>
                    {isActive ? '🔴 Active Today' : isComplete ? '✅ Completed' : 'Scheduled'}
                  </span>
                </div>

                <div className="wsjc-body">
                  <h3>{job.vehicle?.name}</h3>
                  <div className="wsjc-row">
                    <HiLocationMarker className="wsjc-icon" />
                    <span>{job.booking?.location}</span>
                  </div>
                  <div className="wsjc-row">
                    <HiCalendar className="wsjc-icon" />
                    <span>Date: <strong>{job.scheduledDate || job.booking?.date || 'Today'}</strong></span>
                  </div>
                  <div className="wsjc-row">
                    <HiUser className="wsjc-icon" />
                    <span>Customer: {job.customer?.name} ({job.customer?.phone || 'Encrypted'})</span>
                  </div>
                </div>

                <div className="wsjc-footer">
                  <div className="wsjc-rate">${job.booking?.total || job.vehicle?.rate}</div>
                  <button className="btn-launch-execution" onClick={() => setSelectedJob(job)}>
                    Launch Execution Drawer <HiChevronRight />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JOB EXECUTION MODAL */}
      <WorkerJobModal
        isOpen={!!selectedJob}
        order={selectedJob}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
