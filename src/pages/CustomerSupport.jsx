import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import ComplaintModal from '../components/ComplaintModal';
import {
  HiSupport, HiPlus, HiCheckCircle, HiClock, HiExclamationCircle,
  HiShieldCheck, HiPhone, HiMail, HiChatAlt2, HiChevronRight
} from 'react-icons/hi';
import './CustomerSupport.css';

export default function CustomerSupport() {
  const user = useAuthStore(s => s.user);
  const complaints = useStore(s => s.complaints) || [];

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'open' | 'resolved'
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  const customerTickets = complaints.filter(c => c.customerId === user?.id || !user);

  const filteredTickets = customerTickets.filter(t => {
    if (activeTab === 'open' && t.status === 'resolved') return false;
    if (activeTab === 'resolved' && t.status !== 'resolved') return false;
    return true;
  });

  return (
    <div className="support-page">
      {/* HEADER */}
      <div className="support-header">
        <div>
          <div className="sh-eyebrow">
            <HiShieldCheck className="she-icon" /> Dallas 24/7 Service Resolution
          </div>
          <h1>Support & Service Requests</h1>
          <p>Submit complaints, request re-cleans, or contact your dedicated Dallas support manager.</p>
        </div>
        <button className="new-ticket-btn" onClick={() => setIsComplaintModalOpen(true)}>
          <HiPlus style={{ width: 18, height: 18 }} /> Submit New Request
        </button>
      </div>

      {/* QUICK CONTACT CARDS */}
      <div className="support-channels-grid">
        <div className="sc-card">
          <div className="sc-icon-wrap purple">
            <HiPhone className="sc-icon" />
          </div>
          <div>
            <strong>Dallas Express Hotline</strong>
            <span>(214) 555-0100 (24/7 Support)</span>
          </div>
        </div>

        <div className="sc-card">
          <div className="sc-icon-wrap green">
            <HiChatAlt2 className="sc-icon" />
          </div>
          <div>
            <strong>Resolution Guarantee</strong>
            <span>100% Free Re-Clean within 24h</span>
          </div>
        </div>

        <div className="sc-card">
          <div className="sc-icon-wrap blue">
            <HiMail className="sc-icon" />
          </div>
          <div>
            <strong>Email Manager</strong>
            <span>support@cleanamericadallas.com</span>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="support-controls">
        <div className="support-tabs">
          <button
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Tickets ({customerTickets.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            Active Tickets ({customerTickets.filter(t => t.status !== 'resolved').length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
          >
            Resolved ({customerTickets.filter(t => t.status === 'resolved').length})
          </button>
        </div>
      </div>

      {/* TICKETS LIST */}
      {filteredTickets.length === 0 ? (
        <div className="support-empty-card">
          <HiSupport className="sec-icon" />
          <h2>No Support Tickets Recorded</h2>
          <p>If you experience any quality, scheduling, or billing issue, open a request here for immediate resolution.</p>
          <button className="btn-primary-purple" onClick={() => setIsComplaintModalOpen(true)}>
            Submit Service Request
          </button>
        </div>
      ) : (
        <div className="tickets-list">
          {filteredTickets.map(ticket => {
            const isOpen = ticket.status === 'open';
            const isInReview = ticket.status === 'in_review';
            const isResolved = ticket.status === 'resolved';

            return (
              <div key={ticket.id} className={`ticket-card ${ticket.status}`}>
                <div className="tc-header">
                  <div className="tc-title-wrap">
                    <span className="tc-id">Ticket #{ticket.id}</span>
                    <h3>{ticket.subject}</h3>
                    <span className="tc-sub">
                      Order #: {ticket.orderId} • Category: {ticket.category?.toUpperCase()} • Priority: {ticket.priority?.toUpperCase()}
                    </span>
                  </div>
                  <span className={`tc-status-badge ${ticket.status}`}>
                    {isOpen && '🟢 Open Ticket'}
                    {isInReview && '⏳ Under Review'}
                    {isResolved && '✅ Resolved'}
                  </span>
                </div>

                <div className="tc-body">
                  <p className="tc-desc">{ticket.description}</p>

                  {/* UPDATE TIMELINE */}
                  {ticket.updates && ticket.updates.length > 0 && (
                    <div className="tc-updates-box">
                      <strong>Resolution Timeline & Log:</strong>
                      <div className="tcu-list">
                        {ticket.updates.map((u, idx) => (
                          <div key={idx} className="tcu-item">
                            <span className="tcu-time">{new Date(u.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                            <span className="tcu-text">{u.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="tc-footer">
                  <span>Created {new Date(ticket.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span className="tc-guarantee-tag">Dallas 100% Satisfaction Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* COMPLAINT MODAL */}
      <ComplaintModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      />
    </div>
  );
}
