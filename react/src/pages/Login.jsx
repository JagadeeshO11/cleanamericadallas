import { useState } from 'react'
import './Login.css'

const LOGO_URL = 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png'

export default function Login({ onSuccess }) {
  const [mode, setMode] = useState('signin')
  const [method, setMethod] = useState('phone')
  const [step, setStep] = useState('form')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const sendOtp = (e) => {
    e.preventDefault(); setError(''); setMessage('')
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) return setError('Enter a valid 10-digit phone number.')
    if (mode === 'signup' && !name.trim()) return setError('Enter your name to create your account.')
    setStep('otp'); setMessage(`OTP sent to +1 ${phone.replace(/\D/g, '').slice(-10)}`)
  }
  const verifyOtp = (e) => {
    e.preventDefault(); setError('')
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit OTP.')
    onSuccess?.()
  }
  const google = () => { setMessage('Google sign-in selected. Connect your Google OAuth provider to enable production authentication.') }
  const emailContinue = (e) => { e.preventDefault(); if (!email.includes('@')) return setError('Enter a valid email address.'); setMessage('Email verification link will be sent when the backend is connected.') }

  return <main className="auth-page">
    <section className="auth-card">
      <div className="auth-brand"><img src={LOGO_URL} alt="Clean America Dallas"/><div><strong>Clean America</strong><span>Dallas</span></div></div>
      <div className="auth-copy"><span className="eyebrow">WELCOME HOME</span><h1>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1><p>{mode === 'signin' ? 'Sign in to manage your cleaning services and bookings.' : 'Book reliable outdoor services in Dallas in just a few taps.'}</p></div>
      <div className="auth-tabs"><button className={mode === 'signin' ? 'active' : ''} onClick={()=>{setMode('signin');setStep('form');setError('')}}>Sign In</button><button className={mode === 'signup' ? 'active' : ''} onClick={()=>{setMode('signup');setStep('form');setError('')}}>Sign Up</button></div>
      {step === 'form' ? <>
        <div className="method-tabs"><button className={method === 'phone'?'active':''} onClick={()=>setMethod('phone')}>📱 Phone OTP</button><button className={method === 'email'?'active':''} onClick={()=>setMethod('email')}>✉️ Email</button></div>
        {method === 'phone' ? <form onSubmit={sendOtp} className="auth-form">
          {mode === 'signup' && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Jennifer Williams" autoComplete="name"/></label>}
          <label>Phone number<div className="phone-input"><span>+1</span><input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="(214) 555-0188" inputMode="numeric" autoComplete="tel"/></div></label>
          {mode === 'signup' && <label>Email <small>(optional)</small><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email"/></label>}
          <button className="auth-primary" type="submit">Send OTP <span>→</span></button>
        </form> : <form onSubmit={emailContinue} className="auth-form">
          {mode === 'signup' && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Jennifer Williams"/></label>}
          <label>Email address<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email" autoComplete="email"/></label>
          <button className="auth-primary" type="submit">Continue with Email <span>→</span></button>
        </form>}
        <div className="divider"><span>or</span></div><button className="google-btn" onClick={google}><b>G</b> Continue with Google</button>
      </> : <form onSubmit={verifyOtp} className="auth-form otp-form"><button type="button" className="change-number" onClick={()=>setStep('form')}>← Change number</button><div className="otp-message">{message || 'Enter the verification code sent to your phone.'}</div><label>6-digit OTP<input className="otp-input" value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="••••••" inputMode="numeric" autoComplete="one-time-code" maxLength="6"/></label><button className="auth-primary" type="submit">Verify & Continue <span>→</span></button><button type="button" className="resend" onClick={()=>setMessage('A new OTP has been sent.')}>Resend OTP</button></form>}
      {error && <div className="auth-error">{error}</div>}{message && step === 'form' && <div className="auth-message">{message}</div>}
      <small className="terms">By continuing, you agree to our Terms of Service and Privacy Policy.</small>
    </section>
  </main>
}
