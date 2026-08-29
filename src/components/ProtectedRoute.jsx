import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const HOME_BY_ROLE = {
  customer: '/customer',
  worker: '/worker',
  admin: '/admin',
};

const SIGNIN_BY_ROLE = {
  customer: '/customer/signin',
  worker: '/worker/signin',
  admin: '/admin/signin',
};

export default function ProtectedRoute({ children, roles }) {
  const user = useAuthStore(s => s.user);
  const location = useLocation();
  const requiredRole = roles?.length === 1 ? roles[0] : null;

  if (!user) {
    return (
      <Navigate
        to={SIGNIN_BY_ROLE[requiredRole] || '/'}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || '/'} replace />;
  }

  return children ?? <Outlet />;
}
