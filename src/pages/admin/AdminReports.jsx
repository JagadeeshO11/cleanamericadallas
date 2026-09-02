import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  HiCurrencyDollar, HiClipboardList, HiUsers, HiStar, HiChartBar,
  HiPlus, HiCheckCircle, HiTrendingUp, HiMinusCircle
} from 'react-icons/hi';
import './Admin.css';

export default function AdminReports() {
  const orders = useStore(s => s.orders) || [];
  const expenses = useStore(s => s.expenses) || [];
  const addExpense = useStore(s => s.addExpense);
  const getWorkers = useAuthStore(s => s.getWorkers);
  const workers = getWorkers();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'supplies',
    amount: 150,
    description: 'Eco-friendly floor sanitizer & mop refills',
  });

  const completed = orders.filter(o => o.status === 'completed');
  const totalRevenue = completed.reduce((s, o) => s + (o.booking?.total || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;
  const marginPercent = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 100;
  const avgOrderValue = completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0;

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    addExpense(expenseForm);
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: 20 }}>
        <div>
          <h1>Dallas Financial P&L & Performance Analytics</h1>
          <p>Complete revenue, expense ledger, net profit margins, and worker metrics.</p>
        </div>
        <button
          className="new-booking-btn"
          onClick={() => setIsExpenseModalOpen(true)}
          style={{ background: '#ef4444' }}
        >
          <HiPlus /> Log Business Expense
        </button>
      </div>

      {/* P&L METRIC CARDS */}
      <div className="reports-grid" style={{ marginBottom: 24 }}>
        <div className="report-metric">
          <div className="rm-icon-wrap" style={{ background: 'rgba(16,185,129,.15)', color: '#10b981' }}>
            <HiCurrencyDollar className="rm-icon" />
          </div>
          <strong>${totalRevenue.toLocaleString()}</strong>
          <span>Gross Dallas Revenue</span>
        </div>

        <div className="report-metric">
          <div className="rm-icon-wrap" style={{ background: 'rgba(239,68,68,.15)', color: '#ef4444' }}>
            <HiMinusCircle className="rm-icon" />
          </div>
          <strong style={{ color: '#ef4444' }}>${totalExpenses.toLocaleString()}</strong>
          <span>Operating Expenses</span>
        </div>

        <div className="report-metric">
          <div className="rm-icon-wrap" style={{ background: 'rgba(139,92,246,.15)', color: '#8b5cf6' }}>
            <HiTrendingUp className="rm-icon" />
          </div>
          <strong style={{ color: '#8b5cf6' }}>${netProfit.toLocaleString()} ({marginPercent}% Net)</strong>
          <span>Net Profit Margin</span>
        </div>
      </div>

      {/* EXPENSE LEDGER */}
      <div className="admin-section" style={{ marginBottom: 24 }}>
        <div className="as-header">
          <h2>Business Operating Expenses</h2>
        </div>
        <div className="orders-table-wrap">
          <table className="admin-table full">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(exp => (
                <tr key={exp.id}>
                  <td className="mono">{exp.id}</td>
                  <td><span className="status-chip active">{exp.category?.toUpperCase()}</span></td>
                  <td>{exp.description}</td>
                  <td>{exp.date}</td>
                  <td><strong style={{ color: '#ef4444' }}>-${exp.amount?.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOP WORKERS PERFORMANCE */}
      <div className="admin-section">
        <div className="as-header">
          <h2>Top Performing Dallas Pros</h2>
        </div>
        <div className="top-workers-list">
          {workers.map((w, idx) => {
            const wCompleted = completed.filter(o => o.operator?.id === w.id);
            const wRev = wCompleted.reduce((s, o) => s + (o.booking?.total || 0), 0);
            return (
              <div key={w.id} className="top-worker-row">
                <div className="top-rank">#{idx + 1}</div>
                <div className="top-info">
                  <strong className="top-name">{w.name}</strong>
                  <span className="top-spec">{w.vehicle}</span>
                </div>
                <div className="top-stats">
                  <span className="top-count">{wCompleted.length} jobs completed</span>
                  <strong className="top-rev">${wRev.toLocaleString()}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOG EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="modal-overlay" onClick={() => setIsExpenseModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiMinusCircle className="mh-icon red" style={{ color: '#ef4444' }} />
                <div>
                  <h3>Log Business Expense</h3>
                  <p>Track supplies, payouts, and marketing overhead</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsExpenseModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="modal-body-form">
              <div className="form-group">
                <label>Expense Category</label>
                <select
                  value={expenseForm.category}
                  onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                >
                  <option value="supplies">Sanitation Supplies & Chemicals</option>
                  <option value="payouts">Worker Payout / Wages</option>
                  <option value="marketing">Local Google & Social Ads</option>
                  <option value="equipment">Equipment Maintenance & Tools</option>
                </select>
              </div>

              <div className="form-group">
                <label>Amount ($)</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description / Vendor</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsExpenseModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-modal-submit" style={{ background: '#ef4444' }}>Save Expense Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

