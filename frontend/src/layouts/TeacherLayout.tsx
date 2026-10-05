import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';
import { MessageCircle, LogOut } from 'lucide-react';

export default function TeacherLayout() {
  const { user, logout, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        Loading...
      </div>
    );
  }

  if (!user || userRole !== 'TEACHER') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[var(--surface-secondary)] border-b md:border-b-0 md:border-r border-[var(--border-primary)] flex-shrink-0 sticky top-0 z-10 h-auto md:h-screen flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-[var(--border-primary)]">
          <Link to={ROUTES.TEACHER} className="flex items-center">
            <img src="/logo.png" alt="Reddix Robotics" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Portal label */}
        <div className="px-4 py-2 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Teacher Portal
        </div>

        {/* Nav */}
        <nav className="flex-grow py-4 px-4 space-y-2">
          <Link
            to={ROUTES.TEACHER}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-bold transition-all"
          >
            <MessageCircle size={20} />
            Doubt Forum
          </Link>
        </nav>

        {/* Bottom: email + logout */}
        <div className="p-4 border-t border-[var(--border-primary)]">
          <p className="text-xs text-[var(--text-secondary)] truncate px-2 mb-2">{user.email}</p>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 font-medium transition-all"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-[var(--bg-primary)]">
        <Outlet />
      </main>
    </div>
  );
}
