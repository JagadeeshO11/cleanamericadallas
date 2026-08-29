import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function Layout() {
  const { pathname } = useLocation();
  const isAdminOrWorker = pathname.startsWith('/admin') || pathname.startsWith('/worker');
  const isWorker = pathname.startsWith('/worker');

  return (
    <div className={isWorker ? 'app-worker-theme' : ''}>
      {isAdminOrWorker ? null : <Navbar />}
      <main style={{ paddingBottom: isAdminOrWorker ? '0' : '72px', paddingTop: isAdminOrWorker ? '0' : '112px' }}>
        <Routes>
          {/* Public customer-facing pages */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />

          {/* Customer authentication */}
          <Route path="/customer/signin" element={<Login role="customer" />} />
          <Route path="/customer/signup" element={<Register role="customer" />} />

          {/* Worker authentication */}
          <Route path="/worker/signin" element={<Login role="worker" />} />
          <Route path="/worker/signup" element={<Register role="worker" />} />

          {/* Admin authentication */}
          <Route path="/admin/signin" element={<Login role="admin" />} />

          {/* Customer application */}
          <Route path="/customer" element={<ProtectedRoute roles={['customer']}><CustomerProfile /></ProtectedRoute>} />
          <Route path="/customer/profile" element={<ProtectedRoute roles={['customer']}><CustomerProfile /></ProtectedRoute>} />
          <Route path="/customer/orders" element={<ProtectedRoute roles={['customer']}><Orders /></ProtectedRoute>} />
          <Route path="/customer/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
          <Route path="/customer/book/:id" element={<ProtectedRoute roles={['customer']}><BookingFlow /></ProtectedRoute>} />
          <Route path="/customer/track/:id" element={<ProtectedRoute roles={['customer']}><OrderTracking /></ProtectedRoute>} />

          {/* Backward-compatible customer URLs, never used as auth routes */}
          <Route path="/book/:id" element={<Navigate to="/customer/book/:id" replace />} />
          <Route path="/track/:id" element={<Navigate to="/customer/track/:id" replace />} />
          <Route path="/orders" element={<Navigate to="/customer/orders" replace />} />
          <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />

          {/* Admin application */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="workers" element={<AdminWorkers />} />
            <Route path="more" element={<AdminMore />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="payments" element={<AdminPayments />} />
          </Route>

          {/* Worker application */}
          <Route path="/worker" element={<ProtectedRoute roles={['worker']}><WorkerLayout /></ProtectedRoute>}>
            <Route index element={<WorkerHome />} />
            <Route path="orders" element={<WorkerOrders />} />
            <Route path="history" element={<WorkerHistory />} />
            <Route path="wallet" element={<WorkerWallet />} />
            <Route path="profile" element={<WorkerProfile />} />
          </Route>

          {/* No universal signin/signup routes. */}
          <Route path="/signin" element={<Navigate to="/customer/signin" replace />} />
          <Route path="/signup" element={<Navigate to="/customer/signup" replace />} />
          <Route path="/login" element={<Navigate to="/customer/signin" replace />} />
          <Route path="/register" element={<Navigate to="/customer/signup" replace />} />
        </Routes>
      </main>
      {!isAdminOrWorker && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout />
    </BrowserRouter>
  );
}
