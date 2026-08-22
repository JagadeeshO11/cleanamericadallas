import { useState } from 'react'
import './App.css'

const services = [
  { id: 'garden', name: 'Garden Cleaning', price: 45, icon: '🌿', image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=900&q=80', description: 'Complete garden cleaning and maintenance' },
  { id: 'labour', name: 'Labour Services', price: 50, icon: '🛠️', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80', description: 'General labour and assistance tasks' },
  { id: 'mowing', name: 'Lawn Mowing', price: 40, icon: '🌱', image: 'https://images.unsplash.com/photo-1599685315640-6b5c5b5f2c3b?auto=format&fit=crop&w=700&q=80', description: 'Fresh, clean and evenly cut lawn' },
  { id: 'hedge', name: 'Hedge Trimming', price: 45, icon: '✂️', image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=700&q=80', description: 'Neat hedge shaping and trimming' },
  { id: 'yard', name: 'Yard Cleaning', price: 50, icon: '🧹', image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80', description: 'Leaves, debris and outdoor cleanup' },
]

const initialBookings = [
  { id: 'CA-2048', service: 'Garden Cleaning', date: 'Aug 20, 2026', time: '10:00 AM - 12:00 PM', employee: 'Mark Johnson', status: 'En Route', price: 45, image: services[0].image },
  { id: 'CA-2049', service: 'Hedge Trimming', date: 'Aug 25, 2026', time: '2:00 PM - 3:30 PM', employee: 'James Smith', status: 'Confirmed', price: 45, image: services[3].image },
  { id: 'CA-2050', service: 'Yard Cleaning', date: 'Aug 30, 2026', time: '9:00 AM - 11:00 AM', employee: 'David Brown', status: 'Scheduled', price: 50, image: services[4].image },
]

const navItems = [['home', '⌂', 'Home'], ['bookings', '▣', 'Bookings'], ['track', '⌖', 'Track'], ['profile', '♙', 'Profile']]

function Header({ title, onBack }) {
  return <header className="mobile-header">
    {onBack ? <button className="icon-button" onClick={onBack}>‹</button> : <div className="location"><span>●</span> Dallas, Texas <b>⌄</b></div>}
    <h1>{title}</h1>
    <button className="profile-dot" onClick={() => {}}>♙</button>
  </header>
}

function BottomNav({ active, setPage }) {
  return <nav className="bottom-nav">{navItems.map(([id, icon, label]) => <button key={id} className={active === id ? 'active' : ''} onClick={() => setPage(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>
}

function Home({ setPage, setSelectedService }) {
  const [query, setQuery] = useState('')
  const filtered = services.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
  return <><Header title="" /><main className="page">
    <section className="welcome"><div><p className="hello">Hello, Jennifer 👋</p><h2>What service do you need today?</h2></div><div className="avatar-mini">J</div></section>
    <div className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search services..." /><button>⌕</button></div>
    <section className="service-pair">{filtered.slice(0, 2).map((s, i) => <button key={s.id} className={`service-tile ${i === 0 ? 'featured' : ''}`} onClick={() => { setSelectedService(s); setPage('book') }}><span className="tile-icon">{s.icon}</span><strong>{s.name}</strong><small>Starting at</small><b>${s.price}</b></button>)}</section>
    <section className="section-block"><div className="section-heading"><h3>Popular Services</h3><button onClick={() => setPage('book')}>View all</button></div><div className="service-list">{filtered.slice(2).map((s) => <button className="service-row" key={s.id} onClick={() => { setSelectedService(s); setPage('book') }}><img src={s.image} alt=""/><span><strong>{s.name}</strong><small>Starting at ${s.price}</small></span><i>›</i></button>)}</div></section>
  </main></>
}

function BookingFlow({ service, setPage, addBooking }) {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState('2026-08-20')
  const [time, setTime] = useState('10:00 AM - 12:00 PM')
  const [notes, setNotes] = useState('')
  const selected = service || services[0]
  const submit = () => { addBooking({ id: `CA-${Date.now().toString().slice(-4)}`, service: selected.name, date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), time, employee: 'Awaiting assignment', status: 'Scheduled', price: selected.price, image: selected.image }); setPage('bookings') }
  return <><Header title="Book a Service" onBack={() => setPage('home')} /><main className="page booking-page">
    <div className="stepper">{['Service','Schedule','Details','Payment'].map((label, i) => <div className={`step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`} key={label}><span>{i + 1}</span><small>{label}</small></div>)}</div>
    {step === 1 && <section className="flow-section"><h2>Select Service</h2><div className="choice-list">{[selected, ...services.filter((s) => s.id !== selected.id).slice(0, 1)].map((s, i) => <button className={`choice-card ${i === 0 ? 'selected' : ''}`} key={s.id} onClick={() => setStep(2)}><div><strong>{s.name}</strong><p>{s.description}</p></div><b>${s.price}</b><span className="radio">{i === 0 ? '✓' : ''}</span></button>)}</div></section>}
    {step === 2 && <section className="flow-section"><h2>Select Date & Time</h2><label className="field"><span>Date</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label><label className="field"><span>Time</span><select value={time} onChange={(e) => setTime(e.target.value)}><option>10:00 AM - 12:00 PM</option><option>12:00 PM - 2:00 PM</option><option>2:00 PM - 4:00 PM</option><option>4:00 PM - 6:00 PM</option></select></label></section>}
    {step === 3 && <section className="flow-section"><h2>Booking Details</h2><div className="summary-card"><img src={selected.image} alt=""/><div><strong>{selected.name}</strong><span>${selected.price}</span><small>1234 Elm Street, Dallas, TX</small></div></div><label className="field"><span>Special Instructions (Optional)</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Tell the employee anything they should know..." /></label></section>}
    {step === 4 && <section className="flow-section"><h2>Payment Summary</h2><div className="payment-card"><div><span>Service Fee</span><b>${selected.price}.00</b></div><div><span>Platform Fee</span><b>$5.00</b></div><hr/><div className="total"><span>Total</span><b>${selected.price + 5}.00</b></div></div><p className="secure-note">Payment is collected securely after confirming your booking.</p></section>}
    <div className="flow-actions">{step > 1 && <button className="secondary-btn" onClick={() => setStep(step - 1)}>Back</button>}{step < 4 ? <button className="primary-btn" onClick={() => setStep(step + 1)}>Continue</button> : <button className="primary-btn" onClick={submit}>Confirm Booking</button>}</div>
  </main></>
}

function Bookings({ bookings, setPage, setSelectedBooking }) {
  const [tab, setTab] = useState('Upcoming')
  const list = tab === 'Upcoming' ? bookings : bookings.filter((b) => b.status === 'Completed')
  return <><Header title="My Bookings" /><main className="page"><div className="tabs"><button className={tab === 'Upcoming' ? 'active' : ''} onClick={() => setTab('Upcoming')}>Upcoming</button><button className={tab === 'Completed' ? 'active' : ''} onClick={() => setTab('Completed')}>Completed</button></div><div className="booking-list">{list.length ? list.map((b) => <article className="booking-card" key={b.id}><img src={b.image} alt=""/><div className="booking-info"><strong>{b.service}</strong><small>{b.date} • {b.time}</small><span>{b.employee}</span><em className={b.status === 'En Route' ? 'green' : ''}>{b.status}</em></div><button onClick={() => { setSelectedBooking(b); setPage(b.status === 'En Route' ? 'track' : 'details') }}>{b.status === 'En Route' ? 'Track' : 'View'}</button></article>) : <div className="empty-state">No completed bookings yet.</div>}</div></main></>
}

function Details({ booking, setPage }) {
  return <><Header title="Booking Details" onBack={() => setPage('bookings')} /><main className="page"><div className="detail-card"><div className="detail-service"><img src={booking.image} alt=""/><div><small>Service</small><strong>{booking.service}</strong></div><b>${booking.price}</b></div><div className="detail-row"><small>Date & Time</small><strong>{booking.date} • {booking.time}</strong></div><div className="detail-row"><small>Location</small><strong>1234 Elm Street, Dallas, TX 75201</strong></div><div className="detail-row"><small>Special Instructions</small><strong>Please focus on the front yard and trim hedges.</strong></div></div><div className="payment-card"><h3>Payment Summary</h3><div><span>Service Fee</span><b>${booking.price}.00</b></div><div><span>Platform Fee</span><b>$5.00</b></div><hr/><div className="total"><span>Total</span><b>${booking.price + 5}.00</b></div></div><button className="primary-btn full-btn">Proceed to Payment</button></main></>
}

function Track({ setPage }) {
  return <><Header title="Track Employee" onBack={() => setPage('bookings')} /><main className="page"><div className="employee-banner"><div className="avatar-photo">MJ</div><div><strong>Mark Johnson</strong><small>★ 4.8 (128 jobs)</small></div><em>En Route</em></div><div className="vehicle-row"><span>Vehicle<br/><b>Ford Transit • ABC-1234</b></span><span>ETA<br/><b>15 mins</b></span></div><div className="map-panel"><div className="map-grid"></div><div className="route-line"></div><div className="car-dot">🚐</div><div className="pin">●</div><span className="eta-bubble">15 mins<br/>away</span></div><div className="progress-card"><h3>Job Progress</h3><strong>En Route</strong><div className="progress-line"><i></i></div><div className="progress-labels"><span>En Route</span><span>In Progress</span><span>Completed</span></div></div><button className="outline-btn full-btn">☎ Contact Employee</button></main></>
}

function Profile() {
  return <><Header title="Profile" /><main className="page"><div className="profile-card"><div className="large-avatar">J</div><div><strong>Jennifer Williams</strong><small>jennifer@example.com</small><small>+1 (214) 555-0188</small></div></div><div className="profile-menu">{['Personal Information','Saved Addresses','Payment Methods','Notifications','Help & Support'].map((item) => <button key={item}><span>{item}</span><b>›</b></button>)}</div><button className="secondary-btn full-btn">Log Out</button></main></>
}

export default function App() {
  const [page, setPage] = useState('home')
  const [selectedService, setSelectedService] = useState(services[0])
  const [selectedBooking, setSelectedBooking] = useState(initialBookings[0])
  const [bookings, setBookings] = useState(initialBookings)
  const addBooking = (booking) => setBookings((items) => [booking, ...items])
  let content = <Home setPage={setPage} setSelectedService={setSelectedService} />
  if (page === 'book') content = <BookingFlow service={selectedService} setPage={setPage} addBooking={addBooking} />
  if (page === 'bookings') content = <Bookings bookings={bookings} setPage={setPage} setSelectedBooking={setSelectedBooking} />
  if (page === 'details') content = <Details booking={selectedBooking} setPage={setPage} />
  if (page === 'track') content = <Track setPage={setPage} />
  if (page === 'profile') content = <Profile />
  const showNav = ['home','bookings','track','profile'].includes(page)
  return <div className="app-shell"><div className="phone-app">{content}{showNav && <BottomNav active={page} setPage={setPage} />}</div></div>
}
