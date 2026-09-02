import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { HiUsers, HiPhone, HiMail, HiPlus, HiUserAdd, HiCheckCircle, HiClock, HiCurrencyDollar } from 'react-icons/hi';
import './Admin.css';

export default function AdminCustomers() {
  const getCustomers = useAuthStore(s => s.getCustomers);
  const orders = useStore(s => s.orders) || [];
  const leads = useStore(s => s.leads) || [];
  const createAdminLead = useStore(s => s.createAdminLead);
  const updateLeadStatus = useStore(s => s.updateLeadStatus);

  const customers = getCustomers();

  const [activeTab, setActiveTab] = useState('customers'); // 'customers' | 'leads'
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: 'Robert Vance',
    company: 'Vance Logistics Office',
    email: 'robert@vancelogistics.com',
    phone: '(214) 555-8821',
    serviceNeeded: 'Commercial Floor Care & Sanitizing',
    propertySize: '3,800 sq ft',
    estimatedValue: 450,
  });

  const handleAddLeadSubmit = (e) => {
    e.preventDefault();
    createAdminLead(leadForm);
    setIsLeadModalOpen(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Dallas Customer & Sales CRM</h1>
          <p>Manage active customer accounts, lifetime spent values, and sales inquiry leads.</p>
        </div>
      </div>

      {/* TABS & CONTROLS */}
      <div className="orders-controls" style={{ marginBottom: 24 }}>
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            👥 Registered Customers ({customers.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => setActiveTab('leads')}
          >
            🎯 Sales Leads & CRM Pipeline ({leads.length})
          </button>
        </div>

        {activeTab === 'leads' && (
          <button
            className="new-booking-btn"
            onClick={() => setIsLeadModalOpen(true)}
            style={{ background: '#3b82f6' }}
          >
            <HiPlus /> Add New Sales Lead
          </button>
        )}
      </div>

      {/* TAB 1: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="customers-grid">
          {customers.length === 0 ? (
            <div className="empty-msg">No customers registered yet.</div>
          ) : (
            customers.map(c => {
              const custOrders = orders.filter(o => o.customer?.id === c.id);
              const spent = custOrders.filter(o => o.status === 'completed').reduce((s, o) => s + (o.booking?.total || 0), 0);
              return (
                <div key={c.id} className="customer-card">
                  <div className="cc-top">
                    <div className="cc-avatar">{c.name?.charAt(0)?.toUpperCase() || 'C'}</div>
                    <span className="role-tag customer">Customer</span>
                  </div>
                  <h3>{c.name || 'Customer'}</h3>
                  <div className="cc-info">
                    <div className="cc-row"><HiMail className="cc-icon" />{c.email}</div>
                    <div className="cc-row"><HiPhone className="cc-icon" />{c.phone || '—'}</div>
                  </div>
                  <div className="cc-stats">
                    <div><strong>{custOrders.length}</strong><span>Bookings</span></div>
                    <div><strong>${spent.toLocaleString()}</strong><span>Spent</span></div>
                    <div><strong>{custOrders.filter(o => o.status === 'completed').length}</strong><span>Completed</span></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: CRM LEADS PIPELINE */}
      {activeTab === 'leads' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16 }}>
          <h3>Sales Inquiry Leads & Prospects</h3>
          {leads.length === 0 ? (
            <div className="empty-msg">No CRM sales leads recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {leads.map(l => (
                <div key={l.id} className="job-item" style={{ background: '#09090b', padding: 16, borderRadius: 12 }}>
                  <div className="ji-left">
                    <div>
                      <span className="mono" style={{ color: '#60a5fa', fontWeight: 'bold' }}>Lead #{l.id}</span>
                      <h4 style={{ color: '#fff', margin: '4px 0' }}>{l.name} ({l.company})</h4>
                      <p style={{ color: '#a1a1aa', margin: '4px 0', fontSize: '0.85rem' }}>
                        Service Needed: {l.serviceNeeded} • Size: {l.propertySize} • Phone: {l.phone}
                      </p>
                    </div>
                  </div>
                  <div className="ji-right" style={{ alignItems: 'flex-end', gap: 8 }}>
                    <div className="ji-amount" style={{ color: '#10b981' }}>Est. ${l.estimatedValue}</div>
                    <select
                      value={l.status}
                      onChange={e => updateLeadStatus(l.id, e.target.value)}
                      style={{ background: '#18181b', border: '1px solid #3f3f46', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: '0.8rem' }}
                    >
                      <option value="new">New Lead</option>
                      <option value="contacted">Contacted</option>
                      <option value="quoted">Quoted</option>
                      <option value="converted">Converted to Customer</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {isLeadModalOpen && (
        <div className="modal-overlay" onClick={() => setIsLeadModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiUserAdd className="mh-icon blue" style={{ color: '#3b82f6' }} />
                <div>
                  <h3>Add CRM Sales Lead</h3>
                  <p>Capture prospective Dallas inquiry</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsLeadModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="modal-body-form">
              <div className="form-group">
                <label>Prospect Name</label>
                <input
                  type="text"
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company / Property Name</label>
                <input
                  type="text"
                  value={leadForm.company}
                  onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={leadForm.email}
                    onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={leadForm.phone}
                    onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Service Needed & Property Size</label>
                <input
                  type="text"
                  value={leadForm.serviceNeeded}
                  onChange={e => setLeadForm({ ...leadForm, serviceNeeded: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Estimated Value ($)</label>
                <input
                  type="number"
                  value={leadForm.estimatedValue}
                  onChange={e => setLeadForm({ ...leadForm, estimatedValue: e.target.value })}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsLeadModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-modal-submit" style={{ background: '#3b82f6' }}>Save CRM Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

