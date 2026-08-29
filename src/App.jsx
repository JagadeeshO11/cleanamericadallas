import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Browse from './pages/Browse';
import BookingFlow from './pages/BookingFlow';
import OrderTracking from './pages/OrderTracking';
import Orders from './pages/Orders';
import Cart from './pages/Cart';
import CustomerProfile from './pages/CustomerProfile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminWorkers from './pages/admin/AdminWorkers';
import AdminLayout from './pages/admin/AdminLayout';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminMore from './pages/admin/AdminMore';
import AdminProducts from './pages/admin/AdminProducts';
import AdminReports from './pages/admin/AdminReports';
import AdminPayments from './pages/admin/AdminPayments';
import WorkerLayout from './pages/worker/WorkerLayout';
import WorkerHome from './pages/worker/WorkerHome';
import WorkerOrders from './pages/worker/WorkerOrders';
import WorkerHistory from './pages/worker/WorkerHistory';
import WorkerWallet from './pages/worker/WorkerWallet';
import WorkerProfile from './pages/worker/WorkerProfile';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function LegacyCustomerBookRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customer/book/${id}`} replace />;
}

function LegacyCustomerTrackRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customer/track/${id}`} replace />;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingBottom: '72px', paddingTop: '112px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/book/:id" element={<LegacyCustomerBookRedirect />} />
          <Route path="/track/:id" element={<LegacyCustomerTrackRedirect />} />
          <Route path="/orders" element={<Navigate to="/customer/orders" replace />} />
          <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </>
  );
}

function CustomerRoutes() {
  return (
    <ProtectedRoute roles={['customer']}>
      <Routes>
        <Route path="/customer" element={<CustomerProfile />} />
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/orders" element={<Orders />} />
        <Route path="/customer/cart" element={<Cart />} />
        <Route path="/customer/book/:id" element={<BookingFlow />} />
        <Route path="/customer/track/:id" element={<OrderTracking />} />
        <Route path="*" element={<Navigate to="/customer" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}

function WorkerRoutes() {
  return (
    <ProtectedRoute roles={['worker']}>
      <div className="app-worker-theme">
        <Routes>
          <Route path="/worker" element={<WorkerLayout />}>
            <Route index element={<WorkerHome />} />
            <Route path="orders" element={<WorkerOrders />} />
            <Route path="history" element={<WorkerHistory />} />
            <Route path="wallet" element={<WorkerWallet />} />
            <Route path="profile" element={<WorkerProfile />} />
          </Route>
          <Route path="*" element={<Navigate to="/worker" replace />} />
        </Routes>
      </div>
    </ProtectedRoute>
  );
}

function AdminRoutes() {
  return (
    <ProtectedRoute roles={['admin']}>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="more" element={<AdminMore />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </ProtectedRoute>
  );
}

function AuthRoutes() {
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
      <Route path="*" element={<Navigate to="/customer/signin" replace />} />
    </Routes>
  );
}

function Layout() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');
  const isWorker = pathname === '/worker' || pathname.startsWith('/worker/');
  const isCustomer = pathname === '/customer' || pathname.startsWith('/customer/');
  const isAuth = pathname.includes('/signin') || pathname.includes('/signup') || pathname === '/login' || pathname === '/register';

  if (isAdmin) return <AdminRoutes />;
  if (isWorker) return <WorkerRoutes />;
  if (isCustomer) return <CustomerRoutes />;
  if (isAuth) return <AuthRoutes />;
  return <PublicLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}
