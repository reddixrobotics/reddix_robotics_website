import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

/**
 * StudentGuard — wraps all public/e-commerce routes.
 * If the visitor is a logged-in USER (student), they are
 * immediately bounced to the isolated LMS portal.
 * Admins and unauthenticated guests pass through freely.
 */
export default function StudentGuard() {
  const { isAuthenticated, userRole, loading, isAdmin } = useAuth();

  if (loading) return null; // wait for auth to resolve

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
