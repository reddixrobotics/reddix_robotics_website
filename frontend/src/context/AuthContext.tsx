import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  
  user: User | null;
  session: Session | null;
  isLegacyAdmin: boolean;
  
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to securely extract role from app_metadata
  const extractSupabaseRole = (u: User | null): string | null => {
    if (!u) return null;
    return (u.app_metadata?.role as string) ?? null;
  };

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session: s } } = await supabase.auth.getSession();
      
      if (s && s.user) {
        setSession(s);
        setUser(s.user);
        setIsAuthenticated(true);
        setUserRole(extractSupabaseRole(s.user));
        return;
      }
      
      setIsAuthenticated(false);
      setUserRole(null);
    } catch (error) {
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        if (s && s.user) {
          setSession(s);
          setUser(s.user);
          setIsAuthenticated(true);
          setUserRole(extractSupabaseRole(s.user));
          setLoading(false);
        } else {
          setSession(null);
          setUser(null);
          checkAuth();
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Supabase logout fail', e);
    } finally {
      setIsAuthenticated(false);
      setUserRole(null);
      setSession(null);
      setUser(null);
      setLoading(false);
      window.location.href = '/login'; // Force a full page redirect to clear state
    }
  }, []);

  // Role Helpers
  const isAdmin = useCallback(() => userRole === 'ADMIN' || userRole === 'SUPER_ADMIN', [userRole]);
  const isSuperAdmin = useCallback(() => userRole === 'SUPER_ADMIN', [userRole]);
  const hasRole = useCallback((role: string) => userRole === role, [userRole]);

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        userRole, 
        loading, 
        logout, 
        checkAuth,
        user,
        session,
        isLegacyAdmin: false,
        isAdmin,
        isSuperAdmin,
        hasRole
      }}
    >
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
