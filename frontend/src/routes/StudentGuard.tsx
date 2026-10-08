import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

export default function StudentGuard() {
  const { isAuthenticated, userRole, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return null; // wait for auth to resolve

  // Allow everyone to access update-password so they can reset their password from email links
  if (location.pathname === ROUTES.UPDATE_PASSWORD) {
    return <Outlet />;
  }

  // If this is a regular student, kick them to the LMS
  if (isAuthenticated && userRole === 'USER') {
    return <Navigate to={ROUTES.PORTAL} replace />;
  }

  // TEACHER should be redirected to their own portal too
  if (isAuthenticated && userRole === 'TEACHER') {
    return <Navigate to={ROUTES.TEACHER} replace />;
  }

  return <Outlet />;
}
