import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';
import { BookOpen, HelpCircle, User, LogOut } from 'lucide-react';

export default function PortalLayout() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">Loading portal...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // NOTE: Later we will check if they have active enrollments to bounce them entirely,
  // but for now any logged in user can see the portal skeleton.

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[var(--surface-secondary)] border-b md:border-b-0 md:border-r border-[var(--border-primary)] flex-shrink-0 sticky top-0 z-10 h-auto md:h-screen flex flex-col">
        <div className="p-6 border-b border-[var(--border-primary)]">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-[var(--color-brand)]">REDDIX</span>
            <span className="text-xl font-light tracking-widest text-[var(--text-primary)]">LMS</span>
          </Link>
        </div>
        
        <nav className="flex-grow py-6 px-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          <Link to={ROUTES.PORTAL} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-bold transition-all whitespace-nowrap">
            <BookOpen size={20} />
            My Courses
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] font-medium transition-all whitespace-nowrap">
            <HelpCircle size={20} />
            Doubt Forum
          </Link>
          <Link to={ROUTES.PROFILE} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] font-medium transition-all whitespace-nowrap">
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
