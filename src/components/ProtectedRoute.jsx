import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const HOME_BY_ROLE = {
  customer: '/customer',
  worker: '/worker',
  admin: '/admin',
};

export default function ProtectedRoute({ children, roles }) {
  const user = useAuthStore(s => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || '/'} replace />;
  }

  return children ?? <Outlet />;
}
