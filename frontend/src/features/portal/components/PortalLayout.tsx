import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';
import { supabase } from '@/lib/supabase';
import { BookOpen, HelpCircle, User, LogOut } from 'lucide-react';

export default function PortalLayout() {
  const { user, logout, loading, isAdmin, userRole } = useAuth();
  const [checkingEnrollment, setCheckingEnrollment] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    async function checkStudentEnrollment() {
      if (!user) {
        setCheckingEnrollment(false);
        return;
      }

      // 1. Admins can always preview/view the student portal
      if (isAdmin && isAdmin()) {
        setIsEnrolled(true);
        setCheckingEnrollment(false);
        return;
      }

      // 2. Direct student role / metadata check
      const isStudent = 
        userRole === 'STUDENT' || 
        user.app_metadata?.role === 'STUDENT' || 
        user.app_metadata?.is_student === true || 
        user.user_metadata?.is_student === true ||
        user.user_metadata?.role === 'STUDENT';

      if (isStudent) {
        setIsEnrolled(true);
        setCheckingEnrollment(false);
        return;
      }

      // 3. Database check on Enrollment (both user_id and userId)
      try {
        let hasEnr = false;
        const { data: d1 } = await supabase
          .from('Enrollment')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (d1 && d1.length > 0) {
          hasEnr = true;
        } else {
          const { data: d2 } = await supabase
            .from('Enrollment')
            .select('id')
            .eq('userId', user.id)
            .limit(1);
          if (d2 && d2.length > 0) hasEnr = true;
        }

        // 4. Fallback check on lms_student_details view by email
        if (!hasEnr && user.email) {
          try {
            const { data: vData } = await supabase
              .from('lms_student_details')
              .select('enrollment_id')
              .ilike('student_email', user.email)
              .limit(1);
            if (vData && vData.length > 0) hasEnr = true;
          } catch {
            // ignore view error
          }
        }

        setIsEnrolled(hasEnr);
      } catch {
        setIsEnrolled(true);
      } finally {
        setCheckingEnrollment(false);
      }
    }

    checkStudentEnrollment();
  }, [user, isAdmin, userRole]);

  if (loading || checkingEnrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)]" />
          <span className="text-sm text-[var(--text-secondary)]">Loading student portal...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Strictly enforce: Non-enrolled users are redirected back to website home
  if (!isEnrolled && (!isAdmin || !isAdmin())) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[var(--surface-secondary)] border-b md:border-b-0 md:border-r border-[var(--border-primary)] flex-shrink-0 sticky top-0 z-10 h-auto md:h-screen flex flex-col">
        <div className="p-4 border-b border-[var(--border-primary)] flex items-center justify-between">
          <Link to={ROUTES.PORTAL} className="flex items-center">
            <img src="/logo.png" alt="Reddix Robotics" className="h-10 w-auto object-contain" />
          </Link>
        </div>
        
        <nav className="flex-grow py-6 px-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          <Link to={ROUTES.PORTAL} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-bold transition-all whitespace-nowrap">
            <BookOpen size={20} />
            My Courses
          </Link>
          <Link to="/portal/doubts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] font-medium transition-all whitespace-nowrap">
            <HelpCircle size={20} />
            Doubt Forum
          </Link>
          <Link to="/portal/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] font-medium transition-all whitespace-nowrap">
            <User size={20} />
            Account
          </Link>
        </nav>

        <div className="p-4 border-t border-[var(--border-primary)] hidden md:block">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 font-medium transition-all">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-[var(--bg-primary)]">
        <Outlet />
      </main>
    </div>
  );
}
