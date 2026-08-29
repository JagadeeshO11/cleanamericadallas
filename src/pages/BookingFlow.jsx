import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { allVehicles } from '../data/vehicles';
import { services } from '../data/services';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  HiArrowLeft, HiArrowRight, HiLocationMarker, HiCalendar, HiClock,
  HiDocumentText, HiCheckCircle, HiShieldCheck, HiCurrencyDollar,
} from 'react-icons/hi';
import { MdOutlineVerified, MdGpsFixed } from 'react-icons/md';
import { GiAutoRepair } from 'react-icons/gi';
import './BookingFlow.css';

const FALLBACK = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80';
const catalog = [...allVehicles, ...services];

export default function BookingFlow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const placeOrder = useStore(s => s.placeOrder);
  const addToCart = useStore(s => s.addToCart);
  const user = useAuthStore(s => s.user);

  const [form, setForm] = useState({ location: 'Dallas, TX', date: '', duration: 1, notes: '' });
  const [step, setStep] = useState(1);

  const vehicle = catalog.find(v => v.id === id);
  if (!vehicle) return <div className="not-found">Service not found.</div>;

  const total = vehicle.rate * form.duration;

  const handleBook = () => {
    if (!user || user.role !== 'customer') {
      navigate('/customer/signin', { replace: true });
      return;
    }
    const customer = { id: user.id, name: user.name, phone: user.phone };
    const order = placeOrder(vehicle, { ...form, total }, customer);
    navigate(`/customer/track/${order.id}`);
  };

  const handleAddToCart = () => {
    if (!user || user.role !== 'customer') {
      navigate('/customer/signin', { replace: true });
      return;
    }
    addToCart(vehicle, { ...form, total });
    navigate('/customer/cart');
  };

  const FEATURES = [
    { Icon: MdOutlineVerified, text: 'Vetted & Insured Pro' },
    { Icon: HiShieldCheck, text: '100% Satisfaction Guarantee' },
    { Icon: MdGpsFixed, text: 'Live GPS Tracking' },
    { Icon: GiAutoRepair, text: '24/7 Dallas Support' },
  ];

  return (
    <div className="booking-flow">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <HiArrowLeft style={{ width: 16, height: 16 }} /> Back
      </button>

      <div className="booking-layout">
        <div className="booking-form-wrap">
          <div className="booking-steps">
            <span className={step >= 1 ? 'done' : ''}><span className="step-circle">1</span> Service Details</span>
            <span className="sep-line" />
            <span className={step >= 2 ? 'done' : ''}><span className="step-circle">2</span> Confirm & Schedule</span>
          </div>

          {step === 1 && (
            <div className="form-section">
              <h2>Service Location & Date</h2>
              <label>
                <span className="lbl-text"><HiLocationMarker className="lbl-icon" /> Address in Dallas Metro</span>
                <input
                  placeholder="Street address, City, ZIP code"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                />
              </label>
              <label>
                <span className="lbl-text"><HiCalendar className="lbl-icon" /> Appointment Date</span>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </label>
              <label>
                <span className="lbl-text"><HiClock className="lbl-icon" /> Service Quantity ({vehicle.unit})</span>
                <div className="duration-ctrl">
                  <button onClick={() => setForm(f => ({ ...f, duration: Math.max(1, f.duration - 1) }))}>−</button>
                  <span>{form.duration} {vehicle.unit}</span>
                  <button onClick={() => setForm(f => ({ ...f, duration: f.duration + 1 }))}>+</button>
                </div>
              </label>
              <label>
                <span className="lbl-text"><HiDocumentText className="lbl-icon" /> Entry Code or Instructions</span>
                <textarea
                  placeholder="Gate code, parking notes, specific requests..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={3}
                />
              </label>
              <button className="btn-primary" disabled={!form.location || !form.date} onClick={() => setStep(2)}>
                Continue <HiArrowRight style={{ width: 16, height: 16 }} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h2>Confirm Appointment</h2>
              <div className="confirm-details">
                <div className="cd-row">
                  <span><HiLocationMarker className="cd-icon" /> Address</span>
                  <strong>{form.location}</strong>
                </div>
                <div className="cd-row">
                  <span><HiCalendar className="cd-icon" /> Date</span>
                  <strong>{form.date}</strong>
                </div>
                <div className="cd-row">
                  <span><HiClock className="cd-icon" /> Quantity</span>
                  <strong>{form.duration} {vehicle.unit}</strong>
                </div>
                {form.notes && (
                  <div className="cd-row">
                    <span><HiDocumentText className="cd-icon" /> Instructions</span>
                    <strong>{form.notes}</strong>
                  </div>
                )}
              </div>

              <div className="payment-info">
                <h3><HiCurrencyDollar style={{ width: 18, height: 18, verticalAlign: 'middle' }} /> Pricing Summary</h3>
                <div className="pay-row">
                  <span>Rate</span>
                  <span>${vehicle.rate} / {vehicle.unit}</span>
                </div>
                <div className="pay-row">
                  <span>Quantity</span>
                  <span>× {form.duration}</span>
                </div>
                <div className="pay-row total">
                  <span>Estimated Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <div className="confirm-actions">
                <button className="btn-outline" onClick={() => setStep(1)}>
                  <HiArrowLeft style={{ width: 15, height: 15 }} /> Edit
                </button>
                <button className="btn-outline" onClick={handleAddToCart}>
                  🛒 Add to Cart
                </button>
                <button className="btn-primary" onClick={handleBook}>
                  <HiCheckCircle style={{ width: 17, height: 17 }} /> Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="vehicle-summary">
          <div className="vs-img-wrap">
            <img src={vehicle.image || FALLBACK} alt={vehicle.name} className="vs-img" onError={e => { e.target.src = FALLBACK; }} />
          </div>
          <div className="vs-body">
            <h3>{vehicle.name}</h3>
            <p>{vehicle.desc}</p>
            <div className="vs-rate">${vehicle.rate} <span>/ {vehicle.unit}</span></div>
            <div className="vs-features">
              {FEATURES.map(({ Icon, text }) => (
                <div key={text} className="vs-feat">
                  <Icon className="vs-feat-icon" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
