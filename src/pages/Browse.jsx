import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categories, allVehicles } from '../data/vehicles';
import { useStore } from '../store/useStore';
import {
  HiSearch, HiFilter, HiStar, HiClock, HiCheckCircle,
  HiShoppingCart, HiX, HiLocationMarker, HiCalendar,
} from 'react-icons/hi';
import {
  MdOutlineCleaningServices, MdPlumbing, MdElectricalServices,
  MdHvac, MdHandyman, MdBugReport, MdFormatPaint, MdRoofing,
} from 'react-icons/md';
import { FaGraduationCap } from 'react-icons/fa';
import './Browse.css';

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

const FALLBACK = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80';

export default function Browse() {
  const [params] = useSearchParams();
  const initialCat = params.get('cat') || 'all';
  const initialSearch = params.get('search') || '';

  const [activeCat, setActiveCat] = useState(initialCat);
  const [search, setSearch] = useState(initialSearch);
  const [cartModal, setCartModal] = useState(null);
  const [form, setForm] = useState({ location: 'Dallas, TX', date: '', duration: 1 });
  const [added, setAdded] = useState(null);

  const navigate = useNavigate();
  const addToCart = useStore(s => s.addToCart);
  const customerPath = path => `/customer${path}`;

  useEffect(() => {
    const cat = params.get('cat');
    if (cat) setActiveCat(cat);
    const q = params.get('search');
    if (q) setSearch(q);
  }, [params]);

  const openCartModal = (e, vehicle) => {
    e.stopPropagation();
    setForm({ location: 'Dallas, TX', date: '', duration: 1 });
    setCartModal(vehicle);
  };

  const handleAddToCart = () => {
    addToCart(cartModal, { ...form, total: cartModal.rate * form.duration });
    setAdded(cartModal.id);
    setCartModal(null);
    setTimeout(() => setAdded(null), 2000);
  };

  const filtered = allVehicles.filter(v =>
    (activeCat === 'all' || v.category === activeCat) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="browse">
      <div className="browse-header">
        <div>
          <h1>Book a Home Service</h1>
          <p>{filtered.length} certified Dallas service options available</p>
        </div>
        <div className="search-wrap">
          <HiSearch className="search-icon" />
          <input
            className="search-input"
            placeholder="Search house cleaning, plumber, HVAC..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="cat-tabs">
        <button className={activeCat === 'all' ? 'active' : ''} onClick={() => setActiveCat('all')}>
          <MdOutlineCleaningServices className="tab-icon" /> All Services
        </button>
        {categories.map(c => {
          const Icon = CAT_ICONS[c.id] || MdOutlineCleaningServices;
          return (
            <button key={c.id} className={activeCat === c.id ? 'active' : ''} onClick={() => setActiveCat(c.id)}>
              <Icon className="tab-icon" /> {c.label}
            </button>
          );
        })}
      </div>

      <div className="vehicles-grid">
        {filtered.map(v => (
          <div key={v.id} className="vehicle-card" onClick={() => navigate(customerPath(`/book/${v.id}`))}>
            <div className="vc-img-wrap">
              <img
                src={v.image || FALLBACK}
                alt={v.name}
                className="vc-img"
                onError={e => { e.target.src = FALLBACK; }}
              />
              <span className="vc-avail">
                <HiCheckCircle style={{ width: 11, height: 11 }} /> Available in Dallas
              </span>
            </div>
            <div className="vc-body">
              <h3>{v.name}</h3>
              <p>{v.desc}</p>
              <div className="vc-meta">
                <span className="vc-meta-item">
                  <HiStar style={{ width: 13, height: 13, color: '#f59e0b' }} /> 4.9
                </span>
                <span className="vc-meta-item">
                  <HiClock style={{ width: 13, height: 13, color: '#888' }} /> 60 min arrival
                </span>
              </div>
              <div className="vc-footer">
                <div className="vc-rate">
                  <strong>${v.rate}</strong>
                  <span>/{v.unit}</span>
                </div>
                <div className="vc-actions">
                  <button className="vc-cart-btn" onClick={e => openCartModal(e, v)}>
                    <HiShoppingCart style={{ width: 15, height: 15 }} />
                  </button>
                  <button className="vc-book-btn" onClick={e => { e.stopPropagation(); navigate(customerPath(`/book/${v.id}`)); }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="empty-state">
            <HiFilter style={{ width: 40, height: 40, color: '#888', marginBottom: 12 }} />
            <p>No services match your search. Try adjusting keywords.</p>
          </div>
        )}
      </div>

      {cartModal && (
        <div className="modal-overlay" onClick={() => setCartModal(null)}>
          <div className="cart-modal" onClick={e => e.stopPropagation()}>
            <div className="cm-header">
              <h3>Add Service to Cart</h3>
              <button className="cm-close" onClick={() => setCartModal(null)}><HiX /></button>
            </div>
            <div className="cm-vehicle">
              <img src={cartModal.image} alt={cartModal.name} className="cm-img" />
              <div>
                <strong>{cartModal.name}</strong>
                <span>${cartModal.rate}/{cartModal.unit}</span>
              </div>
            </div>
            <label>
              <span><HiLocationMarker className="cm-lbl-icon" /> Service Location</span>
              <input
                placeholder="Dallas, TX address"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </label>
            <label>
              <span><HiCalendar className="cm-lbl-icon" /> Preferred Date</span>
              <input
                type="date"
                value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </label>
            <label>
              <span>Duration / Quantity ({cartModal.unit})</span>
              <div className="duration-ctrl">
                <button onClick={() => setForm(f => ({ ...f, duration: Math.max(1, f.duration - 1) }))}>−</button>
                <span>{form.duration}</span>
                <button onClick={() => setForm(f => ({ ...f, duration: f.duration + 1 }))}>+</button>
              </div>
            </label>
            <div className="cm-total">
              Total: <strong>${(cartModal.rate * form.duration).toLocaleString()}</strong>
            </div>
            <button className="cm-add-btn" disabled={!form.location || !form.date} onClick={handleAddToCart}>
              <HiShoppingCart style={{ width: 16, height: 16 }} /> Add to Cart
            </button>
          </div>
        </div>
      )}

      {added && (
        <div className="cart-toast">
          <HiCheckCircle style={{ width: 18, height: 18, color: 'var(--primary)' }} /> Service added to cart!
          <button onClick={() => navigate(customerPath('/cart'))}>View Cart →</button>
        </div>
      )}
    </div>
  );
}
