import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

export default function AuthRoutes() {
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
