import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';

export default function CustomerRoutes() {
  return (
    <ProtectedRoute roles={['customer']}>
      <Navbar />
      <main style={{ paddingBottom: '72px', paddingTop: '112px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </ProtectedRoute>
  );
}
