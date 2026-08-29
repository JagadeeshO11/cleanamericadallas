import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import './CustomerRoutes.css';

export default function CustomerRoutes() {
  return (
    <ProtectedRoute roles={['customer']}>
      <Navbar />
      <main className="customer-route-main">
        <Outlet />
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
