import { useState } from 'react'
import './customer-reference.css'
import './customer-enhancements.css'
import Home from './pages/Home'
import BookingFlow from './pages/BookingFlow'
import Bookings from './pages/Bookings'
import Details from './pages/Details'
import Track from './pages/Track'
import Profile from './pages/Profile'

const LOGO_URL='https://res.cloudinary.com/dwmjz9csc/image/upload/v1787423047/WhatsApp_Image_2026-08-21_at_19.39.36-removebg-preview_qelqnz.png'
const services=[
{id:'garden',name:'Garden Cleaning',price:45,icon:'🌿',image:'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=900&q=80',description:'Complete garden cleaning and maintenance'},
{id:'labour',name:'Labour Services',price:50,icon:'🛠️',image:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',description:'General labour and assistance tasks'},
{id:'mowing',name:'Lawn Mowing',price:40,icon:'🌱',image:'https://images.unsplash.com/photo-1599685315640-6b5c5b5f2c3b?auto=format&fit=crop&w=700&q=80',description:'Fresh, clean and evenly cut lawn'},
{id:'hedge',name:'Hedge Trimming',price:45,icon:'✂️',image:'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=700&q=80',description:'Neat hedge shaping and trimming'},
{id:'yard',name:'Yard Cleaning',price:50,icon:'🧹',image:'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=700&q=80',description:'Leaves, debris and outdoor cleanup'}]
const initialBookings=[
{id:'CA-2048',service:'Garden Cleaning',date:'Aug 20, 2026',time:'10:00 AM - 12:00 PM',employee:'Mark Johnson',status:'En Route',price:45,image:services[0].image},
{id:'CA-2049',service:'Hedge Trimming',date:'Aug 25, 2026',time:'2:00 PM - 3:30 PM',employee:'James Smith',status:'Confirmed',price:45,image:services[3].image},
{id:'CA-2050',service:'Yard Cleaning',date:'Aug 30, 2026',time:'9:00 AM - 11:00 AM',employee:'David Brown',status:'Scheduled',price:50,image:services[4].image}]
const nav=[['home','⌂','Home'],['bookings','▣','Bookings'],['track','⌖','Track'],['profile','♙','Profile']]
function BottomNav({active,setPage}){return <nav className="bottom-nav">{nav.map(([id,icon,label])=><button key={id} className={active===id?'active':''} onClick={()=>setPage(id)}><span>{icon}</span><small>{label}</small></button>)}</nav>}
export default function App(){const [page,setPage]=useState('home');const [selectedService,setSelectedService]=useState(services[0]);const [selectedBooking,setSelectedBooking]=useState(initialBookings[0]);const [bookings,setBookings]=useState(initialBookings);const addBooking=b=>setBookings(items=>[b,...items]);let content;if(page==='home')content=<Home services={services} logo={LOGO_URL} setPage={setPage} setSelectedService={setSelectedService}/>;else if(page==='book')content=<BookingFlow service={selectedService} services={services} setPage={setPage} addBooking={addBooking}/>;else if(page==='bookings')content=<Bookings bookings={bookings} setPage={setPage} setSelectedBooking={setSelectedBooking}/>;else if(page==='details')content=<Details booking={selectedBooking} setPage={setPage}/>;else if(page==='track')content=<Track setPage={setPage}/>;else content=<Profile setPage={setPage}/>;const showNav=['home','bookings','track','profile'].includes(page);return <div className="app-shell"><div className="phone-app">{content}{showNav&&<BottomNav active={page} setPage={setPage}/>}</div></div>}
