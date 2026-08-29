import { useStore } from '../../store/useStore';
import { HiCurrencyDollar, HiCheckCircle, HiClock } from 'react-icons/hi';
import './Admin.css';

export default function AdminPayments() {
  const orders = useStore(s => s.orders);

  const completed = orders.filter(o => o.status === 'completed');
  const pending = orders.filter(o => ['assigned', 'active', 'pending'].includes(o.status));

  const totalCollected = completed.reduce((s, o) => s + (o.booking?.total || 0), 0);
  const totalPending = pending.reduce((s, o) => s + (o.booking?.total || 0), 0);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Dallas Revenue & Transactions</h1>
          <p>Payment settlements and active invoices</p>
        </div>
      </div>

      <div className="payment-summary-grid">
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
      </div>

      <div className="admin-section" style={{ marginTop: 24 }}>
        <h2>Transaction History</h2>
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
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td className="mono">TXN_{o.id.slice(-6)}</td>
                    <td><strong>{o.vehicle?.name}</strong></td>
                    <td>{o.customer?.name || 'Guest'}</td>
                    <td>{o.booking?.date}</td>
                    <td><strong>${o.booking?.total?.toLocaleString()}</strong></td>
                    <td>
                      <span className={`status-chip ${o.status === 'completed' ? 'completed' : 'pending'}`}>
                        {o.status === 'completed' ? 'Paid' : 'Pending Settlement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
