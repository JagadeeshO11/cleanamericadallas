import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  HiX, HiStar, HiCheckCircle, HiSparkles, HiHeart, HiCurrencyDollar
} from 'react-icons/hi';
import './ReviewModal.css';

export default function ReviewModal({ isOpen, order, onClose, onSuccess }) {
  const user = useAuthStore(s => s.user);
  const submitReview = useStore(s => s.submitReview);

  const [rating, setRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState(10);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitReview({
      orderId: order.id,
      customerId: user?.id || 'c1',
      customerName: user?.name || 'Sarah Connor',
      workerId: order.operator?.id || 'w1',
      workerName: order.operator?.name || 'Dallas Pro',
      rating,
      qualityRating,
      punctualityRating,
      comment,
      tipAmount: Number(tipAmount) || 0,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card review-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="mh-title">
            <HiStar className="mh-icon gold" />
            <div>
              <h3>Leave Service Review & Rating</h3>
              <p>Booking #{order.id} • {order.vehicle?.name}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <HiX />
          </button>
        </div>

        {submitted ? (
          <div className="modal-success-state">
            <HiCheckCircle className="mss-icon green" />
            <h2>Review Submitted!</h2>
            <p>Thank you for rating our Dallas certified pro! Your feedback helps us maintain 5-star service excellence across Dallas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body-form">
            {/* Pro Spotlight Card */}
            <div className="pro-spotlight-mini">
              <div className="psm-avatar">
                {order.operator?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <strong>{order.operator?.name || 'Assigned Dallas Pro'}</strong>
                <span>Certified Specialist • {order.vehicle?.name}</span>
              </div>
            </div>

            {/* Overall Star Rating */}
            <div className="star-rating-picker">
              <label>Overall Experience Rating</label>
              <div className="stars-row">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= rating ? 'selected' : ''}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span className="star-rating-label">
                {rating === 5 ? '🌟 Exceptional 5-Star Clean!' : rating === 4 ? '👍 Very Good Service' : rating === 3 ? '👌 Satisfactory' : 'Needs Improvement'}
              </span>
            </div>

            {/* Sub ratings */}
            <div className="sub-ratings-grid">
              <div className="form-group">
                <label>Quality & Attention to Detail</label>
                <select value={qualityRating} onChange={e => setQualityRating(Number(e.target.value))}>
                  <option value={5}>5 Stars - Immaculate</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                </select>
              </div>

              <div className="form-group">
                <label>Punctuality & Communication</label>
                <select value={punctualityRating} onChange={e => setPunctualityRating(Number(e.target.value))}>
                  <option value={5}>5 Stars - On Time & Polite</option>
                  <option value={4}>4 Stars - Satisfactory</option>
                  <option value={3}>3 Stars - Slight Delay</option>
                </select>
              </div>
            </div>

            {/* Comment */}
            <div className="form-group">
              <label>Your Review & Feedback</label>
              <textarea
                rows={3}
                placeholder="Share your experience with the Dallas service crew..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
            </div>

            {/* Tip Option */}
            <div className="tip-picker-section">
              <label><HiHeart style={{ color: '#ef4444' }} /> Add Pro Tip for Dallas Crew</label>
              <div className="tip-pills">
                {[0, 5, 10, 15, 20].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`tip-pill ${tipAmount === amt ? 'active' : ''}`}
                    onClick={() => setTipAmount(amt)}
                  >
                    {amt === 0 ? 'No Tip' : `$${amt}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer-actions">
              <button type="button" className="btn-modal-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-modal-submit gold">
                <HiSparkles /> Submit Review {tipAmount > 0 ? `+ $${tipAmount} Tip` : ''}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
