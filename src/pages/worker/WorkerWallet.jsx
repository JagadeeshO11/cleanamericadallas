import { useAuthStore } from '../../store/useAuthStore';
import { useStore } from '../../store/useStore';
import { HiCurrencyDollar, HiCreditCard, HiCheckCircle } from 'react-icons/hi';

export default function WorkerWallet() {
  const user = useAuthStore(s => s.user);
  const orders = useStore(s => s.orders);

  const completed = orders.filter(o =>
    (o.operator?.id === user?.id || user?.role === 'worker') && o.status === 'completed'
  );

  const totalEarned = completed.reduce((s, o) => s + (o.booking?.total || 0), 0);
  const availablePayout = Math.round(totalEarned * 0.85); // 85% payout after platform fee

  return (
    <div className="worker-page">
      <div className="wp-title">
        <HiCurrencyDollar className="wp-title-icon" />
        <h1>Pro Earnings & Wallet</h1>
      </div>

      <div className="wallet-card primary">
        <div className="wc-balance-label">Available for Payout</div>
        <div className="wc-balance-amount">${availablePayout.toLocaleString()}</div>
        <div className="wc-sub">Direct Deposit to Dallas Bank Account</div>
      </div>

      <div className="wallet-stats">
        <div className="ws-card">
          <strong>${totalEarned.toLocaleString()}</strong>
          <span>Gross Earnings</span>
        </div>
        <div className="ws-card">
          <strong>{completed.length}</strong>
          <span>Paid Jobs</span>
        </div>
      </div>

      <div className="worker-section" style={{ marginTop: 24 }}>
        <h2>Payout History</h2>
        {completed.length === 0 ? (
          <div className="empty-msg">No payout records available yet.</div>
        ) : (
          <div className="txn-list">
            {completed.map(o => (
              <div key={o.id} className="txn-item">
                <div className="txn-left">
                  <HiCreditCard style={{ width: 20, height: 20, color: 'var(--primary)' }} />
                  <div>
                    <strong>Payout for #{o.id.slice(-6)}</strong>
                    <span>{o.booking?.date} · Direct Deposit</span>
                  </div>
                </div>
                <div className="txn-right">
                  <div className="txn-amount">+${Math.round((o.booking?.total || 0) * 0.85).toLocaleString()}</div>
                  <span className="status-chip completed">Settled</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
