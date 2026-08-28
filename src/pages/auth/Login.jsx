import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import './Auth.css';

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png';
const DEMOS = [
  { label: 'Admin', email: 'admin@hiremee.in', password: 'admin123', color: '#d97706' },
  { label: 'Worker', email: 'ravi@hiremee.in', password: 'worker123', color: '#2563eb' },
  { label: 'Customer', email: 'customer@hiremee.in', password: 'cust123', color: '#16a34a' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password); setLoading(false);
    if (result.error) { setError(result.error); return; }
    if (result.role === 'admin') navigate('/admin', { replace: true });
    else if (result.role === 'worker') navigate('/worker', { replace: true });
    else navigate('/customer', { replace: true });
  };
  const fillDemo = demo => setForm({ email: demo.email, password: demo.password });

  return <div className="auth-page"><div className="auth-card">
    <Link to="/" className="auth-brand" aria-label="Clean America home"><img src={LOGO_URL} alt="Clean America" className="auth-brand-logo" /></Link>
    <h1>Welcome back</h1><p className="auth-sub">Sign in to your account</p>
    <div className="demo-pills">{DEMOS.map(d => <button key={d.label} className="demo-pill" style={{ borderColor: d.color, color: d.color }} onClick={() => fillDemo(d)}>Try {d.label}</button>)}</div>
    <form onSubmit={handleSubmit}>
      <label>Email<div className="input-wrap"><HiMail className="input-icon" /><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div></label>
      <label>Password<div className="input-wrap"><HiLockClosed className="input-icon" /><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required /></div></label>
      {error && <div className="auth-error">⚠️ {error}</div>}
      <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Signing in...' : <><span>Sign in</span><HiArrowRight style={{ width: 16, height: 16 }} /></>}</button>
    </form>
    <p className="auth-switch">Don't have an account? <Link to="/signup">Sign up</Link></p>
  </div><div className="auth-visual"><div className="av-content"><div className="av-icon">🚜</div><h2>Clean America</h2><p>Book verified operators, construction vehicles, and services for your site.</p><div className="av-stats"><div><strong>500+</strong><span>Vehicles</span></div><div><strong>50+</strong><span>Cities</span></div><div><strong>4.8★</strong><span>Rating</span></div></div></div></div></div>;
}
