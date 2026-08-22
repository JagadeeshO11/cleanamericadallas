import { useEffect, useMemo, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'clean-america-dallas-demo'

const seed = {
  customers: [
    { id: 'C-1001', name: 'Sarah Johnson', phone: '(214) 555-0181', address: '7421 Preston Rd, Dallas, TX', service: 'Deep Clean', date: '2026-08-24', time: '09:00 AM', duration: 3, notes: 'Please focus on kitchen and bathrooms.' },
    { id: 'C-1002', name: 'Michael Carter', phone: '(469) 555-0122', address: '4816 Oak Lawn Ave, Dallas, TX', service: 'Move-Out Clean', date: '2026-08-24', time: '01:00 PM', duration: 4, notes: 'Apartment will be empty.' },
    { id: 'C-1003', name: 'Emily Davis', phone: '(972) 555-0147', address: '1208 Ross Ave, Dallas, TX', service: 'Recurring Clean', date: '2026-08-25', time: '10:30 AM', duration: 2, notes: 'Bi-weekly service.' },
    { id: 'C-1004', name: 'David Wilson', phone: '(214) 555-0194', address: '2310 Cedar Springs Rd, Dallas, TX', service: 'Standard Clean', date: '2026-08-25', time: '03:00 PM', duration: 2, notes: 'Gate code 2048.' },
  ],
  employees: [
    { id: 'E-101', name: 'Alex Martinez', role: 'Lead Cleaner', phone: '(214) 555-0101', skills: ['Deep Clean', 'Move-Out'], availability: 'Free', area: 'North Dallas', avatar: 'AM' },
    { id: 'E-102', name: 'Jordan Lee', role: 'Cleaner', phone: '(469) 555-0102', skills: ['Standard Clean', 'Recurring Clean'], availability: 'Busy', area: 'Uptown', avatar: 'JL' },
    { id: 'E-103', name: 'Taylor Brown', role: 'Lead Cleaner', phone: '(972) 555-0103', skills: ['Deep Clean', 'Standard Clean'], availability: 'Free', area: 'Oak Lawn', avatar: 'TB' },
    { id: 'E-104', name: 'Morgan Smith', role: 'Cleaner', phone: '(214) 555-0104', skills: ['Move-Out', 'Recurring Clean'], availability: 'Free', area: 'Plano', avatar: 'MS' },
  ],
  jobs: [
    { id: 'JOB-2201', customerId: 'C-1001', employeeId: 'E-101', status: 'Assigned', date: '2026-08-24', time: '09:00 AM', duration: 3 },
    { id: 'JOB-2202', customerId: 'C-1002', employeeId: null, status: 'Unassigned', date: '2026-08-24', time: '01:00 PM', duration: 4 },
    { id: 'JOB-2203', customerId: 'C-1003', employeeId: 'E-102', status: 'Scheduled', date: '2026-08-25', time: '10:30 AM', duration: 2 },
    { id: 'JOB-2204', customerId: 'C-1004', employeeId: null, status: 'Unassigned', date: '2026-08-25', time: '03:00 PM', duration: 2 },
  ],
  activity: [
    'Admin created JOB-2204 from customer schedule',
    'JOB-2201 assigned to Alex Martinez',
    'Emily Davis schedule saved for Aug 25',
  ],
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seed
  } catch {
    return seed
  }
}

function App() {
  const [state, setState] = useState(loadState)
  const [role, setRole] = useState('customer')
  const [page, setPage] = useState('dashboard')
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const notify = (message) => {
    setToast(message)
    window.clearTimeout(window.__cleanToast)
    window.__cleanToast = window.setTimeout(() => setToast(''), 2400)
  }

  const addSchedule = (payload) => {
    const customer = { id: `C-${Date.now().toString().slice(-4)}`, ...payload }
    const job = { id: `JOB-${Date.now().toString().slice(-4)}`, customerId: customer.id, employeeId: null, status: 'Unassigned', date: customer.date, time: customer.time, duration: Number(customer.duration) || 2 }
    setState((prev) => ({ ...prev, customers: [customer, ...prev.customers], jobs: [job, ...prev.jobs], activity: [`New customer schedule created for ${customer.name}`, ...prev.activity].slice(0, 12) }))
    notify('Schedule submitted. Admin can now assign the job.')
    setPage('schedule')
  }

  const assignJob = (jobId, employeeId) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) => job.id === jobId ? { ...job, employeeId, status: 'Assigned' } : job),
      employees: prev.employees.map((employee) => employee.id === employeeId ? { ...employee, availability: 'Busy' } : employee),
      activity: [`${jobId} assigned to ${prev.employees.find((e) => e.id === employeeId)?.name || employeeId}`, ...prev.activity].slice(0, 12),
    }))
    notify('Work assigned and employee marked busy.')
  }

  const toggleAvailability = (employeeId) => {
    setState((prev) => ({ ...prev, employees: prev.employees.map((employee) => employee.id === employeeId ? { ...employee, availability: employee.availability === 'Free' ? 'Busy' : 'Free' } : employee) }))
  }

  return (
    <div className="app-shell">
      {toast && <div className="toast">{toast}</div>}
      <header className="topbar">
        <div className="brand-wrap"><div className="brand-mark">CA</div><div><strong>Clean America Dallas</strong><span>Service Scheduling Platform</span></div></div>
        <div className="topbar-actions">
          <button className={`role-toggle ${role === 'customer' ? 'active' : ''}`} onClick={() => { setRole('customer'); setPage('dashboard') }}>Customer</button>
          <button className={`role-toggle ${role === 'admin' ? 'active' : ''}`} onClick={() => { setRole('admin'); setPage('dashboard') }}>Admin</button>
        </div>
      </header>

      {role === 'customer' ? <CustomerApp state={state} onSchedule={addSchedule} page={page} setPage={setPage} /> : <AdminApp state={state} assignJob={assignJob} toggleAvailability={toggleAvailability} page={page} setPage={setPage} />}
    </div>
  )
}

function Shell({ title, subtitle, nav, page, setPage, children }) {
  return <div className="shell-layout">
    <aside className="sidebar">
      <div className="sidebar-title">{title}</div>
      <div className="sidebar-subtitle">{subtitle}</div>
      <nav>{nav.map((item) => <button key={item.id} className={page === item.id ? 'nav-item active' : 'nav-item'} onClick={() => setPage(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>
      <div className="sidebar-footer">Dallas • Operations Console</div>
    </aside>
    <main className="main-content">{children}</main>
  </div>
}

function CustomerApp({ state, onSchedule, page, setPage }) {
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: '⌂' },
    { id: 'schedule', label: 'My Schedule', icon: '◷' },
    { id: 'book', label: 'Book Service', icon: '+' },
    { id: 'services', label: 'Services', icon: '✦' },
    { id: 'account', label: 'Account', icon: '◉' },
  ]
  return <Shell title="Customer Portal" subtitle="Plan your cleaning visit" nav={nav} page={page} setPage={setPage}>
    {page === 'dashboard' && <CustomerDashboard state={state} setPage={setPage} />}
    {page === 'schedule' && <CustomerSchedule state={state} />}
    {page === 'book' && <ScheduleForm onSchedule={onSchedule} />}
    {page === 'services' && <ServicesView />}
    {page === 'account' && <CustomerAccount />}
  </Shell>
}

function CustomerDashboard({ state, setPage }) {
  const next = state.customers[0]
  const active = state.jobs.filter((job) => ['Assigned', 'Scheduled', 'In Progress'].includes(job.status)).length
  return <>
    <PageHeading eyebrow="CUSTOMER" title="Welcome back" action={<button className="primary-btn" onClick={() => setPage('book')}>Book a Cleaning</button>} />
    <div className="stat-grid"><Stat value={active} label="Upcoming services"/><Stat value={state.customers.length} label="Scheduled visits"/><Stat value="4.9" label="Service rating"/><Stat value="$0" label="Balance due"/></div>
    <section className="hero-card"><div><span className="eyebrow">NEXT VISIT</span><h2>{next.service}</h2><p>{next.date} • {next.time} • {next.duration} hrs</p><p>{next.address}</p><button className="soft-btn" onClick={() => setPage('schedule')}>View schedule →</button></div><div className="hero-icon">🧽</div></section>
    <SectionTitle title="Quick actions" />
    <div className="feature-grid"><QuickCard icon="◷" title="Set schedule" text="Choose the date and time that works for you." action={() => setPage('book')} /><QuickCard icon="✓" title="View bookings" text="Track assigned and scheduled cleanings." action={() => setPage('schedule')} /><QuickCard icon="★" title="Services" text="Explore standard, deep, recurring and move-out options." action={() => setPage('services')} /></div>
    <SectionTitle title="Recent activity" />
    <div className="activity-list">{state.activity.slice(0, 4).map((item, idx) => <div key={idx} className="activity-row"><span>•</span>{item}</div>)}</div>
  </>
}

function CustomerSchedule({ state }) {
  return <><PageHeading eyebrow="SCHEDULE" title="My Cleaning Schedule" /><div className="card-grid">{state.customers.map((customer) => <div key={customer.id} className="info-card"><div className="card-head"><div><span className="eyebrow">{customer.service}</span><h3>{customer.name}</h3></div><span className="status-pill scheduled">{state.jobs.find((job) => job.customerId === customer.id)?.status || 'Scheduled'}</span></div><p>{customer.date} • {customer.time}</p><p>{customer.duration} hour(s) • {customer.address}</p><small>{customer.notes}</small></div>)}</div></>
}

function ScheduleForm({ onSchedule }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', service: 'Standard Clean', date: '2026-08-26', time: '09:00 AM', duration: 2, notes: '' })
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
  return <><PageHeading eyebrow="BOOKING" title="Set Your Cleaning Schedule" subtitle="The admin team will use this schedule to assign an available employee." /><form className="form-grid" onSubmit={(event) => { event.preventDefault(); onSchedule(form) }}><Field label="Full name"><input required value={form.name} onChange={(e) => set('name', e.target.value)} /></Field><Field label="Phone"><input required value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field><Field label="Service"><select value={form.service} onChange={(e) => set('service', e.target.value)}><option>Standard Clean</option><option>Deep Clean</option><option>Move-Out Clean</option><option>Recurring Clean</option></select></Field><Field label="Duration (hours)"><select value={form.duration} onChange={(e) => set('duration', e.target.value)}><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></Field><Field label="Date"><input type="date" required value={form.date} onChange={(e) => set('date', e.target.value)} /></Field><Field label="Time"><input type="time" required value={to24(form.time)} onChange={(e) => set('time', formatTime(e.target.value))} /></Field><div className="full-span"><Field label="Address"><input required value={form.address} onChange={(e) => set('address', e.target.value)} /></Field></div><div className="full-span"><Field label="Notes"><textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field></div><div className="full-span form-actions"><button className="primary-btn" type="submit">Save Schedule</button></div></form></>
}

function ServicesView() {
  const services = [['Standard Clean','2 hrs','Everyday home cleaning'],['Deep Clean','3 hrs','Detailed kitchen, bath and surfaces'],['Move-Out Clean','4 hrs','Full turnover cleaning'],['Recurring Clean','2 hrs','Weekly or bi-weekly maintenance']]
  return <><PageHeading eyebrow="SERVICES" title="Cleaning Services" /><div className="card-grid">{services.map(([name,duration,copy]) => <div className="info-card" key={name}><span className="service-icon">✦</span><h3>{name}</h3><strong>{duration}</strong><p>{copy}</p></div>)}</div></>
}

function CustomerAccount() { return <><PageHeading eyebrow="ACCOUNT" title="My Account" /><div className="account-card"><div className="account-avatar">SJ</div><div><h3>Sarah Johnson</h3><p>Dallas, TX</p><small>Customer since 2024</small></div></div></> }

function AdminApp({ state, assignJob, toggleAvailability, page, setPage }) {
  const nav = [
    { id: 'dashboard', label: 'Command Center', icon: '◈' },
    { id: 'jobs', label: 'Work Queue', icon: '☷' },
    { id: 'employees', label: 'Employees', icon: '◉' },
    { id: 'schedules', label: 'Customer Schedules', icon: '◷' },
    { id: 'calendar', label: 'Schedule Board', icon: '▦' },
  ]
  return <Shell title="Admin Console" subtitle="Assign work by schedule + availability" nav={nav} page={page} setPage={setPage}>
    {page === 'dashboard' && <AdminDashboard state={state} setPage={setPage} />}
    {page === 'jobs' && <WorkQueue state={state} assignJob={assignJob} />}
    {page === 'employees' && <Employees state={state} toggleAvailability={toggleAvailability} />}
    {page === 'schedules' && <CustomerScheduleAdmin state={state} />}
    {page === 'calendar' && <ScheduleBoard state={state} assignJob={assignJob} />}
  </Shell>
}

function AdminDashboard({ state, setPage }) {
  const free = state.employees.filter((e) => e.availability === 'Free').length
  const unassigned = state.jobs.filter((j) => j.status === 'Unassigned').length
  const busy = state.employees.filter((e) => e.availability === 'Busy').length
  return <><PageHeading eyebrow="ADMIN" title="Operations Command Center" action={<button className="primary-btn" onClick={() => setPage('jobs')}>Assign Work</button>} /><div className="stat-grid"><Stat value={unassigned} label="Unassigned jobs"/><Stat value={free} label="Free employees"/><Stat value={busy} label="Busy employees"/><Stat value={state.customers.length} label="Customer schedules"/></div><div className="feature-grid"><QuickCard icon="☷" title="Work queue" text="See scheduled jobs and assign them to free employees." action={() => setPage('jobs')} /><QuickCard icon="◷" title="Schedules" text="Review every customer time slot before assignment." action={() => setPage('schedules')} /><QuickCard icon="◉" title="Employee capacity" text="Toggle employee free/busy and match by service skill." action={() => setPage('employees')} /><QuickCard icon="▦" title="Schedule board" text="Visual board of work, employee and schedule status." action={() => setPage('calendar')} /></div><SectionTitle title="Assignment rules" /><div className="rule-card"><div>1</div><p>Respect the customer's requested date and time.</p><div>2</div><p>Only assign employees marked <strong>Free</strong>.</p><div>3</div><p>Prefer employees whose skills match the requested service.</p><div>4</div><p>After assignment, the employee automatically becomes <strong>Busy</strong>.</p></div></>
}

function WorkQueue({ state, assignJob }) {
  return <><PageHeading eyebrow="WORK QUEUE" title="Assign Scheduled Work" subtitle="Jobs are generated from customer schedules. Pick a free, skill-matched employee." /><div className="table-wrap"><table><thead><tr><th>Job</th><th>Customer</th><th>Schedule</th><th>Service</th><th>Status</th><th>Recommended Employees</th></tr></thead><tbody>{state.jobs.map((job) => { const customer = state.customers.find((c) => c.id === job.customerId); const candidates = state.employees.filter((e) => e.availability === 'Free').sort((a, b) => Number(b.skills.includes(customer?.service)) - Number(a.skills.includes(customer?.service))); return <tr key={job.id}><td><strong>{job.id}</strong></td><td>{customer?.name}<div className="muted">{customer?.address}</div></td><td>{job.date}<div className="muted">{job.time} • {job.duration}h</div></td><td>{customer?.service}</td><td><span className={`status-pill ${job.status.toLowerCase().replace(' ', '-')}`}>{job.status}</span></td><td>{job.employeeId ? <span className="assigned-name">{state.employees.find((e) => e.id === job.employeeId)?.name}</span> : <div className="assign-group">{candidates.slice(0, 3).map((employee) => <button key={employee.id} className="mini-btn" onClick={() => assignJob(job.id, employee.id)}>{employee.name}</button>)}{candidates.length === 0 && <span className="muted">No free employee</span>}</div>}</td></tr>})}</tbody></table></div></>
}

function Employees({ state, toggleAvailability }) {
  return <><PageHeading eyebrow="PEOPLE" title="Employee Availability" subtitle="Admin controls who is free or busy before assigning work." /><div className="card-grid">{state.employees.map((employee) => <div className="employee-card" key={employee.id}><div className="employee-top"><div className="employee-avatar">{employee.avatar}</div><div><h3>{employee.name}</h3><p>{employee.role}</p></div><span className={`status-pill ${employee.availability.toLowerCase()}`}>{employee.availability}</span></div><div className="skill-row">{employee.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><p className="muted">{employee.area} • {employee.phone}</p><button className={employee.availability === 'Free' ? 'secondary-btn' : 'primary-btn'} onClick={() => toggleAvailability(employee.id)}>{employee.availability === 'Free' ? 'Mark Busy' : 'Mark Free'}</button></div>)}</div></>
}

function CustomerScheduleAdmin({ state }) {
  return <><PageHeading eyebrow="CUSTOMER SCHEDULES" title="Schedules Set By Customers" subtitle="These time slots drive the admin work allocation process." /><div className="card-grid">{state.customers.map((customer) => <div className="info-card" key={customer.id}><div className="card-head"><div><span className="eyebrow">{customer.id}</span><h3>{customer.name}</h3></div><span className="service-badge">{customer.service}</span></div><p><strong>{customer.date}</strong> • {customer.time}</p><p>{customer.duration} hours • {customer.address}</p><p className="muted">{customer.notes}</p></div>)}</div></>
}

function ScheduleBoard({ state, assignJob }) {
  const [date, setDate] = useState('2026-08-24')
  const days = useMemo(() => state.jobs.filter((job) => job.date === date), [state.jobs, date])
  return <><PageHeading eyebrow="SCHEDULE BOARD" title="Daily Work Allocation" action={<input type="date" value={date} onChange={(e) => setDate(e.target.value)} />} /><div className="board-grid">{days.map((job) => { const customer = state.customers.find((c) => c.id === job.customerId); const employee = state.employees.find((e) => e.id === job.employeeId); const freeEmployees = state.employees.filter((e) => e.availability === 'Free'); return <div className="board-card" key={job.id}><div className="board-time">{job.time}</div><h3>{customer?.name}</h3><p>{customer?.service} • {customer?.address}</p><div className="board-assignee">{employee ? <>👤 <strong>{employee.name}</strong><span className="status-pill busy">Assigned / Busy</span></> : <><span className="status-pill unassigned">Needs assignment</span><div className="assign-group">{freeEmployees.slice(0,2).map((e) => <button key={e.id} className="mini-btn" onClick={() => assignJob(job.id, e.id)}>Assign {e.name}</button>)}</div></>}</div></div>})}</div></>
}

function PageHeading({ eyebrow, title, subtitle, action }) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div> }
function SectionTitle({ title }) { return <div className="section-title"><h2>{title}</h2></div> }
function Stat({ value, label }) { return <div className="stat-card"><strong>{value}</strong><span>{label}</span></div> }
function QuickCard({ icon, title, text, action }) { return <button className="quick-card" onClick={action}><span className="quick-icon">{icon}</span><strong>{title}</strong><p>{text}</p><span className="quick-link">Open →</span></button> }
function Field({ label, children }) { return <label className="field"><span>{label}</span>{children}</label> }
function to24(time) { const m = time.match(/(\d+):(\d+)\s?(AM|PM)/i); if (!m) return '09:00'; let h = Number(m[1]); const min = m[2]; const ap = m[3].toUpperCase(); if (ap === 'PM' && h < 12) h += 12; if (ap === 'AM' && h === 12) h = 0; return `${String(h).padStart(2,'0')}:${min}` }
function formatTime(value) { const [h, m] = value.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; const hh = h % 12 || 12; return `${hh}:${String(m).padStart(2,'0')} ${ap}` }

export default App
