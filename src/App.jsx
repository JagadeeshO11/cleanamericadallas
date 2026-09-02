import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UpcomingJobs from './pages/UpcomingJobs';
import CustomerProfile from './pages/CustomerProfile';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import BookingFlow from './pages/BookingFlow';
import OrderTracking from './pages/OrderTracking';
import Quotes from './pages/Quotes';
import Invoices from './pages/Invoices';
import CustomerSupport from './pages/CustomerSupport';
import WorkerSchedule from './pages/worker/WorkerSchedule';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerOrders from './pages/worker/WorkerOrders';
import WorkerHistory from './pages/worker/WorkerHistory';
import WorkerWallet from './pages/worker/WorkerWallet';
import WorkerProfile from './pages/worker/WorkerProfile';
import AdminQuotesContracts from './pages/admin/AdminQuotesContracts';
import AdminQualitySupport from './pages/admin/AdminQualitySupport';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReports from './pages/admin/AdminReports';
import AdminPayments from './pages/admin/AdminPayments';
import AdminMore from './pages/admin/AdminMore';
import CustomerRoutes from './routes/CustomerRoutes';
import WorkerRoutes from './routes/WorkerRoutes';
import AdminRoutes from './routes/AdminRoutes';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PublicLayout() {
  return (<><Navbar /><main className="app-main"><Outlet /></main><BottomNav /></>);
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
      <Route path="/customer/signin" element={<Login role="customer" />} />
      <Route path="/customer/signup" element={<Register role="customer" />} />
      <Route path="/worker/signin" element={<Login role="worker" />} />
      <Route path="/worker/signup" element={<Register role="worker" />} />
      <Route path="/admin/signin" element={<Login role="admin" />} />
      <Route path="/signin" element={<Navigate to="/customer/signin" replace />} />
      <Route path="/signup" element={<Navigate to="/customer/signup" replace />} />
      <Route path="/login" element={<Navigate to="/customer/signin" replace />} />
      <Route path="/register" element={<Navigate to="/customer/signup" replace />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse />} />
      </Route>

      <Route path="/book/:id" element={<LegacyCustomerBookRedirect />} />
      <Route path="/track/:id" element={<LegacyCustomerTrackRedirect />} />
      <Route path="/orders" element={<Navigate to="/customer/orders" replace />} />
      <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />

      <Route path="/customer" element={<CustomerRoutes />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<CustomerProfile />} />
        <Route path="orders" element={<Orders />} />
        <Route path="upcoming" element={<UpcomingJobs />} />
        <Route path="quotes" element={<Quotes />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="support" element={<CustomerSupport />} />
        <Route path="cart" element={<Cart />} />
        <Route path="book/:id" element={<BookingFlow />} />
        <Route path="track/:id" element={<OrderTracking />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Route>

      <Route path="/worker" element={<WorkerRoutes />}>
        <Route index element={<WorkerDashboard />} />
        <Route path="orders" element={<WorkerOrders />} />
        <Route path="schedule" element={<WorkerSchedule />} />
        <Route path="history" element={<WorkerHistory />} />
        <Route path="wallet" element={<WorkerWallet />} />
        <Route path="profile" element={<WorkerProfile />} />
        <Route path="*" element={<Navigate to="/worker" replace />} />
      </Route>

      <Route path="/admin" element={<AdminRoutes />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="scheduling" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="leads" element={<AdminCustomers />} />
        <Route path="workers" element={<AdminWorkers />} />
        <Route path="quotes" element={<AdminQuotesContracts />} />
        <Route path="contracts" element={<AdminQuotesContracts />} />
        <Route path="quality" element={<AdminQualitySupport />} />
        <Route path="complaints" element={<AdminQualitySupport />} />
        <Route path="photos" element={<AdminQualitySupport />} />
        <Route path="invoices" element={<AdminPayments />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="more" element={<AdminMore />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo); }
  render() {
    if (this.state.hasError) return (
      <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', background: '#121212', color: '#fff', minHeight: '100vh' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h2>
        <p style={{ color: '#aaa', marginBottom: 24 }}>{this.state.error?.message || 'An unexpected error occurred.'}</p>
        <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }} style={{ padding: '12px 24px', background: '#ff6b00', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Return to Home Page</button>
      </div>
    );
    return this.props.children;
  }
}

export default function App() {
  return <BrowserRouter><ErrorBoundary><ScrollToTop /><AppRoutes /></ErrorBoundary></BrowserRouter>;
}
