import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

export default function StudentGuard() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // wait for auth to resolve

  // Allow everyone to access update-password so they can reset their password from email links
  if (location.pathname === ROUTES.UPDATE_PASSWORD) {
    return <Outlet />;
  }

  // If already authenticated and visiting /login or /signup, redirect to the website home
  if (isAuthenticated && (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
