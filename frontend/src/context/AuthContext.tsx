import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { fetchAdminSession, clearAdminSessionCache } from '@/services/authSession';
import apiClient from '@/services/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetchAdminSession();
      if (res.data.authenticated && res.data.authStatus === 'AUTHENTICATED') {
        setIsAuthenticated(true);
        setUserRole(res.data.role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAdminSessionCache();
      setIsAuthenticated(false);
      setUserRole(null);
      window.location.href = '/login'; // Force a full page redirect to clear any residual state and hit the login guard
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loading, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
