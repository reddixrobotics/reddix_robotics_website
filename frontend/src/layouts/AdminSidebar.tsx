import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { 
  LayoutDashboard, Building, Users, Briefcase, Package, Tags, 
  ShoppingCart, CreditCard, GraduationCap, School, BookOpen, 
  FileText, HardHat, UserCircle, MessageSquare, Settings, LogOut 
} from 'lucide-react';
import apiClient from '@/services/apiClient';
import { useAuth } from '@/context/AuthContext';

const coreNav = [
  { name: 'Dashboard', href: ROUTES.ADMIN, icon: LayoutDashboard },
  { name: 'Company', href: ROUTES.ADMIN_COMPANY, icon: Building },
  { name: 'Employees', href: ROUTES.ADMIN_EMPLOYEES, icon: Users },
];

const catalogNav = [
  { name: 'Projects', href: ROUTES.ADMIN_PROJECTS, icon: Briefcase },
  { name: 'Products', href: ROUTES.ADMIN_PRODUCTS, icon: Package },
  { name: 'Categories', href: ROUTES.ADMIN_CATEGORIES, icon: Tags },
];

const operationsNav = [
  { name: 'Orders', href: ROUTES.ADMIN_ORDERS, icon: ShoppingCart },
  { name: 'Payments', href: ROUTES.ADMIN_PAYMENTS, icon: CreditCard },
];

const hrNav = [
  { name: 'Jobs', href: ROUTES.ADMIN_JOBS, icon: GraduationCap },
  { name: 'Internships', href: ROUTES.ADMIN_INTERNSHIPS, icon: School },
  { name: 'Workshops', href: ROUTES.ADMIN_WORKSHOPS, icon: BookOpen },
  { name: 'Applications', href: ROUTES.ADMIN_APPLICATIONS, icon: FileText },
  { name: 'Contractors', href: ROUTES.ADMIN_CONTRACTORS, icon: HardHat },
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

  const { logout } = useAuth();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  const renderLinks = (items: any[]) => (
    <ul className="space-y-0.5">
      {items.map(item => {
        const isActive = location.pathname === item.href;
        return (
          <li key={item.name}>
            <Link
              to={item.href}
              onClick={onItemClick}
              className={`flex items-center px-3 py-2 rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-red-500/10 text-red-500' 
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon 
                size={18} 
                className={`mr-3 ${isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}
              />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="flex flex-col h-full bg-[#111] border-r border-zinc-800 font-mono text-zinc-300">
      
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800 flex-shrink-0">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-black text-xs tracking-tighter">RX</span>
          </div>
          <span className="text-sm font-bold tracking-tight text-white uppercase">System Admin</span>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        
        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Core</h3>
          {renderLinks(coreNav)}
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Catalog</h3>
          {renderLinks(catalogNav)}
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Operations</h3>
          {renderLinks(operationsNav)}
        </div>

        <div className="mb-6">
          <h3 className="px-3 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">HR & Partnerships</h3>
          {renderLinks(hrNav)}
        </div>

        <div className="mb-4">
          <h3 className="px-3 text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">System</h3>
          {renderLinks(systemNav)}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-zinc-800 bg-[#0a0a0a]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors group text-left"
        >
          <LogOut size={18} className="mr-3" />
          <span className="font-medium text-sm">Terminate Session</span>
        </button>
      </div>
    </div>
  );
}
