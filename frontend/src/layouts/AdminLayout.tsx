import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, UserCircle } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import DevDataBanner from '@/features/admin/components/DevDataBanner';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  return (
    // Note: We use 'dark' class inherently if we want to enforce dark mode internally
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-surface-secondary border-b border-border-strong flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Reddix Robotics Logo" className="h-8 w-auto object-contain" />
          <span className="text-sm font-bold text-content">Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 text-content-secondary hover:text-content"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-surface-overlay backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-surface-secondary z-50 md:hidden border-r border-border-strong"
            >
              <div className="absolute top-3 right-3 z-50">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-content-secondary hover:text-content rounded bg-surface-tertiary"
                >
                  <X size={18} />
                </button>
              </div>
              <AdminSidebar onItemClick={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[260px] h-screen sticky top-0 flex-shrink-0">
        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-surface-secondary border-b border-border flex-shrink-0 items-center justify-between px-6 sticky top-0 z-30">
          <div className="text-sm font-medium text-content-secondary">
            {/* Breadcrumbs or greeting could go here */}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1.5 text-content-secondary hover:text-content rounded-full hover:bg-surface-tertiary transition-colors">
              <Bell size={20} />
            </button>
            <ThemeToggle />
            <div className="h-6 w-px bg-border mx-1"></div>
            <button className="flex items-center gap-2 p-1.5 text-content-secondary hover:text-content rounded-full hover:bg-surface-tertiary transition-colors">
              <UserCircle size={22} />
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </header>

        <DevDataBanner />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
