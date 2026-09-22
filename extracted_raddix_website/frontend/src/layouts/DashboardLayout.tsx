import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-[var(--bg-secondary)] border-b border-[var(--border-strong)] flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-brand)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm tracking-tighter">RX</span>
          </div>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 text-[var(--text-primary)]"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-[var(--bg-secondary)] z-50 md:hidden"
            >
              <div className="absolute top-4 right-4 z-50">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              <DashboardSidebar onItemClick={() => setMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-[280px] h-screen sticky top-0 flex-shrink-0">
        <DashboardSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
