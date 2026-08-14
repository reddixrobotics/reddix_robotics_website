import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import DevDataBanner from '@/features/admin/components/DevDataBanner';

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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-mono flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <header className="md:hidden h-14 bg-[#111] border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-black text-[10px] tracking-tighter">RX</span>
          </div>
          <span className="text-xs font-bold text-white uppercase">Admin</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-1.5 text-zinc-400 hover:text-white"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-[#111] z-50 md:hidden border-r border-zinc-800"
            >
              <div className="absolute top-3 right-3 z-50">
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded bg-zinc-800/50"
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
        <DevDataBanner />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
