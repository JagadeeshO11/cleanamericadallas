import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/vehicles';
import Footer from '../components/Footer';
import { 
  HiStar, 
  HiShieldCheck, 
  HiClock, 
  HiArrowRight, 
  HiChevronRight, 
  HiSearch, 
  HiBadgeCheck, 
  HiTag, 
  HiLocationMarker, 
  HiChevronDown, 
  HiViewGrid, 
  HiDotsHorizontal,
  HiCheckCircle,
  HiLightningBolt,
  HiPhone,
  HiX
} from 'react-icons/hi';
import { 
  MdOutlineCleaningServices, 
  MdPlumbing, 
  MdElectricalServices, 
  MdHvac, 
  MdHandyman, 
  MdBugReport, 
  MdRoofing, 
  MdOutlineVerified, 
  MdSecurity 
} from 'react-icons/md';
import { FaLeaf, FaHardHat, FaGraduationCap } from 'react-icons/fa';
import './Home.css';
import './HomeGrid.css';
import './HomeLayoutFix.css';

const HERO_BANNERS = [
  {
    id: 1,
    title1: 'EXPERT HOME',
    title2: 'DEEP SANITIZATION.',
    title3: 'TOP DALLAS PROS.',
    sub: 'Professional, background-checked cleaners for your Dallas residence.',
    cta: 'Book Cleaning Pro',
    serviceId: 'house-clean',
    img: 'https://res.cloudinary.com/dwmjz9csc/image/upload/v1788168933/87d195d8-12ef-4448-8621-88297bfaed56.png',
  },
  {
    id: 2,
    title1: 'CLEAN SPACES.',
    title2: 'BETTER PLACES.',
    title3: 'HEALTHIER LIVES.',
    sub: 'Book trusted garden cleaning and labour services in Dallas.',
    cta: 'Book a Service',
    serviceId: 'lawn-mow',
    img: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=700',
  },
  {
    id: 3,
    title1: 'FAST & RELIABLE',
    title2: 'MOVING LABOUR.',
    title3: 'SAME-DAY DISPATCH.',
    sub: 'Packing, loading, unloading and heavy lifting pros on demand.',
    cta: 'Book Moving Pro',
    serviceId: 'handyman-pro',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&q=80',
  }
];

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Services', icon: HiViewGrid, cat: '' },
  { id: 'cleaning', label: 'Cleaning', icon: MdOutlineCleaningServices, cat: 'cleaning' },
  { id: 'lawn', label: 'Garden', icon: FaLeaf, cat: 'lawn' },
  { id: 'labour', label: 'Labour', icon: FaHardHat, cat: 'handyman' },
  { id: 'plumbing', label: 'Plumbing', icon: MdPlumbing, cat: 'plumbing' },
];

const CIRCLE_CATALOG = [
  { id: 'cleaning', label: 'House Cleaning', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&q=80' },
  { id: 'plumbing', label: 'Plumbing', img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&q=80' },
  { id: 'hvac', label: 'HVAC & AC', img: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=200&q=80' },
  { id: 'electrical', label: 'Electrical', img: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&q=80' },
  { id: 'lawn', label: 'Garden & Lawn', img: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 'handyman', label: 'Handyman Pro', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&q=80' },
  { id: 'pest', label: 'Pest Control', img: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&q=80' },
];

const POPULAR_SERVICES = [
  {
    id: 'lawn-mow',
    name: 'Garden Cleaning',
    desc: 'Lawn mowing, hedge trimming & more',
    price: 45,
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
  {
    id: 'house-clean',
    name: 'Deep Cleaning',
    desc: 'Complete home deep cleaning',
    price: 60,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
  },
  {
    id: 'moving-labour',
    name: 'Moving Labour',
    desc: 'Packing, loading & unloading',
    price: 50,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  },
  {
    id: 'plumb-repair',
    name: 'Emergency Plumbing',
    desc: 'Clog removal, leak repair & flush',
    price: 79,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&q=80',
  },
];

const TRUST_FEATURES = [
  { icon: HiShieldCheck, title: 'Verified Professionals' },
  { icon: HiClock, title: 'On-Time Every Time' },
  { icon: HiTag, title: 'Affordable & Transparent' },
  { icon: HiBadgeCheck, title: 'Satisfaction Guarantee' },
];

const WHY = [
  { Icon: MdOutlineVerified, t: 'Vetted & Insured Pros', d: 'Background-checked professionals with $1M liability coverage', color: '#0F2C59' },
  { Icon: HiClock, t: 'On-Time Arrival', d: 'Live GPS tracking from dispatch to your Dallas residence', color: '#2E7D32' },
  { Icon: MdSecurity, t: 'Upfront USD Pricing', d: 'Transparent flat rates. No hidden fees or surprise costs', color: '#0F2C59' },
  { Icon: HiLightningBolt, t: 'Instant Online Booking', d: 'Confirm your service in under 60 seconds', color: '#2E7D32' },
  { Icon: HiShieldCheck, t: '100% Happiness Guarantee', d: 'If you are not satisfied, we will make it right free of charge', color: '#0F2C59' },
  { Icon: HiPhone, t: '24/7 Local Customer Support', d: 'Dedicated Dallas support team available around the clock', color: '#2E7D32' },
];

const CAT_ICONS = {
  cleaning: MdOutlineCleaningServices,
  plumbing: MdPlumbing,
  hvac: MdHvac,
  electrical: MdElectricalServices,
  lawn: FaGraduationCap,
  handyman: MdHandyman,
  pest: MdBugReport,
  roofing: MdRoofing,
};

export default function Home() {
  const navigate = useNavigate();
  const [bannerIdx, setBannerIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % HERO_BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const banner = HERO_BANNERS[bannerIdx];
  const book = id => navigate(`/customer/book/${id}`);

  const handleCategoryClick = (catItem) => {
    setActiveCategory(catItem.id);
    if (catItem.cat) {
      navigate(`/browse?cat=${catItem.cat}`);
    } else {
      navigate('/browse');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="home mockup-theme">
      <div className="home-main-container desktop-enhanced">
        {/* 1. Hero Banner Slider */}
        <section className="hero-mockup-card">
          <div className="hmc-bg-right" style={{ backgroundImage: `url(${banner.img})` }}></div>
          <div className="hmc-overlay-gradient"></div>
          <div className="hmc-content">
            <h1 className="hmc-heading">
              {banner.title1}<br />
              {banner.title2}<br />
              <span className="text-green-highlight">{banner.title3}</span>
            </h1>
            <p className="hmc-subtext">{banner.sub}</p>
            <button className="hmc-cta-btn" onClick={() => book(banner.serviceId)}>
              {banner.cta} <HiArrowRight className="btn-arrow" />
            </button>
          </div>
          <div className="hmc-dots">
            {HERO_BANNERS.map((_, i) => (
              <button
                key={i}
                className={`dot-pill ${i === bannerIdx ? 'active' : ''}`}
                onClick={() => setBannerIdx(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 2. Search Bar - Exact Header Search Bar Component */}
        <form className="nav-search-bar search-bar-hero-wrap" onSubmit={handleSearchSubmit}>
          <HiSearch className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search house cleaning, plumber, HVAC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" className="nav-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <HiX style={{ width: 13, height: 13 }} />
            </button>
          )}
          <button type="submit" className="nav-search-submit-btn" aria-label="Submit search">
            <HiSearch style={{ width: 15, height: 15 }} />
          </button>
        </form>

        {/* 3. Category Filter Tabs */}
        <div className="quick-cat-nav">
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                className={`quick-cat-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <div className="quick-cat-icon-wrap">
                  <Icon className="quick-cat-icon" />
                </div>
                <span className="quick-cat-label">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 6. Popular Services Section - STRICT 2x2 Grid */}
        <section className="popular-services-section">
          <div className="ps-header">
            <h2>Popular Services</h2>
            <button className="view-all-link" onClick={() => navigate('/browse')}>
              View All <HiChevronRight className="va-arrow" />
            </button>
          </div>

          <div className="grid-2x2-services">
            {POPULAR_SERVICES.map((s) => (
              <div key={s.id} className="grid-service-card" onClick={() => book(s.id)}>
                <div className="gsc-img-wrap">
                  <img src={s.image} alt="Clean America Dallas" className="gsc-img" />
                </div>
                <div className="gsc-body">
                  <h3 className="gsc-title">{s.name}</h3>
                  <p className="gsc-desc">{s.desc}</p>
                  <div className="gsc-footer">
                    <span className="gsc-price">${s.price}</span>
                    <div className="gsc-rating">
                      <HiStar className="star-icon" />
                      <span>{s.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Value Propositions / Trust Features Bar */}
        <section className="trust-features-row">
          {TRUST_FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="trust-feature-item">
                <div className="tf-icon-wrap">
                  <Icon className="tf-icon" />
                </div>
                <span className="tf-title">{item.title}</span>
              </div>
            );
          })}
        </section>

        {/* 8. Track Your Pro Real-Time Banner */}
        <section className="realtime-tracker-card" onClick={() => navigate('/customer/orders')}>
          <div className="rtc-bg-right"></div>
          <div className="rtc-overlay-gradient"></div>
          <div className="rtc-content">
            <h2>
              Track Your Pro <span className="text-green-highlight">in Real-Time</span>
            </h2>
            <p>Know where your professional is on the way.</p>
            <button className="rtc-btn">
              Track Now <HiArrowRight className="btn-arrow" />
            </button>
          </div>
        </section>

        {/* 9. RESTORED FULL CATALOG & SECTIONS BELOW TRACK CARD */}
        {categories.map((cat) => {
          const CatIcon = CAT_ICONS[cat.id] || MdOutlineCleaningServices;
          return (
            <section key={cat.id} className="section category-section-card">
              <div className="section-inner">
                <div className="section-header">
                  <div className="cat-section-title">
                    <div className="cat-section-icon-wrap">
                      <CatIcon className="cat-section-icon" />
                    </div>
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
                  {cat.vehicles.map((v) => (
                    <div key={v.id} className="service-card" onClick={() => book(v.id)}>
                      <div className="sc-img-wrap">
                        <img
                          src={v.image}
                          alt={v.name}
                          className="sc-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80';
                          }}
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
                          <button
                            className="sc-book"
                            onClick={(e) => {
                              e.stopPropagation();
                              book(v.id);
                            }}
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* How Clean America Works */}
        <section className="section section-dark">
          <div className="section-inner">
            <h2 className="white-h2">How Clean America Dallas Works</h2>
            <p className="white-sub">Book top-rated home pros in 3 easy steps</p>
            <div className="steps-row">
              {[
                { n: '01', Icon: HiSearch, t: 'Select Service', d: 'Choose from 20+ home cleaning, plumbing & HVAC services' },
                { n: '02', Icon: HiClock, t: 'Choose Schedule', d: 'Pick a date and arrival window that works for you' },
                { n: '03', Icon: HiCheckCircle, t: 'Track Pro & Pay', d: 'Track your assigned Dallas pro live and pay securely online' },
              ].map(({ n, Icon, t, d }) => (
                <div key={n} className="step-card">
                  <div className="step-num">{n}</div>
                  <Icon className="step-icon" />
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <button className="cta-big" onClick={() => navigate('/browse')}>
              Book Your First Service <HiArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </section>

        {/* Why Dallas Trusts Clean America */}
        <section className="section">
          <div className="section-inner">
            <h2>Why Dallas Trusts Clean America</h2>
            <div className="why-grid">
              {WHY.map(({ Icon, t, d, color }) => (
                <div key={t} className="why-card">
                  <div className="why-icon-wrap" style={{ background: color + '18', color }}>
                    <Icon className="why-icon" />
                  </div>
                  <strong>{t}</strong>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}



