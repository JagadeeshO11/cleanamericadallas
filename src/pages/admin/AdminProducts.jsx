import { allVehicles } from '../../data/vehicles';
import { HiStar, HiCheckCircle } from 'react-icons/hi';
import './Admin.css';

export default function AdminProducts() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1>Service Catalog</h1>
          <p>{allVehicles.length} active Dallas home service offerings</p>
        </div>
      </div>

      <div className="products-grid">
        {allVehicles.map(p => (
          <div key={p.id} className="product-card">
            <div className="pc-img-wrap">
              <img src={p.image} alt={p.name} className="pc-img" />
              <span className="pc-cat">{p.categoryLabel}</span>
            </div>
            <div className="pc-body">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <div className="pc-footer">
                <div className="pc-rate">${p.rate} <span className="pc-unit">/{p.unit}</span></div>
                <div className="pc-status"><HiCheckCircle style={{ width: 13, height: 13, color: '#10b981' }} /> Active</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
