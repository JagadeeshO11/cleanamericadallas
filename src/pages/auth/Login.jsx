import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import './Auth.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png';
const DEMOS = {
  admin: { email: 'admin@hiremee.in', password: 'admin123' },
  worker: { email: 'ravi@hiremee.in', password: 'worker123' },
  customer: { email: 'customer@hiremee.in', password: 'cust123' },
};

const CONFIG = {
  customer: { title: 'Customer Sign In', sub: 'Sign in to book vehicles and services', signup: '/customer/signup', home: '/customer' },
  worker: { title: 'Worker Sign In', sub: 'Sign in to manage your jobs and earnings', signup: '/worker/signup', home: '/worker' },
  admin: { title: 'Admin Sign In', sub: 'Sign in to manage Clean America', signup: null, home: '/admin' },
};

export default function Login({ role = 'customer' }) {
  const config = CONFIG[role] || CONFIG.customer;
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = login(form.email, form.password); setLoading(false);
    if (result.error) return setError(result.error);
    if (result.role !== role) return setError(`This is the ${role} sign-in. Please use the correct account.`);
    navigate(config.home, { replace: true });
  };

  const demo = DEMOS[role];
  const fillDemo = () => setForm(demo);

  return <div className="auth-page"><div className="auth-card">
    <Link to="/" className="auth-brand" aria-label="Clean America home"><img src={LOGO_URL} alt="Clean America" className="auth-brand-logo" /></Link>
    <h1>{config.title}</h1><p className="auth-sub">{config.sub}</p>
    <button className="demo-pill" onClick={fillDemo}>Try demo {role}</button>
    <form onSubmit={handleSubmit}>
      <label>Email<div className="input-wrap"><HiMail className="input-icon" /><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div></label>
      <label>Password<div className="input-wrap"><HiLockClosed className="input-icon" /><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required /></div></label>
      {error && <div className="auth-error">⚠️ {error}</div>}
      <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Signing in...' : <><span>Sign in</span><HiArrowRight style={{ width: 16, height: 16 }} /></>}</button>
    </form>
    {config.signup && <p className="auth-switch">Don't have an account? <Link to={config.signup}>Sign up</Link></p>}
  </div><div className="auth-visual"><div className="av-content"><div className="av-icon">🚜</div><h2>Clean America</h2><p>{role === 'worker' ? 'Manage your jobs, availability, and earnings.' : role === 'admin' ? 'Operate the Clean America platform.' : 'Book verified operators, construction vehicles, and services for your site.'}</p><div className="av-stats"><div><strong>500+</strong><span>Vehicles</span></div><div><strong>50+</strong><span>Cities</span></div><div><strong>4.8★</strong><span>Rating</span></div></div></div></div></div>;
}
