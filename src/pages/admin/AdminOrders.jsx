import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import { HiStar, HiX } from 'react-icons/hi';
import { MdAssignmentInd } from 'react-icons/md';
import './Admin.css';

const STATUS_FILTERS = ['all', 'pending', 'assigned', 'active', 'completed', 'cancelled'];

export default function AdminOrders() {
  const orders = useStore(s => s.orders);
  const assignWorker = useStore(s => s.assignWorker);
  const cancelOrder = useStore(s => s.cancelOrder);
  const advanceStage = useStore(s => s.advanceStage);
  const getWorkers = useAuthStore(s => s.getWorkers);
  const workers = getWorkers();

  const [activeView, setActiveView] = useState('list'); // 'list' | 'schedule'
  const [filter, setFilter] = useState('all');
  const [assignModal, setAssignModal] = useState(null);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const handleAssign = (orderId, worker) => {
    assignWorker(orderId, { id: worker.id, name: worker.name, phone: worker.phone, rating: worker.rating, vehicle: worker.vehicle });
    setAssignModal(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Booking & Master Dispatch Scheduling</h1>
          <p>Dispatch pros, manage calendar schedules, and monitor all Dallas service requests.</p>
        </div>
      </div>

      <div className="orders-controls" style={{ marginBottom: 20 }}>
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeView === 'list' ? 'active' : ''}`}
            onClick={() => setActiveView('list')}
          >
            📋 Booking List ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeView === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveView('schedule')}
          >
            📅 Master Schedule Calendar
          </button>
        </div>
      </div>

      {activeView === 'schedule' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16, marginBottom: 24 }}>
          <h3>Dallas Dispatch Calendar (Master Worker Shift Grid)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 16 }}>
            {workers.map(w => {
              const workerJobs = orders.filter(o => o.operator?.id === w.id);
              return (
                <div key={w.id} style={{ background: '#09090b', padding: 16, borderRadius: 12, border: '1px solid #27272a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{w.name}</strong>
                    <span className={`status-chip ${w.available ? 'active' : 'pending'}`}>{w.available ? 'Online' : 'Offline'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: 8 }}>{w.vehicle}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {workerJobs.length === 0 ? (
                      <span style={{ fontSize: '0.78rem', color: '#71717a' }}>No assigned jobs today</span>
                    ) : (
                      workerJobs.map(j => (
                        <div key={j.id} style={{ background: '#18181b', padding: 8, borderRadius: 6, borderLeft: '3px solid #ff6b00' }}>
                          <div style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 'bold' }}>{j.vehicle?.name}</div>
                          <div style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>#{j.id.slice(-6)} • {j.booking?.date} ({j.scheduledTime || '09:00 AM'})</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'list' && (
        <>
          <div className="filter-tabs">
            {STATUS_FILTERS.map(f => (
              <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
                <span className="tab-count">
                  {f === 'all' ? orders.length : orders.filter(o => o.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {filtered.length === 0 ? (
        <div className="empty-msg">No bookings in this category.</div>
      ) : (
        <div className="orders-table-wrap">
          <table className="admin-table full">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Service</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Assigned Pro</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td className="mono">#{o.id.slice(-6)}</td>
                  <td><strong>{o.vehicle?.name}</strong></td>
                  <td>{o.customer?.name || 'Guest'}</td>
                  <td className="truncate">{o.booking?.location}</td>
                  <td>{o.booking?.date}</td>
                  <td>${o.booking?.total?.toLocaleString()}</td>
                  <td><span className={`status-chip ${o.status}`}>{o.status}</span></td>
                  <td>{o.operator ? o.operator.name : <span className="unassigned">Unassigned</span>}</td>
                  <td>
                    <div className="action-btns">
                      {o.status === 'pending' && (
                        <button className="act-btn assign" onClick={() => setAssignModal(o.id)}>
                          <MdAssignmentInd style={{ width: 13, height: 13 }} /> Assign Pro
                        </button>
                      )}
                      {['assigned', 'active'].includes(o.status) && (
                        <button className="act-btn advance" onClick={() => advanceStage(o.id)}>Advance</button>
                      )}
                      {!['completed', 'cancelled'].includes(o.status) && (
                        <button className="act-btn cancel" onClick={() => cancelOrder(o.id)}>
                          <HiX style={{ width: 12, height: 12 }} /> Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Dispatch Dallas Pro</h3>
            <p>Select an available pro for this service appointment</p>
            <div className="worker-options">
              {workers.map(w => (
                <button
                  key={w.id}
                  className={`worker-option ${!w.available ? 'busy' : ''}`}
                  onClick={() => w.available && handleAssign(assignModal, w)}
                  disabled={!w.available}
                >
                  <div className="wo-avatar">{w.name.charAt(0)}</div>
                  <div className="wo-info">
                    <strong>{w.name}</strong>
                    <span>{w.vehicle}</span>
                    <span>
                      <HiStar style={{ width: 11, height: 11, color: '#f59e0b' }} /> {w.rating} · {w.jobsDone} jobs
                    </span>
                  </div>
                  <span className={`avail-badge ${w.available ? 'on' : 'off'}`}>
                    {w.available ? 'Available' : 'Busy'}
                  </span>
                </button>
              ))}
            </div>
            <button className="modal-close" onClick={() => setAssignModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
