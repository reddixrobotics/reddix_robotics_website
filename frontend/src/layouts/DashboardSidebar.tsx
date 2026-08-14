import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { 
  LayoutDashboard, 
  User, 
  Package, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: SidebarItem[] = [
  { name: 'Overview', href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: 'Profile', href: ROUTES.DASHBOARD_PROFILE, icon: User },
  { name: 'Orders', href: ROUTES.DASHBOARD_ORDERS, icon: Package },
  { name: 'Payments', href: ROUTES.DASHBOARD_PAYMENTS, icon: CreditCard },
  { name: 'Applications', href: ROUTES.DASHBOARD_APPLICATIONS, icon: FileText },
  { name: 'Settings', href: ROUTES.DASHBOARD_SETTINGS, icon: Settings },
];

interface DashboardSidebarProps {
  onItemClick?: () => void;
}

export default function DashboardSidebar({ onItemClick }: DashboardSidebarProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)] border-r border-[var(--border-strong)]">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-[var(--border-strong)] flex-shrink-0">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[var(--color-brand)] rounded-lg flex items-center justify-center shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
            <span className="text-white font-bold text-sm tracking-tighter">RX</span>
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--text-primary)]">Reddix</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
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
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-[var(--border-strong)]">
        <Link
          to={ROUTES.LOGIN}
          className="flex items-center px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors group"
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
}
