import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../pages/admin/AdminLayout';

export default function AdminRoutes() {
  return (
    <ProtectedRoute roles={['admin']}>
      <AdminLayout />
    </ProtectedRoute>
  );
}
