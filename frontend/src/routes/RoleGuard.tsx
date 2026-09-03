  import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

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

export default function RoleGuard({ allowedRoles }: { allowedRoles: string[] }) {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  // If GUEST is allowed, unauthenticated users can pass
  if (allowedRoles.includes('GUEST') && !isAuthenticated) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${redirectUrl}`} replace />;
  }

  // If authenticated but role doesn't match
  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to their respective home
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      return <Navigate to={ROUTES.ADMIN} replace />;
    } else {
      return <Navigate to={ROUTES.PROFILE} replace />;
    }
  }

  return <Outlet />;
}
