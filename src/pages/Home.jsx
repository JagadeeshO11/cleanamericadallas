import { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/vehicles';
import { highlightedServices } from '../data/services';
import Footer from '../components/Footer';
import { HiStar, HiUsers, HiShieldCheck, HiLightningBolt, HiPhone, HiArrowRight, HiChevronRight, HiSearch, HiCheckCircle, HiSparkles, HiClock, HiBadgeCheck } from 'react-icons/hi';
import { MdOutlineCleaningServices, MdPlumbing, MdElectricalServices, MdHvac, MdHandyman, MdBugReport, MdFormatPaint, MdRoofing, MdOutlineVerified, MdSecurity } from 'react-icons/md';
import { FaGraduationCap } from 'react-icons/fa';
import './Home.css';
import './HomeGrid.css';
import './HomeLayoutFix.css';

const BANNERS = [
  { id: 1, tag: 'Dallas Special', title: 'Deep House Cleaning', sub: 'Book trusted garden cleaning and labour services in Dallas.', cta: 'Book a Service', vehicleId: 'house-clean', bg: 'linear-gradient(135deg, #E8F5E9 0%, #F0F6FF 100%)', accent: '#2E7D32', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=80' },
  { id: 2, tag: 'Seasonal Tune-Up', title: 'HVAC & AC Service', sub: 'Keep your Dallas home cool this summer for $89', cta: 'Book HVAC Pro', vehicleId: 'ac-tuneup', bg: 'linear-gradient(135deg, #F0F6FF 0%, #EBF4FF 100%)', accent: '#2E7D32', img: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=700&q=80' },
  { id: 3, tag: 'Same-Day Drain Fix', title: 'Emergency Plumbing', sub: 'Clog removal, leak repair & water heater flush', cta: 'Book Plumber', vehicleId: 'plumb-repair', bg: 'linear-gradient(135deg, #EBF8FE 0%, #E3F3FE 100%)', accent: '#2E7D32', img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=700&q=80' },
  { id: 4, tag: 'Dallas Outdoor', title: 'Lawn Mowing & Edging', sub: 'Weekly & bi-weekly yard maintenance packages', cta: 'Book Lawn Care', vehicleId: 'lawn-mow', bg: 'linear-gradient(135deg, #E8F5E9 0%, #E0F2E1 100%)', accent: '#2E7D32', img: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=700' },
];
const CIRCLE_CATEGORIES = [
  { id: 'cleaning', label: 'House Cleaning', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80' }, { id: 'plumbing', label: 'Plumbing', img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&q=80' }, { id: 'hvac', label: 'HVAC & AC', img: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=200&q=80' }, { id: 'electrical', label: 'Electrical', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&q=80' }, { id: 'lawn', label: 'Lawn Care', img: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=400' }, { id: 'handyman', label: 'Handyman', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&q=80' }, { id: 'pest', label: 'Pest Control', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80' }, { id: 'roofing', label: 'Roof & Gutters', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&q=80' },
];
const WHY = [
  { Icon: MdOutlineVerified, t: 'Vetted & Insured Pros', d: 'Background-checked professionals with $1M liability coverage', color: '#0F2C59' }, { Icon: HiClock, t: 'On-Time Arrival', d: 'Live GPS tracking from dispatch to your Dallas residence', color: '#2E7D32' }, { Icon: MdSecurity, t: 'Upfront USD Pricing', d: 'Transparent flat rates. No hidden fees or surprise costs', color: '#0F2C59' }, { Icon: HiLightningBolt, t: 'Instant Online Booking', d: 'Confirm your service in under 60 seconds', color: '#2E7D32' }, { Icon: HiShieldCheck, t: '100% Happiness Guarantee', d: 'If you are not satisfied, we will make it right free of charge', color: '#0F2C59' }, { Icon: HiPhone, t: '24/7 Local Customer Support', d: 'Dedicated Dallas support team available around the clock', color: '#2E7D32' },
];
const CAT_ICONS = { cleaning: MdOutlineCleaningServices, plumbing: MdPlumbing, hvac: MdHvac, electrical: MdElectricalServices, lawn: FaGraduationCap, handyman: MdHandyman, pest: MdBugReport, roofing: MdRoofing };

export default function Home() {
  const navigate = useNavigate(); const [bannerIdx, setBannerIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4500); return () => clearInterval(t); }, []);
  const banner = BANNERS[bannerIdx]; const book = id => navigate(`/customer/book/${id}`);
  return (
    <div className="home"><div className="home-main-container">
      <section className="category-card-container"><div className="ccc-header"><h3>Clean America Services</h3><span>Dallas, TX</span></div><div className="circle-categories-grid">{CIRCLE_CATEGORIES.map(({ id, label, img }) => <button key={id} className="circle-cat-item" onClick={() => navigate(`/browse?cat=${id}`)}><div className="circle-img-wrap"><img src={img} alt={label} className="circle-img" onError={e => { e.target.src = CIRCLE_CATEGORIES[0].img; }} /></div><span className="circle-label">{label}</span></button>)}</div></section>
      <section className="hero-banner" style={{ background: banner.bg }}><div className="hb-content"><span className="hb-tag"><HiSparkles style={{ width: 12, height: 12 }} /> {banner.tag}</span><h1>{banner.title}</h1><p>{banner.sub}</p><div className="hb-actions"><button className="hb-cta" style={{ background: banner.accent, color: '#fff' }} onClick={() => book(banner.vehicleId)}>{banner.cta} <HiArrowRight style={{ width: 16, height: 16 }} /></button><button className="hb-browse" onClick={() => navigate('/browse')}>View All Services</button></div></div><div className="hb-visual"><img src={banner.img} alt={banner.title} className="hb-img" /></div><div className="hb-dots">{BANNERS.map((_, i) => <button key={i} className={`dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />)}</div></section>
      <section className="stats-bar"><div className="stats-inner">{[{ Icon: HiStar, val: '4.9★', label: 'Customer Rating' }, { Icon: HiUsers, val: '50K+', label: 'Dallas Homes Served' }, { Icon: HiBadgeCheck, val: '100%', label: 'Background Checked' }, { Icon: HiShieldCheck, val: '$1M', label: 'Insured Coverage' }].map(({ Icon, val, label }, i) => <Fragment key={label}>{i > 0 && <div className="stat-divider" />}<div className="stat-item"><Icon className="stat-icon" /><strong>{val}</strong><span>{label}</span></div></Fragment>)}</div></section>
      <section className="section services-section"><div className="section-inner"><div className="section-header"><div><h2>Most Requested Services</h2><p className="section-sub">Certified Dallas pros available today</p></div><button className="see-all-btn" onClick={() => navigate('/browse')}>See all <HiChevronRight style={{ width: 14, height: 14 }} /></button></div><div className="h-scroll">{highlightedServices.map(s => <div key={s.id} className="service-card" onClick={() => book(s.id)}><div className="sc-img-wrap"><img src={s.image} alt={s.name} className="sc-img" /><div className="sc-rating"><HiStar style={{ width: 11, height: 11, color: '#f59e0b' }} /> {s.rating}</div></div><div className="sc-body"><div className="sc-name">{s.name}</div><div className="sc-desc">{s.desc}</div><div className="sc-footer"><div><span className="sc-rate">${s.rate}</span><span className="sc-unit">/{s.unit}</span></div><button className="sc-book" onClick={e => { e.stopPropagation(); book(s.id); }}>Book</button></div></div></div>)}</div></div></section>
      {categories.map((cat) => {
        const CatIcon = CAT_ICONS[cat.id] || MdOutlineCleaningServices;
        return (
          <section key={cat.id} className="section category-section-card">
            <div className="section-inner">
              <div className="section-header">
                <div className="cat-section-title">
                  <div className="cat-section-icon-wrap"><CatIcon className="cat-section-icon" /></div>
                  <div>
                    <h2>{cat.label}</h2>
                    <span className="cat-section-count">{cat.vehicles.length} service options</span>
                  </div>
                </div>
                <button className="see-all-btn" onClick={() => navigate(`/browse?cat=${cat.id}`)}>
                  See all <HiChevronRight style={{ width: 14, height: 14 }} />
                </button>
              </div>
              <div className="h-scroll">
                {cat.vehicles.map(v => (
                  <div key={v.id} className="service-card" onClick={() => book(v.id)}>
                    <div className="sc-img-wrap">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="sc-img"
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80'; }}
                      />
                      <div className="sc-rating">
                        <HiStar style={{ width: 11, height: 11, color: '#f59e0b' }} /> {v.rating || '4.8'}
                      </div>
                    </div>
                    <div className="sc-body">
                      <div className="sc-name">{v.name}</div>
                      <div className="sc-desc">{v.desc}</div>
                      <div className="sc-footer">
                        <div>
                          <span className="sc-rate">${v.rate}</span>
                          <span className="sc-unit">/{v.unit}</span>
                        </div>
                        <button className="sc-book" onClick={e => { e.stopPropagation(); book(v.id); }}>Book</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      <section className="section section-dark"><div className="section-inner"><h2 className="white-h2">How Clean America Dallas Works</h2><p className="white-sub">Book top-rated home pros in 3 easy steps</p><div className="steps-row">{[{ n:'01',Icon:HiSearch,t:'Select Service',d:'Choose from 20+ home cleaning, plumbing & HVAC services' },{ n:'02',Icon:HiClock,t:'Choose Schedule',d:'Pick a date and arrival window that works for you' },{ n:'03',Icon:HiCheckCircle,t:'Track Pro & Pay',d:'Track your assigned Dallas pro live and pay securely online' }].map(({n,Icon,t,d})=><div key={n} className="step-card"><div className="step-num">{n}</div><Icon className="step-icon"/><strong>{t}</strong><p>{d}</p></div>)}</div><button className="cta-big" onClick={()=>navigate('/browse')}>Book Your First Service <HiArrowRight style={{width:18,height:18}}/></button></div></section>
      <section className="section"><div className="section-inner"><h2>Why Dallas Trusts Clean America</h2><div className="why-grid">{WHY.map(({Icon,t,d,color})=><div key={t} className="why-card"><div className="why-icon-wrap" style={{background:color+'18',color}}><Icon className="why-icon"/></div><strong>{t}</strong><p>{d}</p></div>)}</div></div></section>
    </div><Footer /></div>
  );
}
