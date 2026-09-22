import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { 
  LayoutDashboard, Building, Users, Map, Briefcase, Package, Tags, 
  ShoppingCart, CreditCard, GraduationCap, School, BookOpen, 
  FileText, HardHat, UserCircle, MessageSquare, Settings, LogOut, Video
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';
import { dashboardService } from '@/features/admin/services/apiService';

const coreNav = [
  { name: 'Dashboard', href: ROUTES.ADMIN, icon: LayoutDashboard },
  { name: 'Company', href: ROUTES.ADMIN_COMPANY, icon: Building },
  { name: 'Employees', href: ROUTES.ADMIN_EMPLOYEES, icon: Users },
  { name: 'Journeys', href: ROUTES.ADMIN_JOURNEYS, icon: Map },
];

const catalogNav = [
  { name: 'Portfolio Projects', href: ROUTES.ADMIN_PROJECTS, icon: Briefcase },
  { name: 'Products', href: ROUTES.ADMIN_PRODUCTS, icon: Package },
];

const operationsNav = [
  { name: 'Orders', href: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
  { name: 'Payments', href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
];

const hrNav = [
  { name: 'Jobs', href: ROUTES.ADMIN_JOBS, icon: GraduationCap },
  { name: 'Internships', href: ROUTES.ADMIN_INTERNSHIPS, icon: School },
  { name: 'Workshops', href: ROUTES.ADMIN_WORKSHOPS, icon: BookOpen },
  { name: 'Workshop Media', href: ROUTES.ADMIN_WORKSHOP_MEDIA, icon: Video },
  { name: 'Applications', href: ROUTES.ADMIN_APPLICATIONS, icon: FileText },
];

const systemNav = [
  { name: 'Users', href: ROUTES.ADMIN_USERS, icon: UserCircle },
  { name: 'Messages', href: ROUTES.ADMIN_MESSAGES, icon: MessageSquare },
  { name: 'Settings', href: ROUTES.ADMIN_SETTINGS, icon: Settings },
];

interface AdminSidebarProps {
  onItemClick?: () => void;
}

export default function AdminSidebar({ onItemClick }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout, userRole } = useAuth();
  
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const stats = await dashboardService.getStats();
        setUnreadCount(stats.messages || 0);
      } catch (err) {
        console.error("Failed to fetch unread messages", err);
      }
    };
    fetchUnread();
    
    const interval = setInterval(fetchUnread, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const renderLinks = (items: any[]) => (
    <ul className="space-y-0.5">
      {items.map(item => {
        // Only show Users to SUPER_ADMIN
        if (item.name === 'Users' && userRole !== 'SUPER_ADMIN') {
          return null;
        }

        const isActive = location.pathname === item.href;
        return (
          <li key={item.name}>
            <Link
              to={item.href}
              onClick={onItemClick}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <item.icon 
                size={20} 
                className={`mr-3 ${isActive ? 'text-[var(--color-brand)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}
              />
              <span className="font-medium text-sm flex-1">{item.name}</span>
              {item.name === 'Messages' && unreadCount > 0 && (
                <span className="bg-[var(--color-brand)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full ml-2">
                  {unreadCount}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border-strong)]">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-strong)] flex-shrink-0">
        <Link to={ROUTES.ADMIN} className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Reddix Robotics Logo" className="h-8 w-auto object-contain transition-transform duration-150 group-hover:scale-95" />
          <span className="text-sm font-bold tracking-tight text-[var(--text-primary)] uppercase ml-2">Admin</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        
        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Core</h3>
          {renderLinks(coreNav)}
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Catalog</h3>
          {renderLinks(catalogNav)}
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Operations</h3>
          {renderLinks(operationsNav)}
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">HR & Partnerships</h3>
          {renderLinks(hrNav)}
        </div>

        <div className="mb-4">
          <h3 className="px-3 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">System</h3>
          {renderLinks(systemNav)}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[var(--border-strong)] bg-[var(--bg-secondary)]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-lg text-[var(--color-brand)] hover:bg-[var(--color-brand)]/10 transition-colors group text-left"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium text-sm">Logout Admin</span>
        </button>
      </div>
    </div>
  );
}
