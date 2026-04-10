import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token } = useAuth();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard
    const home = user.role === 'ADMIN' ? '/admin' : user.role === 'COMPANY' ? '/company' : '/student';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
