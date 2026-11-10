import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

export default function StudentGuard() {
  const { isAuthenticated, user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // wait for auth to resolve

  // Allow everyone to access update-password so they can reset their password from email links
  if (location.pathname === ROUTES.UPDATE_PASSWORD) {
    return <Outlet />;
  }

  // Check if this user is an LMS student (provisioned by admin)
  const isStudent = 
    userRole === 'STUDENT' || 
    user?.app_metadata?.role === 'STUDENT' || 
    user?.app_metadata?.is_student === true || 
    user?.user_metadata?.is_student === true ||
    user?.user_metadata?.role === 'STUDENT';

  // If this is an LMS student, they must go ONLY to the LMS portal (/portal)
  if (isAuthenticated && isStudent) {
    return <Navigate to={ROUTES.PORTAL} replace />;
  }

  // If already authenticated regular user and visiting /login or /signup, redirect to website home
  if (isAuthenticated && (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
