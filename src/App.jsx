import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Browse from './pages/Browse';

// Import Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Import Customer Pages
import CustomerProfile from './pages/CustomerProfile';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import BookingFlow from './pages/BookingFlow';
import OrderTracking from './pages/OrderTracking';

// Import Worker Pages
import WorkerHome from './pages/worker/WorkerHome';
import WorkerOrders from './pages/worker/WorkerOrders';
import WorkerHistory from './pages/worker/WorkerHistory';
import WorkerWallet from './pages/worker/WorkerWallet';
import WorkerProfile from './pages/worker/WorkerProfile';

// Import Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReports from './pages/admin/AdminReports';
import AdminPayments from './pages/admin/AdminPayments';
import AdminMore from './pages/admin/AdminMore';

// Import Layout & Guard Category Wrappers
import CustomerRoutes from './routes/CustomerRoutes';
import WorkerRoutes from './routes/WorkerRoutes';
import AdminRoutes from './routes/AdminRoutes';

import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: '72px', paddingTop: '112px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

function LegacyCustomerBookRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customer/book/${id}`} replace />;
}

function LegacyCustomerTrackRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customer/track/${id}`} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* 1. Explicit Authentication Routes */}
      <Route path="/customer/signin" element={<Login role="customer" />} />
      <Route path="/customer/signup" element={<Register role="customer" />} />
      <Route path="/worker/signin" element={<Login role="worker" />} />
      <Route path="/worker/signup" element={<Register role="worker" />} />
      <Route path="/admin/signin" element={<Login role="admin" />} />
      <Route path="/signin" element={<Navigate to="/customer/signin" replace />} />
      <Route path="/signup" element={<Navigate to="/customer/signup" replace />} />
      <Route path="/login" element={<Navigate to="/customer/signin" replace />} />
      <Route path="/register" element={<Navigate to="/customer/signup" replace />} />

      {/* 2. Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
      </Route>

      {/* 3. Legacy Redirections */}
      <Route path="/book/:id" element={<LegacyCustomerBookRedirect />} />
      <Route path="/track/:id" element={<LegacyCustomerTrackRedirect />} />
      <Route path="/orders" element={<Navigate to="/customer/orders" replace />} />
      <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />

      {/* 4. Category 1: Customer Portal Routes */}
      <Route path="/customer" element={<CustomerRoutes />}>
        <Route index element={<CustomerProfile />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="cart" element={<Cart />} />
        <Route path="book/:id" element={<BookingFlow />} />
        <Route path="track/:id" element={<OrderTracking />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Route>

      {/* 5. Category 2: Worker / Partner Portal Routes */}
      <Route path="/worker" element={<WorkerRoutes />}>
        <Route index element={<WorkerHome />} />
        <Route path="orders" element={<WorkerOrders />} />
        <Route path="history" element={<WorkerHistory />} />
        <Route path="wallet" element={<WorkerWallet />} />
        <Route path="profile" element={<WorkerProfile />} />
        <Route path="*" element={<Navigate to="/worker" replace />} />
      </Route>

      {/* 6. Category 3: Admin Portal Routes */}
      <Route path="/admin" element={<AdminRoutes />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="workers" element={<AdminWorkers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="more" element={<AdminMore />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* 7. Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', background: '#121212', color: '#fff', minHeight: '100vh' }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: '#aaa', marginBottom: 24 }}>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
            style={{ padding: '12px 24px', background: '#ff6b00', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
          >
            Return to Home Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}
