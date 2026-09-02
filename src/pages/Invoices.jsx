import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import PaymentModal from '../components/PaymentModal';
import {
  HiDocumentReport, HiCreditCard, HiCheckCircle, HiClock, HiPrinter,
  HiDownload, HiSearch, HiCheck, HiSparkles, HiShieldCheck
} from 'react-icons/hi';
import './Invoices.css';

export default function Invoices() {
  const user = useAuthStore(s => s.user);
  const invoices = useStore(s => s.invoices) || [];

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unpaid' | 'paid'
  const [search, setSearch] = useState('');
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState(null);
  const [viewInvoiceReceipt, setViewInvoiceReceipt] = useState(null);

  const customerInvoices = invoices.filter(i => i.customerId === user?.id || !user);

  const filteredInvoices = customerInvoices.filter(inv => {
    if (activeTab === 'unpaid' && inv.status !== 'unpaid') return false;
    if (activeTab === 'paid' && inv.status !== 'paid') return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inv.id?.toLowerCase().includes(q) ||
        inv.serviceName?.toLowerCase().includes(q) ||
        inv.orderId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unpaidCount = customerInvoices.filter(i => i.status === 'unpaid').length;
  const totalUnpaidAmount = customerInvoices
    .filter(i => i.status === 'unpaid')
    .reduce((sum, i) => sum + (i.total || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoices-page">
      {/* HEADER BANNER */}
      <div className="invoices-header">
        <div>
          <div className="ih-eyebrow">
            <HiShieldCheck className="ihe-icon" /> Official Dallas Receipts & Billing
          </div>
          <h1>Service Invoices & Payments</h1>
          <p>Review itemized service bills, download official receipts, and settle pending payments safely.</p>
        </div>

        {totalUnpaidAmount > 0 && (
          <div className="unpaid-summary-badge">
            <span>Pending Outstanding Balance</span>
            <strong>${totalUnpaidAmount.toFixed(2)}</strong>
          </div>
        )}
      </div>

      {/* CONTROLS */}
      <div className="invoices-controls">
        <div className="invoices-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Invoices ({customerInvoices.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'unpaid' ? 'active' : ''}`}
            onClick={() => setActiveTab('unpaid')}
          >
            Unpaid / Due ({unpaidCount})
          </button>
          <button
            className={`tab-btn ${activeTab === 'paid' ? 'active' : ''}`}
            onClick={() => setActiveTab('paid')}
          >
            Paid ({customerInvoices.length - unpaidCount})
          </button>
        </div>

        <div className="invoices-search">
          <HiSearch className="is-icon" />
          <input
            type="text"
            placeholder="Search invoice #, service, order ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* INVOICES LIST */}
      {filteredInvoices.length === 0 ? (
        <div className="invoices-empty-card">
          <HiDocumentReport className="iec-icon" />
          <h2>No Invoices Found</h2>
          <p>Invoices will appear here automatically when you confirm quotes or book Dallas home services.</p>
        </div>
      ) : (
        <div className="invoices-list">
          {filteredInvoices.map(inv => {
            const isPaid = inv.status === 'paid';

            return (
              <div key={inv.id} className={`invoice-card ${inv.status}`}>
                {/* CARD HEADER */}
                <div className="ic-header">
                  <div className="ic-id-wrap">
                    <span className="ic-id">Invoice #{inv.id}</span>
                    <h3>{inv.serviceName}</h3>
                    <span className="ic-sub">Booking Order: #{inv.orderId} • Issued {inv.issuedDate}</span>
                  </div>
                  <div className="ic-header-right">
                    <div className="ic-total">${inv.total?.toFixed(2)}</div>
                    <span className={`ic-status ${inv.status}`}>
                      {isPaid ? <><HiCheckCircle /> Paid</> : <><HiClock /> Due {inv.dueDate}</>}
                    </span>
                  </div>
                </div>

                {/* LINE ITEMS */}
                <div className="ic-body">
                  <div className="ic-line-items">
                    {inv.lineItems?.map((item, idx) => (
                      <div key={idx} className="ic-line-row">
                        <span>{item.description}</span>
                        <span>${item.amount?.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="ic-line-row total">
                      <span>Total Invoice Amount</span>
                      <strong>${inv.total?.toFixed(2)}</strong>
                    </div>
                  </div>

                  {isPaid && (
                    <div className="ic-paid-note">
                      <HiCheck style={{ color: '#10b981' }} /> Settled on {new Date(inv.paidAt || Date.now()).toLocaleDateString()} via {inv.paymentMethod || 'Credit Card'}
                    </div>
                  )}
                </div>

                {/* CARD ACTIONS */}
                <div className="ic-footer">
                  <button className="btn-ic-receipt" onClick={() => setViewInvoiceReceipt(inv)}>
                    <HiPrinter /> View Printable Receipt
                  </button>

                  {!isPaid && (
                    <button className="btn-ic-pay" onClick={() => setSelectedInvoiceForPay(inv)}>
                      <HiCreditCard /> Pay Invoice (${inv.total?.toFixed(2)})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {viewInvoiceReceipt && (
        <div className="modal-overlay" onClick={() => setViewInvoiceReceipt(null)}>
          <div className="modal-card receipt-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header no-print">
              <div className="mh-title">
                <HiDocumentReport className="mh-icon green" />
                <div>
                  <h3>Official Dallas Service Receipt</h3>
                  <p>Invoice #{viewInvoiceReceipt.id}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-modal-cancel" onClick={handlePrint}>
                  <HiPrinter /> Print
                </button>
                <button className="modal-close-btn" onClick={() => setViewInvoiceReceipt(null)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="receipt-paper" id="printable-receipt">
              <div className="rp-brand-header">
                <div>
                  <h2>Clean America Dallas</h2>
                  <p>Certified Professional Cleaning Services</p>
                  <span>Dallas, Texas Metro Area • (214) 555-0100</span>
                </div>
                <div className="rp-status-seal">
                  <span className={viewInvoiceReceipt.status}>{viewInvoiceReceipt.status?.toUpperCase()}</span>
                </div>
              </div>

              <hr className="rp-divider" />

              <div className="rp-info-grid">
                <div>
                  <strong>Billed To:</strong>
                  <p>{viewInvoiceReceipt.customerName}</p>
                  <p>Dallas, TX Metro Area</p>
                </div>
                <div>
                  <strong>Invoice Details:</strong>
                  <p>Invoice #: {viewInvoiceReceipt.id}</p>
                  <p>Order #: {viewInvoiceReceipt.orderId}</p>
                  <p>Date Issued: {viewInvoiceReceipt.issuedDate}</p>
                  {viewInvoiceReceipt.paidAt && <p>Paid On: {new Date(viewInvoiceReceipt.paidAt).toLocaleDateString()}</p>}
                </div>
              </div>

              <table className="rp-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {viewInvoiceReceipt.lineItems?.map((li, idx) => (
                    <tr key={idx}>
                      <td>{li.description}</td>
                      <td style={{ textAlign: 'right' }}>${li.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="rp-total-block">
                <div className="rpt-row">
                  <span>Subtotal</span>
                  <span>${viewInvoiceReceipt.amount?.toFixed(2)}</span>
                </div>
                <div className="rpt-row">
                  <span>Texas Tax (8.25%)</span>
                  <span>${viewInvoiceReceipt.tax?.toFixed(2)}</span>
                </div>
                <div className="rpt-row total">
                  <span>Total Settled</span>
                  <strong>${viewInvoiceReceipt.total?.toFixed(2)}</strong>
                </div>
              </div>

              <div className="rp-footer-stamp">
                <HiShieldCheck style={{ width: 18, height: 18, color: '#10b981' }} />
                <span>Thank you for choosing Clean America Dallas. 100% Satisfaction Guaranteed.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      <PaymentModal
        isOpen={!!selectedInvoiceForPay}
        invoice={selectedInvoiceForPay}
        onClose={() => setSelectedInvoiceForPay(null)}
      />
    </div>
  );
}
