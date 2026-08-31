import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/vehicles';
import Footer from '../components/Footer';
import { HiStar, HiShieldCheck, HiClock, HiArrowRight, HiChevronRight, HiSearch, HiBadgeCheck, HiTag, HiViewGrid, HiPhone, HiX } from 'react-icons/hi';
import { MdOutlineCleaningServices, MdPlumbing, MdElectricalServices, MdHvac, MdHandyman, MdBugReport, MdRoofing } from 'react-icons/md';
import { FaLeaf, FaHardHat, FaGraduationCap } from 'react-icons/fa';
import './Home.css';
import './HomeGrid.css';
import './HomeLayoutFix.css';
import './TrackCard.css';

const HERO_BANNERS = [
  { id: 1, title1: 'EXPERT HOME', title2: 'DEEP SANITIZATION.', title3: 'TOP DALLAS PROS.', sub: 'Professional, background-checked cleaners for your Dallas residence.', cta: 'Book Cleaning Pro', serviceId: 'house-clean', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80' },
  { id: 2, title1: 'CLEAN SPACES.', title2: 'BETTER PLACES.', title3: 'HEALTHIER LIVES.', sub: 'Book trusted garden cleaning and labour services in Dallas.', cta: 'Book a Service', serviceId: 'lawn-mow', img: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { id: 3, title1: 'FAST & RELIABLE', title2: 'MOVING LABOUR.', title3: 'SAME-DAY DISPATCH.', sub: 'Packing, loading, unloading and heavy lifting pros on demand.', cta: 'Book Moving Pro', serviceId: 'handyman-pro', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80' }
];
const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Services', icon: HiViewGrid, cat: '' }, { id: 'cleaning', label: 'Cleaning', icon: MdOutlineCleaningServices, cat: 'cleaning' },
  { id: 'lawn', label: 'Garden', icon: FaLeaf, cat: 'lawn' }, { id: 'labour', label: 'Labour', icon: FaHardHat, cat: 'handyman' },
  { id: 'plumbing', label: 'Plumbing', icon: MdPlumbing, cat: 'plumbing' }
];
const POPULAR_SERVICES = [
  { id: 'lawn-mow', name: 'Garden Cleaning', desc: 'Lawn mowing, hedge trimming & more', price: 45, rating: 4.8, image: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'house-clean', name: 'Deep Cleaning', desc: 'Complete home deep cleaning', price: 60, rating: 4.8, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80' },
  { id: 'moving-labour', name: 'Moving Labour', desc: 'Packing, loading & unloading', price: 50, rating: 4.7, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' },
  { id: 'plumb-repair', name: 'Emergency Plumbing', desc: 'Clog removal, leak repair & flush', price: 79, rating: 4.8, image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80' }
];
const TRUST_FEATURES = [
  { icon: HiShieldCheck, title: 'Verified Professionals' }, { icon: HiClock, title: 'On-Time Every Time' },
  { icon: HiTag, title: 'Affordable & Transparent' }, { icon: HiBadgeCheck, title: 'Satisfaction Guarantee' }
];
const CAT_ICONS = { cleaning: MdOutlineCleaningServices, plumbing: MdPlumbing, hvac: MdHvac, electrical: MdElectricalServices, lawn: FaGraduationCap, handyman: MdHandyman, pest: MdBugReport, roofing: MdRoofing };

export default function Home() {
  const navigate = useNavigate(); const [bannerIdx, setBannerIdx] = useState(0); const [activeCategory, setActiveCategory] = useState('all'); const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i + 1) % HERO_BANNERS.length), 4500); return () => clearInterval(t); }, []);
  const banner = HERO_BANNERS[bannerIdx]; const book = id => navigate(`/customer/book/${id}`);
  const handleCategoryClick = cat => { setActiveCategory(cat.id); navigate(cat.cat ? `/browse?cat=${cat.cat}` : '/browse'); };
  const handleSearchSubmit = e => { e.preventDefault(); if (searchQuery.trim()) navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`); };

  return <div className="home mockup-theme"><div className="home-main-container desktop-enhanced">
    <section className="hero-mockup-card"><div className="hmc-bg-right" style={{ backgroundImage: `url(${banner.img})` }}></div><div className="hmc-overlay-gradient"></div><div className="hmc-content"><h1 className="hmc-heading">{banner.title1}<br />{banner.title2}<br /><span className="text-green-highlight">{banner.title3}</span></h1><p className="hmc-subtext">{banner.sub}</p><button className="hmc-cta-btn" onClick={() => book(banner.serviceId)}>{banner.cta} <HiArrowRight className="btn-arrow" /></button></div><div className="hmc-dots">{HERO_BANNERS.map((_, i) => <button key={i} className={`dot-pill ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} aria-label={`Slide ${i + 1}`} />)}</div></section>
    <form className="nav-search-bar search-bar-hero-wrap" onSubmit={handleSearchSubmit}><HiSearch className="nav-search-icon" /><input type="text" className="nav-search-input" placeholder="Search house cleaning, plumber, HVAC..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />{searchQuery && <button type="button" className="nav-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search"><HiX style={{ width: 13, height: 13 }} /></button>}<button type="submit" className="nav-search-submit-btn" aria-label="Submit search"><HiSearch style={{ width: 15, height: 15 }} /></button></form>
    <div className="quick-cat-nav">{QUICK_CATEGORIES.map(cat => { const Icon = cat.icon; return <button key={cat.id} className={`quick-cat-btn ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}><div className="quick-cat-icon-wrap"><Icon className="quick-cat-icon" /></div><span className="quick-cat-label">{cat.label}</span></button>; })}</div>
    <section className="popular-services-section"><div className="ps-header"><h2>Popular Services</h2><button className="view-all-link" onClick={() => navigate('/browse')}>View All <HiChevronRight className="va-arrow" /></button></div><div className="grid-2x2-services">{POPULAR_SERVICES.map(s => <div key={s.id} className="grid-service-card" onClick={() => book(s.id)}><div className="gsc-img-wrap"><img src={s.image} alt="Clean America Dallas" className="gsc-img" /></div><div className="gsc-body"><h3 className="gsc-title">{s.name}</h3><p className="gsc-desc">{s.desc}</p><div className="gsc-footer"><span className="gsc-price">${s.price}</span><div className="gsc-rating"><HiStar className="star-icon" /><span>{s.rating}</span></div></div></div></div>)}</div></section>
    <section className="trust-features-row">{TRUST_FEATURES.map((item, i) => { const Icon = item.icon; return <div key={i} className="trust-feature-item"><div className="tf-icon-wrap"><Icon className="tf-icon" /></div><span className="tf-title">{item.title}</span></div>; })}</section>
    <section className="realtime-tracker-card" onClick={() => navigate('/customer/orders')}><div className="rtc-bg-right"></div><div className="rtc-overlay-gradient"></div><div className="rtc-content"><h2>Track Your Pro <span className="text-green-highlight">in Real-Time</span></h2><p>Know where your professional is on the way.</p><button className="rtc-btn">Track Now <HiArrowRight className="btn-arrow" /></button></div></section>
    {categories.map(cat => { const CatIcon = CAT_ICONS[cat.id] || MdOutlineCleaningServices; return <section key={cat.id} className="section category-section-card"><div className="section-inner"><div className="section-header"><div className="cat-section-title"><div className="cat-section-icon-wrap"><CatIcon className="cat-section-icon" /></div><div><h2>{cat.label}</h2><span className="cat-section-count">{cat.vehicles.length} service options</span></div></div><button className="see-all-btn" onClick={() => navigate(`/browse?cat=${cat.id}`)}>See all <HiChevronRight style={{ width: 14, height: 14 }} /></button></div><div className="h-scroll">{cat.vehicles.map(v => <div key={v.id} className="service-card" onClick={() => book(v.id)}><div className="sc-img-wrap"><img src={v.image} alt={v.name} className="sc-img" onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80'; }} /><div className="sc-rating"><HiStar style={{ width: 11, height: 11, color: '#f59e0b' }} /> {v.rating || '4.8'}</div></div><div className="sc-body"><div className="sc-name">{v.name}</div><div className="sc-desc">{v.desc}</div><div className="sc-footer"><span className="sc-rate">${v.price}</span><span className="sc-unit">{v.unit || 'service'}</span><button className="sc-book" onClick={e => { e.stopPropagation(); book(v.id); }}>Book</button></div></div></div>)}</div></div></section>; })}
  </div><Footer /></div>;
}
