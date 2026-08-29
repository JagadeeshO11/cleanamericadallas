import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import './OrderTracking.css';

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useStore(s => s.orders);
  const advanceStage = useStore(s => s.advanceStage);
  const user = useAuthStore(s => s.user);

  const order = orders.find(o => o.id === id);

  useEffect(() => {
    if (!order || order.stage >= order.stages.length - 1) return;
    const timer = setTimeout(() => advanceStage(id), 4000);
    return () => clearTimeout(timer);
  }, [order?.stage, id, advanceStage]);

  if (!order) {
    return (
      <div className="not-found">
        <p>Booking not found.</p>
        <button onClick={() => navigate('/customer/orders')}>View My Bookings</button>
      </div>
    );
  }

  const isComplete = order.stage === order.stages.length - 1;

  return (
    <div className="tracking-page">
      <button className="back-btn" onClick={() => navigate('/customer/orders')}>← My Bookings</button>

      <div className="tracking-layout">
        <div className="tracking-main">
          <div className="order-header">
            <div>
              <div className="order-id">Booking #{order.id}</div>
              <div className="order-time">Placed at {order.placedAt}</div>
            </div>
            <div className={`status-badge ${isComplete ? 'complete' : 'active'}`}>
              {isComplete ? '✅ Service Complete' : '🔴 Live Tracking'}
            </div>
          </div>

          <div className="progress-tracker">
            {order.stages.map((stage, i) => (
              <div key={i} className={`stage ${i <= order.stage ? 'done' : ''} ${i === order.stage ? 'current' : ''}`}>
                <div className="stage-dot">{i < order.stage ? '✓' : i === order.stage ? '●' : '○'}</div>
                <div className="stage-info">
                  <span className="stage-name">{stage}</span>
                  {i === order.stage && !isComplete && <span className="stage-sub">In progress...</span>}
                  {i < order.stage && <span className="stage-sub">Done</span>}
                </div>
                {i < order.stages.length - 1 && <div className={`stage-line ${i < order.stage ? 'filled' : ''}`} />}
              </div>
            ))}
          </div>

          <div className="booking-summary">
            <h3>Appointment Details</h3>
            <div className="bs-row">
              <span>📍 Service Address</span>
              <strong>{order.booking?.location}</strong>
            </div>
            <div className="bs-row">
              <span>📅 Scheduled Date</span>
              <strong>{order.booking?.date}</strong>
            </div>
            <div className="bs-row">
              <span>⏱ Quantity</span>
              <strong>{order.booking?.duration} {order.vehicle?.unit}</strong>
            </div>
            <div className="bs-row total">
              <span>💰 Estimated Total</span>
              <strong>${order.booking?.total?.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        <div className="operator-card">
          <h3>Your Assigned Dallas Pro</h3>
          <div className="op-avatar">👷</div>
          <div className="op-name">{order.operator?.name ?? 'Assigning Pro...'}</div>
          <div className="op-rating">⭐ {order.operator?.rating ?? '4.9'}</div>
          <div className="op-vehicle">{order.operator?.vehicle ?? 'Certified Service Pro'}</div>
          {order.operator?.phone ? (
            <a href={`tel:${order.operator.phone}`} className="call-btn">📞 Call Pro ({order.operator.phone})</a>
          ) : (
            <div className="call-btn disabled">📞 Pro being assigned...</div>
          )}
          <div className="vehicle-info">
            <div className="vi-icon">🏠</div>
            <div>
              <strong>{order.vehicle?.name ?? 'Service'}</strong>
              <p>{order.vehicle?.desc ?? ''}</p>
            </div>
          </div>
          {!isComplete && (
            <div className="eta-box">
              <div className="eta-label">Estimated Arrival Window</div>
              <div className="eta-time">~{Math.max(10, (order.stages.length - 1 - order.stage) * 12)} mins</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
