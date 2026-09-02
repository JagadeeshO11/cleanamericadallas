import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { HiCurrencyDollar, HiCheckCircle, HiClock, HiDocumentReport, HiMail } from 'react-icons/hi';
import './Admin.css';

export default function AdminPayments() {
  const orders = useStore(s => s.orders) || [];
  const invoices = useStore(s => s.invoices) || [];

  const [activeTab, setActiveTab] = useState('ledger'); // 'ledger' | 'invoices'

  const completed = orders.filter(o => o.status === 'completed');
  const pending = orders.filter(o => ['assigned', 'active', 'pending'].includes(o.status));

  const totalCollected = completed.reduce((s, o) => s + (o.booking?.total || 0), 0);
  const totalPending = pending.reduce((s, o) => s + (o.booking?.total || 0), 0);
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Dallas Revenue, Invoices & Financial Ledger</h1>
          <p>Payment settlements, worker payout splits, and customer invoice tracking.</p>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="orders-controls" style={{ marginBottom: 24 }}>
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'ledger' ? 'active' : ''}`}
            onClick={() => setActiveTab('ledger')}
          >
            💳 Transaction Ledger ({orders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            📄 Customer Invoices ({invoices.length})
          </button>
        </div>
      </div>

      <div className="payment-summary-grid" style={{ marginBottom: 24 }}>
        <div className="ps-card green">
          <HiCheckCircle className="ps-icon" />
          <strong>${totalCollected.toLocaleString()}</strong>
          <span>Collected Revenue</span>
        </div>
        <div className="ps-card yellow">
          <HiClock className="ps-icon" />
          <strong>${totalPending.toLocaleString()}</strong>
          <span>Pending Settlements</span>
        </div>
        <div className="ps-card blue" style={{ background: '#18181b', border: '1px solid #27272a' }}>
          <HiDocumentReport className="ps-icon" style={{ color: '#ef4444' }} />
          <strong style={{ color: '#ef4444' }}>{unpaidInvoices.length} Unpaid</strong>
          <span>Invoices Overdue</span>
        </div>
      </div>

      {/* TAB 1: LEDGER */}
      {activeTab === 'ledger' && (
        <div className="admin-section">
          <h2>Transaction History & Worker Payout Ledger</h2>
          {orders.length === 0 ? (
            <div className="empty-msg">No transaction history found.</div>
          ) : (
            <div className="orders-table-wrap">
              <table className="admin-table full">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Worker Split (70%)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => {
                    const amt = o.booking?.total || 0;
                    const workerPayout = Math.round(amt * 0.7);
                    return (
                      <tr key={o.id}>
                        <td className="mono">TXN_{o.id.slice(-6)}</td>
                        <td><strong>{o.vehicle?.name}</strong></td>
                        <td>{o.customer?.name || 'Guest'}</td>
                        <td>{o.booking?.date}</td>
                        <td><strong>${amt.toLocaleString()}</strong></td>
                        <td><span style={{ color: '#10b981' }}>${workerPayout}</span></td>
                        <td>
                          <span className={`status-chip ${o.status === 'completed' ? 'completed' : 'pending'}`}>
                            {o.status === 'completed' ? 'Paid' : 'Pending Settlement'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVOICES MANAGER */}
      {activeTab === 'invoices' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16 }}>
          <h3>Customer Invoices & Billing Management</h3>
          {invoices.length === 0 ? (
            <div className="empty-msg">No invoices recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {invoices.map(inv => (
                <div key={inv.id} className="job-item" style={{ background: '#09090b', padding: 16, borderRadius: 12 }}>
                  <div className="ji-left">
                    <div>
                      <span className="mono" style={{ color: '#10b981', fontWeight: 'bold' }}>Invoice #{inv.id}</span>
                      <h4 style={{ color: '#fff', margin: '4px 0' }}>{inv.serviceName}</h4>
                      <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.85rem' }}>
                        Customer: {inv.customerName} • Order #{inv.orderId} • Due: {inv.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="ji-right" style={{ alignItems: 'flex-end', gap: 8 }}>
                    <div className="ji-amount" style={{ color: inv.status === 'paid' ? '#10b981' : '#ef4444' }}>
                      ${inv.total?.toFixed(2)}
                    </div>
                    <span className={`status-chip ${inv.status}`}>{inv.status?.toUpperCase()}</span>
                    {inv.status === 'unpaid' && (
                      <button
                        className="btn-action-outline"
                        style={{ marginTop: 4, fontSize: '0.78rem' }}
                        onClick={() => alert(`Payment reminder email dispatched to ${inv.customerName}`)}
                      >
                        <HiMail /> Send Payment Reminder
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

