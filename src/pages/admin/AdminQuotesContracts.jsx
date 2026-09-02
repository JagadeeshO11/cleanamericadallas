import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  HiCalculator, HiDocumentText, HiPlus, HiCheckCircle, HiClock,
  HiCurrencyDollar, HiCheck, HiX, HiSparkles, HiUser, HiOfficeBuilding
} from 'react-icons/hi';
import './Admin.css';

export default function AdminQuotesContracts() {
  const quotes = useStore(s => s.quotes) || [];
  const contracts = useStore(s => s.contracts) || [];
  const issueAdminQuotePrice = useStore(s => s.issueAdminQuotePrice);
  const createContract = useStore(s => s.createContract);

  const [activeTab, setActiveTab] = useState('quotes'); // 'quotes' | 'contracts'
  const [selectedQuoteToPrice, setSelectedQuoteToPrice] = useState(null);
  const [quotePriceForm, setQuotePriceForm] = useState({
    basePrice: 200,
    additionName: 'Deep Sanitization & Eco Products',
    additionCost: 45,
    estimatedHours: '3.5 hours',
  });

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractForm, setContractForm] = useState({
    customerName: 'Dallas Commercial Tech Suite',
    companyName: 'Tech Park Dallas LLC',
    serviceType: 'Daily Office Sanitation & Cleaning',
    frequency: 'Mon-Fri Daily',
    monthlyValue: 2400,
  });

  const pendingQuotes = quotes.filter(q => q.status === 'pending_quote');
  const activeContractsValue = contracts.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);

  const handleIssueQuote = (e) => {
    e.preventDefault();
    if (!selectedQuoteToPrice) return;
    const base = Number(quotePriceForm.basePrice) || 200;
    const addCost = Number(quotePriceForm.additionCost) || 0;
    const total = base + addCost;

    issueAdminQuotePrice(selectedQuoteToPrice.id, {
      basePrice: base,
      additions: quotePriceForm.additionName ? [{ name: quotePriceForm.additionName, cost: addCost }] : [],
      total,
      estimatedHours: quotePriceForm.estimatedHours,
      recommendedPros: 'Dallas Master Cleaning Crew'
    });

    setSelectedQuoteToPrice(null);
  };

  const handleCreateContractSubmit = (e) => {
    e.preventDefault();
    createContract(contractForm);
    setIsContractModalOpen(false);
  };

  return (
    <div className="admin-page">
      <div className="dash-welcome">
        <h1>Estimations, Quotes & Contracts Hub</h1>
        <p>Issue price quotes for customer requests and manage recurring commercial service agreements.</p>
      </div>

      {/* TOP METRICS */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card orange">
          <div className="sc-top">
            <div className="sc-val">{pendingQuotes.length}</div>
            <div className="sc-icon-wrap orange"><HiClock className="sc-icon" /></div>
          </div>
          <div className="sc-label">Pending Quote Requests</div>
        </div>

        <div className="stat-card green">
          <div className="sc-top">
            <div className="sc-val">${activeContractsValue.toLocaleString()}</div>
            <div className="sc-icon-wrap green"><HiCurrencyDollar className="sc-icon" /></div>
          </div>
          <div className="sc-label">Monthly Active Contracts Value</div>
        </div>

        <div className="stat-card blue">
          <div className="sc-top">
            <div className="sc-val">{contracts.length}</div>
            <div className="sc-icon-wrap blue"><HiDocumentText className="sc-icon" /></div>
          </div>
          <div className="sc-label">Active Service Agreements</div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="orders-controls" style={{ marginBottom: 24 }}>
        <div className="orders-tabs">
          <button
            className={`tab-btn ${activeTab === 'quotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            📋 Quotation Proposals ({quotes.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'contracts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contracts')}
          >
            📜 Commercial Contracts ({contracts.length})
          </button>
        </div>

        {activeTab === 'contracts' && (
          <button
            className="new-booking-btn"
            onClick={() => setIsContractModalOpen(true)}
            style={{ background: '#10b981' }}
          >
            <HiPlus /> New Commercial Contract
          </button>
        )}
      </div>

      {/* TAB 1: QUOTATIONS LIST */}
      {activeTab === 'quotes' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16 }}>
          <h3>Dallas Quote Requests & Issued Proposals</h3>
          {quotes.length === 0 ? (
            <div className="empty-msg">No customer quote requests recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
              {quotes.map(q => (
                <div key={q.id} className="job-item" style={{ background: '#09090b', padding: 16, borderRadius: 12 }}>
                  <div className="ji-left">
                    <div>
                      <span className="mono" style={{ color: '#f59e0b', fontWeight: 'bold' }}>Quote #{q.id}</span>
                      <h4 style={{ color: '#fff', margin: '4px 0' }}>{q.serviceType}</h4>
                      <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.85rem' }}>
                        Customer: {q.customerName} • Property: {q.propertyType} ({q.propertySize})
                      </p>
                    </div>
                  </div>
                  <div className="ji-right" style={{ alignItems: 'flex-end', gap: 8 }}>
                    <div className="ji-amount" style={{ color: '#f59e0b' }}>
                      {q.priceDetails ? `$${q.priceDetails.total}` : 'Pending Quote'}
                    </div>
                    <span className={`status-chip ${q.status}`}>{q.status}</span>
                    {q.status === 'pending_quote' && (
                      <button
                        className="btn-action-gold"
                        style={{ marginTop: 6 }}
                        onClick={() => {
                          setSelectedQuoteToPrice(q);
                          setQuotePriceForm({ basePrice: 220, additionName: 'Deep Sanitation', additionCost: 40, estimatedHours: '3.5h' });
                        }}
                      >
                        <HiCalculator /> Issue Price Proposal
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONTRACTS LIST */}
      {activeTab === 'contracts' && (
        <div className="recent-orders-list" style={{ background: '#18181b', padding: 20, borderRadius: 16 }}>
          <h3>Commercial & Recurring Service Contracts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {contracts.map(c => (
              <div key={c.id} className="job-item" style={{ background: '#09090b', padding: 16, borderRadius: 12 }}>
                <div className="ji-left">
                  <div>
                    <span className="mono" style={{ color: '#10b981', fontWeight: 'bold' }}>Contract #{c.id}</span>
                    <h4 style={{ color: '#fff', margin: '4px 0' }}>{c.customerName} ({c.companyName})</h4>
                    <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.85rem' }}>
                      Scope: {c.serviceType} • Schedule: {c.frequency}
                    </p>
                  </div>
                </div>
                <div className="ji-right" style={{ alignItems: 'flex-end' }}>
                  <div className="ji-amount" style={{ color: '#10b981' }}>${c.monthlyValue?.toLocaleString()}/mo</div>
                  <span className="status-chip active">Active Agreement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISSUE QUOTE PRICE MODAL */}
      {selectedQuoteToPrice && (
        <div className="modal-overlay" onClick={() => setSelectedQuoteToPrice(null)}>
          <div className="modal-card" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiCalculator className="mh-icon gold" />
                <div>
                  <h3>Calculate & Issue Quote Proposal</h3>
                  <p>Quote #{selectedQuoteToPrice.id} • {selectedQuoteToPrice.serviceType}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedQuoteToPrice(null)}>✕</button>
            </div>

            <form onSubmit={handleIssueQuote} className="modal-body-form">
              <div className="form-group">
                <label>Base Price ($)</label>
                <input
                  type="number"
                  value={quotePriceForm.basePrice}
                  onChange={e => setQuotePriceForm({ ...quotePriceForm, basePrice: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Add-on Service Name</label>
                  <input
                    type="text"
                    value={quotePriceForm.additionName}
                    onChange={e => setQuotePriceForm({ ...quotePriceForm, additionName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Add-on Cost ($)</label>
                  <input
                    type="number"
                    value={quotePriceForm.additionCost}
                    onChange={e => setQuotePriceForm({ ...quotePriceForm, additionCost: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Estimated Execution Time</label>
                <input
                  type="text"
                  value={quotePriceForm.estimatedHours}
                  onChange={e => setQuotePriceForm({ ...quotePriceForm, estimatedHours: e.target.value })}
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setSelectedQuoteToPrice(null)}>Cancel</button>
                <button type="submit" className="btn-modal-submit gold">Send Quote Proposal to Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CONTRACT MODAL */}
      {isContractModalOpen && (
        <div className="modal-overlay" onClick={() => setIsContractModalOpen(false)}>
          <div className="modal-card" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiDocumentText className="mh-icon green" />
                <div>
                  <h3>Execute Commercial Contract</h3>
                  <p>New Commercial Cleaning Agreement</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setIsContractModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateContractSubmit} className="modal-body-form">
              <div className="form-group">
                <label>Customer / Account Name</label>
                <input
                  type="text"
                  value={contractForm.customerName}
                  onChange={e => setContractForm({ ...contractForm, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company / Building Name</label>
                <input
                  type="text"
                  value={contractForm.companyName}
                  onChange={e => setContractForm({ ...contractForm, companyName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Service Scope & Frequency</label>
                <input
                  type="text"
                  value={contractForm.serviceType}
                  onChange={e => setContractForm({ ...contractForm, serviceType: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Monthly Value ($)</label>
                <input
                  type="number"
                  value={contractForm.monthlyValue}
                  onChange={e => setContractForm({ ...contractForm, monthlyValue: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsContractModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-modal-submit" style={{ background: '#10b981' }}>Create Contract</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
