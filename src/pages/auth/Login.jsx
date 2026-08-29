import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { HiMail, HiLockClosed, HiArrowRight, HiSparkles } from 'react-icons/hi';
import './Auth.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png';

const DEMOS = {
  admin: { email: 'admin@cleanamericadallas.com', password: 'admin123' },
  worker: { email: 'john@cleanamericadallas.com', password: 'worker123' },
  customer: { email: 'customer@cleanamericadallas.com', password: 'cust123' },
};

const CONFIG = {
  customer: {
    title: 'Customer Sign In',
    sub: 'Sign in to book home services in Dallas, TX',
    signup: '/customer/signup',
    home: '/customer/orders',
    icon: '🏠',
  },
  worker: {
    title: 'Dallas Pro Sign In',
    sub: 'Sign in to manage your appointments and earnings',
    signup: '/worker/signup',
    home: '/worker',
    icon: '👷',
  },
  admin: {
    title: 'Admin Portal Sign In',
    sub: 'Sign in to operate Clean America Dallas operations',
    signup: null,
    home: '/admin',
    icon: '🛡️',
  },
};

export default function Login({ role = 'customer' }) {
  const config = CONFIG[role] || CONFIG.customer;
  const demoCreds = DEMOS[role] || DEMOS.customer;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const fillDemo = () => {
    setForm(demoCreds);
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 300));
    const result = login(form.email, form.password);
    setLoading(false);

    if (result.error) {
      return setError(result.error);
    }

    if (result.role !== role) {
      useAuthStore.getState().logout();
      return setError(`This account belongs to ${result.role}. Please sign in with a ${role} account.`);
    }

    navigate(config.home, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-brand" aria-label="Clean America home">
          <img src={LOGO_URL} alt="Clean America Dallas" className="auth-brand-logo" />
        </Link>

        <h1>{config.title}</h1>
        <p className="auth-sub">{config.sub}</p>

        {/* Sleek Auto-Fill Demo Button */}
        <div className="demo-box" onClick={fillDemo}>
          <div className="db-top">
            <span><HiSparkles style={{ color: '#FFC107', verticalAlign: 'middle', marginRight: 4 }} /> Demo {role.toUpperCase()} Login:</span>
            <span className="db-click">⚡ Auto-Fill Demo Account</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            <span>Email Address</span>
            <div className="input-wrap">
              <HiMail className="input-icon" />
              <input
                type="email"
                placeholder="you@cleanamericadallas.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-wrap">
              <HiLockClosed className="input-icon" />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
          </label>

          {error && <div className="auth-error">⚠️ {error}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Authenticating...' : (
              <>
                <span>Sign In to Clean America</span>
                <HiArrowRight style={{ width: 16, height: 16 }} />
              </>
            )}
          </button>
        </form>

        {config.signup && (
          <p className="auth-switch">
            Don't have an account? <Link to={config.signup}>Sign up here</Link>
          </p>
        )}
      </div>

      <div className="auth-visual">
        <div className="av-content">
          <div className="av-icon">{config.icon}</div>
          <h2>Clean America Dallas</h2>
          <p>
            {role === 'worker'
              ? 'Manage your job schedule, live appointments, and payout earnings.'
              : role === 'admin'
              ? 'Dispatch pros, track real-time bookings, and review Dallas performance analytics.'
              : 'Book top-rated certified Dallas pros for House Cleaning, Plumbing, HVAC, Electrical, and Lawn Care.'}
          </p>
        </div>
      </div>
    </div>
  );
}
