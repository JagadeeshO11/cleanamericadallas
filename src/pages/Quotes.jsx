import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import RequestQuoteModal from '../components/RequestQuoteModal';
import {
  HiCalculator, HiPlus, HiCheckCircle, HiX, HiClock, HiCalendar,
  HiCurrencyDollar, HiCheck, HiOutlineDocumentText, HiSparkles, HiChevronRight, HiPhone
} from 'react-icons/hi';
import './Quotes.css';

export default function Quotes() {
  const user = useAuthStore(s => s.user);
  const quotes = useStore(s => s.quotes) || [];
  const approveQuote = useStore(s => s.approveQuote);
  const declineQuote = useStore(s => s.declineQuote);

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'quoted' | 'approved' | 'pending'
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  
  // Schedule & Approve Modal State
  const [selectedQuoteForApprove, setSelectedQuoteForApprove] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    time: '09:00 AM',
  });

  const customerQuotes = quotes.filter(q => q.customerId === user?.id || !user);

  const filteredQuotes = customerQuotes.filter(q => {
    if (activeTab === 'quoted') return q.status === 'quoted';
    if (activeTab === 'approved') return q.status === 'approved';
    if (activeTab === 'pending') return q.status === 'pending_quote';
    return true;
  });

  const handleOpenApproveModal = (quote) => {
    setSelectedQuoteForApprove(quote);
    setScheduleData({
      date: quote.preferredDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      time: quote.preferredTime || '09:00 AM',
    });
  };

  const handleConfirmApproval = () => {
    if (!selectedQuoteForApprove) return;
    approveQuote(selectedQuoteForApprove.id, scheduleData);
    setSelectedQuoteForApprove(null);
  };

  return (
    <div className="quotes-page">
      {/* HEADER BANNER */}
      <div className="quotes-header">
        <div>
          <div className="qh-eyebrow">
            <HiSparkles className="qhe-icon" /> Dallas Custom Estimations
          </div>
          <h1>Service Quotations Hub</h1>
          <p>Request custom cleaning quotes, review itemized price proposals, approve & schedule Dallas pros.</p>
        </div>
        <button className="new-quote-btn" onClick={() => setIsQuoteModalOpen(true)}>
          <HiPlus style={{ width: 18, height: 18 }} /> Request New Quote
        </button>
      </div>

      {/* TAB CONTROL BAR */}
      <div className="quotes-controls">
        <div className="quotes-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Quotes ({customerQuotes.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'quoted' ? 'active' : ''}`}
            onClick={() => setActiveTab('quoted')}
          >
            Ready for Approval ({customerQuotes.filter(q => q.status === 'quoted').length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved ({customerQuotes.filter(q => q.status === 'approved').length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Under Review ({customerQuotes.filter(q => q.status === 'pending_quote').length})
          </button>
        </div>
      </div>

      {/* QUOTES LIST */}
      {filteredQuotes.length === 0 ? (
        <div className="quotes-empty-card">
          <HiCalculator className="qec-icon" />
          <h2>No Service Quotes Found</h2>
          <p>Request a custom estimate for your Dallas home, office, or commercial space.</p>
          <button className="btn-primary-gold" onClick={() => setIsQuoteModalOpen(true)}>
            Request Cleaning Quote
          </button>
        </div>
      ) : (
        <div className="quotes-grid">
          {filteredQuotes.map(quote => {
            const isQuoted = quote.status === 'quoted';
            const isApproved = quote.status === 'approved';
            const isPending = quote.status === 'pending_quote';
            const isDeclined = quote.status === 'declined';

            return (
              <div key={quote.id} className={`quote-card ${quote.status}`}>
                {/* CARD TOP HEADER */}
                <div className="qc-header">
                  <div className="qc-title-wrap">
                    <span className="qc-id">Quote #{quote.id}</span>
                    <h3>{quote.serviceType}</h3>
                    <span className="qc-meta">{quote.propertyType} • {quote.propertySize}</span>
                  </div>
                  <div className={`qc-status-badge ${quote.status}`}>
                    {isQuoted && '📄 Quote Ready'}
                    {isApproved && '✅ Approved & Scheduled'}
                    {isPending && '⏳ Calculating Quote'}
                    {isDeclined && '❌ Declined'}
                  </div>
                </div>

                {/* CARD BODY DETAILS */}
                <div className="qc-body">
                  <div className="qc-info-grid">
                    <div className="qci-item">
                      <HiCalendar className="qci-icon" />
                      <div>
                        <span>Preferred Date</span>
                        <strong>{quote.preferredDate || 'Flexible'}</strong>
                      </div>
                    </div>

                    <div className="qci-item">
                      <HiClock className="qci-icon" />
                      <div>
                        <span>Frequency</span>
                        <strong>{quote.frequency}</strong>
                      </div>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="qc-notes-box">
                      <strong>Special Requirements:</strong>
                      <p>{quote.notes}</p>
                    </div>
                  )}

                  {/* PRICE BREAKDOWN PROPOSAL (IF QUOTED OR APPROVED) */}
                  {quote.priceDetails && (
                    <div className="qc-proposal-box">
                      <div className="qcp-header">
                        <span>Itemized Price Breakdown</span>
                        <span className="qcp-valid">Valid until {quote.validUntil || '2 Weeks'}</span>
                      </div>
                      <div className="qcp-line-items">
                        <div className="qcp-row">
                          <span>Base Cleaning Service</span>
                          <span>${quote.priceDetails.basePrice?.toFixed(2)}</span>
                        </div>
                        {quote.priceDetails.additions?.map((add, idx) => (
                          <div key={idx} className="qcp-row add">
                            <span>+ {add.name}</span>
                            <span>${add.cost?.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="qcp-row total">
                          <span>Total Quotation Amount</span>
                          <strong>${quote.priceDetails.total?.toFixed(2)}</strong>
                        </div>
                      </div>
                      <div className="qcp-footer">
                        <span>⏱️ Estimated Time: {quote.priceDetails.estimatedHours}</span>
                        <span>👷 {quote.priceDetails.recommendedPros}</span>
                      </div>
                    </div>
                  )}

                  {isPending && (
                    <div className="qc-pending-banner">
                      <HiClock className="qpb-icon" />
                      <div>
                        <strong>Our Dallas estimator is calculating your proposal</strong>
                        <p>You will receive an instant itemized breakdown notification within 15-30 minutes.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CARD ACTIONS */}
                <div className="qc-footer">
                  {isQuoted && (
                    <div className="qc-action-row">
                      <button
                        className="btn-decline"
                        onClick={() => declineQuote(quote.id)}
                      >
                        Decline Quote
                      </button>
                      <button
                        className="btn-approve-schedule"
                        onClick={() => handleOpenApproveModal(quote)}
                      >
                        <HiCheck /> Approve & Schedule Service
                      </button>
                    </div>
                  )}

                  {isApproved && (
                    <div className="qc-approved-row">
                      <span className="qar-text">
                        <HiCheckCircle style={{ color: '#10b981', verticalAlign: 'middle' }} /> Converted to active scheduled booking
                      </span>
                    </div>
                  )}

                  {isPending && (
                    <span className="qcp-status-sub">Estimating in progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* APPROVE & SCHEDULE SERVICE MODAL */}
      {selectedQuoteForApprove && (
        <div className="modal-overlay" onClick={() => setSelectedQuoteForApprove(null)}>
          <div className="modal-card schedule-approve-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="mh-title">
                <HiCalendar className="mh-icon gold" />
                <div>
                  <h3>Approve Service & Set Schedule</h3>
                  <p>Quote #{selectedQuoteForApprove.id} • ${selectedQuoteForApprove.priceDetails?.total?.toFixed(2)}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedQuoteForApprove(null)}>
                <HiX />
              </button>
            </div>

            <div className="modal-body-form">
              <div className="quote-summary-mini">
                <strong>{selectedQuoteForApprove.serviceType}</strong>
                <span>{selectedQuoteForApprove.propertyType} ({selectedQuoteForApprove.propertySize})</span>
                <div className="qsm-price">${selectedQuoteForApprove.priceDetails?.total?.toFixed(2)}</div>
              </div>

              <div className="form-group">
                <label>Confirm Appointment Date</label>
                <input
                  type="date"
                  value={scheduleData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setScheduleData({ ...scheduleData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Select Arrival Time Window</label>
                <select
                  value={scheduleData.time}
                  onChange={e => setScheduleData({ ...scheduleData, time: e.target.value })}
                >
                  <option value="08:00 AM">08:00 AM - 10:00 AM</option>
                  <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                  <option value="01:00 PM">01:00 PM - 03:00 PM</option>
                  <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                </select>
              </div>

              <div className="modal-footer-actions">
                <button className="btn-modal-cancel" onClick={() => setSelectedQuoteForApprove(null)}>
                  Cancel
                </button>
                <button className="btn-modal-submit gold" onClick={handleConfirmApproval}>
                  <HiCheckCircle /> Confirm Approval & Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST QUOTE MODAL */}
      <RequestQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
