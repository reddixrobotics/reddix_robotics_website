import { useLocation } from 'react-router-dom';
import { Hammer } from 'lucide-react';

export default function AdminPlaceholderPage() {
  const location = useLocation();
  const pathName = location.pathname.split('/').pop() || 'Unknown';
  const pageTitle = pathName.charAt(0).toUpperCase() + pathName.slice(1);

  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
        <Hammer size={32} className="text-zinc-600" />
      </div>
      <h1 className="text-2xl font-black text-white mb-2">{pageTitle} Management</h1>
      <p className="text-zinc-400 max-w-md">
        This administration module is currently under construction. 
        Specific CRUD operations and database schemas for {pageTitle.toLowerCase()} will be implemented in a future update.
      </p>
    </div>
  );
}
