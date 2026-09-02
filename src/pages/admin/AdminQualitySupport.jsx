import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  HiSupport, HiCamera, HiCheckCircle, HiExclamationCircle,
  HiClock, HiCheck, HiSearch, HiSparkles, HiShieldCheck
} from 'react-icons/hi';
import './Admin.css';

export default function AdminQualitySupport() {
  const complaints = useStore(s => s.complaints) || [];
  const orders = useStore(s => s.orders) || [];
  const resolveComplaintAdmin = useStore(s => s.resolveComplaintAdmin);
  const getJobProgress = useStore(s => s.getJobProgress);

  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' | 'photos'
  const [selectedTicketToResolve, setSelectedTicketToResolve] = useState(null);
  const [resolutionText, setResolutionText] = useState('Issued $25 credit voucher and assigned supervisor for next clean.');

  const openTickets = complaints.filter(c => c.status !== 'resolved');

  const handleResolveTicketSubmit = (e) => {
    e.preventDefault();
    if (!selectedTicketToResolve) return;
    resolveComplaintAdmin(selectedTicketToResolve.id, resolutionText);
    setSelectedTicketToResolve(null);
  };

  return (
    <div className="admin-page">
      <div className="dash-welcome">
        <h1>Quality Assurance & Customer Resolution</h1>
        <p>Audit worker before/after job photos and resolve customer support tickets & complaints.</p>
      </div>

      {/* TOP METRICS */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card purple">
          <div className="sc-top">
            <div className="sc-val">{openTickets.length}</div>
            <div className="sc-icon-wrap purple"><HiSupport className="sc-icon" /></div>
          </div>
          <div className="sc-label">Open Support Tickets</div>
        </div>

        <div className="stat-card green">
          <div className="sc-top">
            <div className="sc-val">{complaints.filter(c => c.status === 'resolved').length}</div>
            <div className="sc-icon-wrap green"><HiCheckCircle className="sc-icon" /></div>
          </div>
          <div className="sc-label">Resolved Issues</div>
        </div>

        <div className="stat-card orange">
          <div className="sc-top">
            <div className="sc-val">{orders.length}</div>
            <div className="sc-icon-wrap orange"><HiCamera className="sc-icon" /></div>
          </div>
          <div className="sc-label">Job Audits Available</div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="orders-controls" style={{ marginBottom: 24 }}>
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            🎧 Customer Complaints & Tickets ({complaints.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            📸 Job Photos QA Gallery ({orders.length})
          </button>
        </div>
      </div>

      {/* TAB 1: SUPPORT TICKETS & COMPLAINTS */}
      {activeTab === 'tickets' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16 }}>
          <h3>Dallas Customer Support Tickets</h3>
          {complaints.length === 0 ? (
            <div className="empty-msg">No customer support tickets recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {complaints.map(t => (
                <div key={t.id} className="job-item" style={{ background: '#09090b', padding: 16, borderRadius: 12 }}>
                  <div className="ji-left">
                    <div>
                      <span className="mono" style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Ticket #{t.id}</span>
                      <h4 style={{ color: '#fff', margin: '4px 0' }}>{t.subject}</h4>
                      <p style={{ color: '#a1a1aa', margin: '4px 0', fontSize: '0.85rem' }}>
                        Customer: {t.customerName} • Order #{t.orderId} • Priority: <strong style={{ color: '#f59e0b' }}>{t.priority?.toUpperCase()}</strong>
                      </p>
                      <p style={{ color: '#d4d4d8', margin: 0, fontSize: '0.88rem' }}>"{t.description}"</p>
                    </div>
                  </div>
                  <div className="ji-right" style={{ alignItems: 'flex-end', gap: 8 }}>
                    <span className={`status-chip ${t.status}`}>{t.status}</span>
                    {t.status !== 'resolved' && (
                      <button
                        className="btn-action-purple"
                        style={{ marginTop: 6 }}
                        onClick={() => setSelectedTicketToResolve(t)}
                      >
                        <HiCheck /> Resolve Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BEFORE/AFTER JOB PHOTOS QA GALLERY */}
      {activeTab === 'photos' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16 }}>
          <h3>Worker Proof-of-Work Photo Audit Gallery</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 16 }}>
            {orders.map(order => {
              const progress = getJobProgress(order.id);
              const beforeCount = progress.beforePhotos?.length || 0;
              const afterCount = progress.afterPhotos?.length || 0;

              return (
                <div key={order.id} style={{ background: '#09090b', padding: 16, borderRadius: 12, border: '1px solid #27272a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <strong style={{ color: '#ff6b00' }}>Order #{order.id}</strong> — <span style={{ color: '#fff' }}>{order.vehicle?.name}</span>
                      <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.8rem' }}>Location: {order.booking?.location} • Pro: {order.operator?.name || 'Dallas Pro'}</p>
                    </div>
                    <span className={`status-chip ${order.status}`}>{order.status}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <h5 style={{ color: '#a1a1aa', margin: '0 0 6px 0', fontSize: '0.82rem' }}>Before Clean ({beforeCount})</h5>
                      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                        {progress.beforePhotos?.map((img, idx) => (
                          <img key={idx} src={img} alt="Before" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 style={{ color: '#10b981', margin: '0 0 6px 0', fontSize: '0.82rem' }}>After Clean ({afterCount})</h5>
                      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                        {progress.afterPhotos?.map((img, idx) => (
                          <img key={idx} src={img} alt="After" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RESOLVE TICKET MODAL */}
      {selectedTicketToResolve && (
        <div className="modal-overlay" onClick={() => setSelectedTicketToResolve(null)}>
          <div className="modal-card" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiSupport className="mh-icon purple" style={{ color: '#8b5cf6' }} />
                <div>
                  <h3>Resolve Customer Support Ticket</h3>
                  <p>Ticket #{selectedTicketToResolve.id} • {selectedTicketToResolve.subject}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedTicketToResolve(null)}>✕</button>
            </div>

            <form onSubmit={handleResolveTicketSubmit} className="modal-body-form">
              <div className="form-group">
                <label>Resolution Notes & Action Taken</label>
                <textarea
                  rows={3}
                  value={resolutionText}
                  onChange={e => setResolutionText(e.target.value)}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setSelectedTicketToResolve(null)}>Cancel</button>
                <button type="submit" className="btn-modal-submit" style={{ background: '#8b5cf6' }}>Confirm Ticket Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
