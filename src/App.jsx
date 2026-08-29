import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams, Outlet } from 'react-router-dom';
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

function PublicLayout() {
  return <><Navbar /><main style={{ paddingBottom: '72px', paddingTop: '112px' }}><Outlet /></main><BottomNav /></>;
}

function LegacyCustomerBookRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customer/book/${id}`} replace />;
}

function LegacyCustomerTrackRedirect() {
  const { id } = useParams();
  return <Navigate to={`/customer/track/${id}`} replace />;
}

function CustomerGuard() {
  return <ProtectedRoute roles={['customer']}><Outlet /></ProtectedRoute>;
}

function WorkerGuard() {
  return <ProtectedRoute roles={['worker']}><div className="app-worker-theme"><Outlet /></div></ProtectedRoute>;
}

function AdminGuard() {
  return <ProtectedRoute roles={['admin']}><Outlet /></ProtectedRoute>;
}

function AuthRoutes() {
  return <Routes>
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
  </Routes>;
}

function AppRoutes() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
    </Route>

    <Route path="/book/:id" element={<LegacyCustomerBookRedirect />} />
    <Route path="/track/:id" element={<LegacyCustomerTrackRedirect />} />
    <Route path="/orders" element={<Navigate to="/customer/orders" replace />} />
    <Route path="/cart" element={<Navigate to="/customer/cart" replace />} />

    <Route element={<CustomerGuard />}>
      <Route path="/customer" element={<CustomerProfile />} />
      <Route path="/customer/profile" element={<CustomerProfile />} />
      <Route path="/customer/orders" element={<Orders />} />
      <Route path="/customer/cart" element={<Cart />} />
      <Route path="/customer/book/:id" element={<BookingFlow />} />
      <Route path="/customer/track/:id" element={<OrderTracking />} />
      <Route path="/customer/*" element={<Navigate to="/customer" replace />} />
    </Route>

    <Route element={<WorkerGuard />}>
      <Route path="/worker" element={<WorkerLayout />}>
        <Route index element={<WorkerHome />} />
        <Route path="orders" element={<WorkerOrders />} />
        <Route path="history" element={<WorkerHistory />} />
        <Route path="wallet" element={<WorkerWallet />} />
        <Route path="profile" element={<WorkerProfile />} />
        <Route path="*" element={<Navigate to="/worker" replace />} />
      </Route>
    </Route>

    <Route element={<AdminGuard />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="workers" element={<AdminWorkers />} />
        <Route path="more" element={<AdminMore />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Route>

    <Route path="/customer/signin" element={<Login role="customer" />} />
    <Route path="/customer/signup" element={<Register role="customer" />} />
    <Route path="/worker/signin" element={<Login role="worker" />} />
    <Route path="/worker/signup" element={<Register role="worker" />} />
    <Route path="/admin/signin" element={<Login role="admin" />} />
    <Route path="/signin" element={<Navigate to="/customer/signin" replace />} />
    <Route path="/signup" element={<Navigate to="/customer/signup" replace />} />
    <Route path="/login" element={<Navigate to="/customer/signin" replace />} />
    <Route path="/register" element={<Navigate to="/customer/signup" replace />} />

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}

export default function App() {
  return <BrowserRouter><ScrollToTop /><AppRoutes /></BrowserRouter>;
}
