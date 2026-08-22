import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

export function useAuthAction() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = (
    action: () => void,
    fallbackRedirectUrl?: string
  ) => {
    if (isAuthenticated) {
      action();
    } else {
      const url = fallbackRedirectUrl || location.pathname + location.search;
      navigate(`/login?redirect=${encodeURIComponent(url)}`);
    }
  };

  return { requireAuth };
}
