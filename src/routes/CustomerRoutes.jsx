import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { HiArrowLeft } from 'react-icons/hi';
import './CustomerRoutes.css';

const PAGE_CATEGORIES = [
  { match: '/customer/book/', label: 'Book Services' },
  { match: '/customer/orders', label: 'My Bookings' },
  { match: '/customer/track/', label: 'Track Pro' },
  { match: '/customer/cart', label: 'Cart' },
  { match: '/customer/profile', label: 'Profile' },
];

export default function CustomerRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCustomerHome = location.pathname === '/customer' || location.pathname === '/customer/';
  const category = PAGE_CATEGORIES.find(item => location.pathname.startsWith(item.match));

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/customer');
    }
  };

  return (
    <ProtectedRoute roles={['customer']}>
      <Navbar />
      {!isCustomerHome && (
        <div className="customer-page-nav" role="navigation" aria-label="Customer page navigation">
          <button type="button" className="customer-page-back" onClick={handleBack} aria-label="Go back">
            <HiArrowLeft />
            <span>Back</span>
          </button>
          <div className="customer-page-category">
            <span className="customer-page-category-dot" />
            <span>{category?.label || 'Customer'}</span>
          </div>
        </div>
      )}
      <main className="customer-route-main">
        <Outlet />
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
