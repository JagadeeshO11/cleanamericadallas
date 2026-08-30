import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categories, allVehicles } from '../data/vehicles';
import { useStore } from '../store/useStore';
import {
  HiSearch, HiFilter, HiStar, HiClock, HiCheckCircle,
  HiShoppingCart, HiArrowRight,
} from 'react-icons/hi';
import {
  MdOutlineCleaningServices, MdPlumbing, MdElectricalServices,
  MdHvac, MdHandyman, MdBugReport, MdRoofing,
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
  const [addedItem, setAddedItem] = useState(null);

  const navigate = useNavigate();
  const addToCart = useStore(s => s.addToCart);
  const customerPath = path => `/customer${path}`;

  useEffect(() => {
    setActiveCat(params.get('cat') || 'all');
    setSearch(params.get('search') || '');
  }, [params]);

  const selectCategory = cat => {
    setActiveCat(cat);
    navigate(cat === 'all' ? customerPath('/browse') : customerPath(`/browse?cat=${cat}`));
  };

  const handleQuickAddToCart = (e, vehicle) => {
    e.stopPropagation();
    addToCart(vehicle, {
      location: 'Dallas, TX',
      date: new Date().toISOString().split('T')[0],
      duration: 1,
      total: Number(vehicle.rate) || 0,
    });
    setAddedItem(vehicle);
    setTimeout(() => setAddedItem(null), 3000);
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
        <button className={activeCat === 'all' ? 'active' : ''} onClick={() => selectCategory('all')}>
          <MdOutlineCleaningServices className="tab-icon" /> All Services
        </button>
        {categories.map(c => {
          const Icon = CAT_ICONS[c.id] || MdOutlineCleaningServices;
          return (
            <button key={c.id} className={activeCat === c.id ? 'active' : ''} onClick={() => selectCategory(c.id)}>
              <Icon className="tab-icon" /> {c.label}
            </button>
          );
        })}
      </div>

      <div className="vehicles-grid">
        {filtered.map(v => (
          <div key={v.id} className="vehicle-card" onClick={() => navigate(customerPath(`/book/${v.id}`))}>
            <div className="vc-img-wrap">
              <img src={v.image || FALLBACK} alt={v.name} className="vc-img" onError={e => { e.target.src = FALLBACK; }} />
              <span className="vc-avail"><HiCheckCircle style={{ width: 11, height: 11 }} /> Available in Dallas</span>
            </div>
            <div className="vc-body">
              <h3>{v.name}</h3>
              <p>{v.desc}</p>
              <div className="vc-meta">
                <span className="vc-meta-item"><HiStar style={{ width: 13, height: 13, color: '#f59e0b' }} /> 4.9</span>
                <span className="vc-meta-item"><HiClock style={{ width: 13, height: 13, color: '#888' }} /> 60 min arrival</span>
              </div>
              <div className="vc-footer">
                <div className="vc-rate"><strong>${v.rate}</strong><span>/{v.unit}</span></div>
                <div className="vc-actions">
                  <button
                    className="vc-cart-btn"
                    onClick={e => handleQuickAddToCart(e, v)}
                    title="Add to Cart"
                    aria-label={`Add ${v.name} to cart`}
                  >
                    <HiShoppingCart style={{ width: 15, height: 15 }} />
                  </button>
                  <button
                    className="vc-book-btn"
                    onClick={e => { e.stopPropagation(); navigate(customerPath(`/book/${v.id}`)); }}
                  >
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

      {addedItem && (
        <div className="cart-toast">
          <HiCheckCircle style={{ width: 18, height: 18, color: '#4CAF50' }} />
          <span><strong>{addedItem.name}</strong> added to cart!</span>
          <button onClick={() => navigate(customerPath('/cart'))}>
            View Cart <HiArrowRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      )}
    </div>
  );
}
