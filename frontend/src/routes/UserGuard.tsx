import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        className="h-8 w-8 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)]"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

export default function UserGuard() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
