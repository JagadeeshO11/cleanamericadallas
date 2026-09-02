import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
  HiX, HiCreditCard, HiCheckCircle, HiShieldCheck, HiLockClosed, HiCash, HiSparkles
} from 'react-icons/hi';
import './PaymentModal.css';

export default function PaymentModal({ isOpen, invoice, onClose, onSuccess }) {
  const payInvoice = useStore(s => s.payInvoice);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '921',
    name: 'Sarah Connor',
  });
  const [processing, setProcessing] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      payInvoice(invoice.id, {
        method: paymentMethod === 'card' ? `Visa (${cardDetails.number.slice(-4)})` : paymentMethod === 'apple' ? 'Apple Pay' : 'Pay After Service',
      });
      setProcessing(false);
      setPaidSuccess(true);

      setTimeout(() => {
        setPaidSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card pay-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="mh-title">
            <HiCreditCard className="mh-icon green" />
            <div>
              <h3>Complete Service Payment</h3>
              <p>Invoice #{invoice.id} • {invoice.serviceName}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <HiX />
          </button>
        </div>

        {paidSuccess ? (
          <div className="modal-success-state">
            <HiCheckCircle className="mss-icon green" />
            <h2>Payment Successful!</h2>
            <p>Payment of <strong>${invoice.total?.toFixed(2)}</strong> has been settled for Invoice #{invoice.id}. Your receipt has been updated in your portal.</p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="modal-body-form">
            <div className="pay-summary-box">
              <div className="psb-row">
                <span>Subtotal</span>
                <span>${invoice.amount?.toFixed(2)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="psb-row discount">
                  <span>Dallas Discount</span>
                  <span>-${invoice.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="psb-row">
                <span>Texas State Tax (8.25%)</span>
                <span>${invoice.tax?.toFixed(2)}</span>
              </div>
              <div className="psb-row total">
                <span>Total Due Now</span>
                <strong>${invoice.total?.toFixed(2)}</strong>
              </div>
            </div>

            <div className="form-group">
              <label>Select Payment Method</label>
              <div className="pay-method-options">
                <button
                  type="button"
                  className={`pm-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <HiCreditCard /> Credit / Debit Card
                </button>
                <button
                  type="button"
                  className={`pm-btn ${paymentMethod === 'apple' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('apple')}
                >
                   Apple Pay / GPay
                </button>
                <button
                  type="button"
                  className={`pm-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  <HiCash /> Cash / Check on Completion
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-fields-group">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Security Code (CVV)</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardDetails.cvv}
                      onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pay-security-badge">
              <HiLockClosed style={{ color: '#10b981' }} /> 256-Bit SSL Encryption • Instant Dallas Receipt
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-modal-cancel" onClick={onClose} disabled={processing}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit" disabled={processing}>
                {processing ? 'Processing Payment...' : `Pay $${invoice.total?.toFixed(2)} Now`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
