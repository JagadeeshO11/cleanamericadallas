import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  HiTrash, HiArrowRight, HiShoppingCart, HiCheckCircle,
  HiTag, HiShieldCheck, HiPlus, HiMinus, HiLockClosed, HiBadgeCheck
} from 'react-icons/hi';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useStore(s => s.cart);
  const removeFromCart = useStore(s => s.removeFromCart);
  const clearCart = useStore(s => s.clearCart);
  const placeOrder = useStore(s => s.placeOrder);
  const user = useAuthStore(s => s.user);

  const [durations, setDurations] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const getDuration = (item) => durations[item.cartId] || item.booking?.duration || 1;

  const updateDuration = (cartId, delta) => {
    setDurations(prev => {
      const current = prev[cartId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [cartId]: next };
    });
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DALLAS15' || code === 'CLEAN15') {
      setDiscountPercent(15);
      setPromoSuccess('15% Dallas promo discount applied!');
      setPromoError('');
    } else if (code === 'CLEAN10') {
      setDiscountPercent(10);
      setPromoSuccess('10% Discount applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try DALLAS15');
      setPromoSuccess('');
    }
  };

  const subtotal = cart.reduce((sum, item) => {
    const rate = Number(item.vehicle.rate) || 0;
    const duration = getDuration(item);
    return sum + (rate * duration);
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleCheckout = () => {
    if (!user || user.role !== 'customer') {
      navigate('/customer/signin');
      return;
    }
    const customer = { id: user.id, name: user.name, phone: user.phone };
    cart.forEach(item => {
      const updatedBooking = {
        ...item.booking,
        duration: getDuration(item),
      };
      placeOrder(item.vehicle, updatedBooking, customer);
    });
    clearCart();
    navigate('/customer/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-wrapper">
        <div className="cart-empty">
          <HiShoppingCart className="empty-icon" />
          <h2>Your Cart is Empty</h2>
          <p>Explore trusted Dallas home cleaning, plumbing, HVAC & lawn services available today.</p>
          <button className="btn-primary" onClick={() => navigate('/browse')}>
            Explore Dallas Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <div>
          <h1>Shopping Cart ({cart.length})</h1>
          <p className="cart-sub">Dallas Metro certified home services</p>
        </div>
        <button className="clear-btn" onClick={clearCart}>
          <HiTrash style={{ width: 14, height: 14 }} /> Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        {/* Left Main Column: Items List */}
        <div className="cart-items-col">
          <div className="cart-items-card">
            {cart.map((item, idx) => {
              const itemDur = getDuration(item);
              const itemRate = Number(item.vehicle.rate) || 0;
              const itemTotal = itemRate * itemDur;

              return (
                <div key={item.cartId} className={`cart-item-row ${idx < cart.length - 1 ? 'has-border' : ''}`}>
                  <img
                    src={item.vehicle.image}
                    alt={item.vehicle.name}
                    className="cir-img"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&q=80'; }}
                  />

                  <div className="cir-info">
                    <div className="cir-title-row">
                      <h3>{item.vehicle.name}</h3>
                      <span className="cir-badge">Certified Pro</span>
                    </div>

                    <p>{item.vehicle.desc}</p>

                    <div className="cir-meta">
                      <span>📍 {item.booking?.location || 'Dallas, TX'}</span>
                      <span>📅 {item.booking?.date || 'Scheduled Today'}</span>
                    </div>

                    <div className="cir-bottom-row">
                      {/* Quantity Stepper */}
                      <div className="cir-stepper">
                        <button
                          className="cs-btn"
                          onClick={() => updateDuration(item.cartId, -1)}
                          disabled={itemDur <= 1}
                        >
                          <HiMinus style={{ width: 12, height: 12 }} />
                        </button>
                        <span className="cs-val">{itemDur} {item.vehicle.unit || 'hr'}</span>
                        <button
                          className="cs-btn"
                          onClick={() => updateDuration(item.cartId, 1)}
                        >
                          <HiPlus style={{ width: 12, height: 12 }} />
                        </button>
                      </div>

                      <button className="cir-remove-btn" onClick={() => removeFromCart(item.cartId)}>
                        <HiTrash style={{ width: 14, height: 14 }} /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="cir-price-col">
                    <div className="cir-price">${itemTotal.toFixed(2)}</div>
                    <div className="cir-unit">${itemRate}/{item.vehicle.unit || 'hr'}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-continue-wrap">
            <button className="btn-continue" onClick={() => navigate('/browse')}>
              ← Continue Browsing Services
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="cart-summary-col">
          <div className="cart-summary-card">
            <h2>Order Summary</h2>

            <form className="cart-promo-form" onSubmit={handleApplyPromo}>
              <div className="cpf-input-group">
                <HiTag className="cpf-icon" />
                <input
                  type="text"
                  placeholder="Promo code (e.g. DALLAS15)"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                />
                <button type="submit">Apply</button>
              </div>
              {promoSuccess && <div className="cpf-msg success">{promoSuccess}</div>}
              {promoError && <div className="cpf-msg error">{promoError}</div>}
            </form>

            <div className="cs-summary-rows">
              <div className="cs-row">
                <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="cs-row discount">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="cs-row">
                <span>Dallas Service Guarantee Fee</span>
                <span className="free-tag">FREE</span>
              </div>

              <div className="cs-row total">
                <span>Estimated Total</span>
                <strong>${finalTotal.toFixed(2)}</strong>
              </div>
            </div>

            <button className="btn-checkout-primary" onClick={handleCheckout}>
              Proceed to Checkout <HiArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <div className="cart-trust-badges">
              <div className="ctb-item">
                <HiLockClosed className="ctb-icon" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <div className="ctb-item">
                <HiBadgeCheck className="ctb-icon" />
                <span>Clean America 100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
