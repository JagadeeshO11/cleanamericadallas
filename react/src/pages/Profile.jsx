import { useState } from 'react'
import './Profile.css'

const options=[
 ['Personal Information','Update your name, email and phone','personal'],
 ['Saved Addresses','Manage service locations','addresses'],
 ['Payment Methods','Manage cards and payment preferences','payments'],
 ['Notifications','Choose booking and service alerts','notifications'],
 ['Help & Support','Get help with bookings and services','support']
]
export default function Profile({setPage,onLogout}){
 const [open,setOpen]=useState(null); const [saved,setSaved]=useState(false); const [name,setName]=useState('Jennifer Williams'); const [email,setEmail]=useState('jennifer@example.com'); const [phone,setPhone]=useState('+1 (214) 555-0188'); const [address,setAddress]=useState('1200 Main St, Dallas, TX'); const [notifications,setNotifications]=useState(true); const [card,setCard]=useState('Visa •••• 4242')
 const toggle=k=>setOpen(open===k?null:k)
 const save=e=>{e.preventDefault();setSaved(true);setTimeout(()=>setSaved(false),1800)}
 return <main className="page-view profile-view">
  <header className="list-header"><div><small>ACCOUNT</small><h1>Profile</h1></div><button onClick={()=>setPage('home')} aria-label="Close profile">×</button></header>
  <section className="profile-hero"><div className="profile-avatar">J</div><span><strong>{name}</strong><small>{email}</small><small>{phone}</small></span><button onClick={()=>toggle('personal')}>Edit</button></section>
  <section className="profile-links">
   {options.map(([title,desc,key])=><div className={'profile-option '+(open===key?'expanded':'')} key={key}><button className="profile-row" onClick={()=>toggle(key)}><span><strong>{title}</strong><small>{desc}</small></span><b>{open===key?'⌃':'›'}</b></button>
   {open===key&&<div className="profile-panel">
    {key==='personal'&&<form onSubmit={save}><label>Name<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)}/></label><button className="save-profile">Save changes</button></form>}
    {key==='addresses'&&<form onSubmit={save}><label>Primary service address<input value={address} onChange={e=>setAddress(e.target.value)}/></label><button className="save-profile">Save address</button></form>}
    {key==='payments'&&<div className="payment-panel"><div><strong>{card}</strong><small>Primary payment method</small></div><button onClick={()=>setCard(card.includes('4242')?'Visa •••• 1111':'Visa •••• 4242')}>Change</button></div>}
    {key==='notifications'&&<div className="notification-panel"><div><strong>Booking notifications</strong><small>Updates about schedules and employees</small></div><button className={'switch '+(notifications?'on':'')} onClick={()=>setNotifications(!notifications)} aria-label="Toggle notifications"><i/></button></div>}
    {key==='support'&&<div className="support-panel"><strong>We're here to help.</strong><p>For booking changes, service questions or account help, contact our support team.</p><div className="support-actions"><button onClick={()=>alert('Support request started. We will contact you shortly.')}>Contact Support</button><button onClick={()=>alert('FAQ opened. Common booking questions are available here.')}>View FAQs</button></div></div>}
   </div>}</div>)}
  </section>
  <button className="logout-btn" onClick={()=>onLogout?.()}>Log Out</button>
  {saved&&<div className="profile-toast">✓ Changes saved</div>}
 </main>
}
