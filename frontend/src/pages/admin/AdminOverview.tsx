import { adminMockData } from '@/data/adminMockData';
import { AdminStatCard } from '@/features/admin/components/AdminStatCard';
import { RevenueChart } from '@/features/admin/components/AdminCharts';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { Users, Package, ShoppingCart, IndianRupee, FileText, BookOpen, MessageSquare, AlertCircle, MapPin } from 'lucide-react';
import { StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';

export default function AdminOverview() {
  const { stats, revenueData, recentActivity, orders } = adminMockData;

  const orderColumns = [
    { header: 'Order ID', accessor: 'id' as const, cell: (item: any) => <span className="text-red-500 font-bold">{item.id}</span> },
    { header: 'Customer', accessor: 'customer' as const },
    { header: 'Date', accessor: 'date' as const },
    { header: 'Amount', accessor: 'amount' as const, cell: (item: any) => `₹${item.amount.toLocaleString()}` },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
    { header: 'Action', accessor: 'id' as const, cell: () => <Button variant="outline" size="sm" className="h-7 text-xs px-2">Manage</Button> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white mb-1">System Overview</h1>
          <p className="text-sm text-zinc-400">Monitor key metrics and recent system activity.</p>
        </div>
        <div className="text-xs text-zinc-500 font-medium">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard title="Total Users" value={stats.totalUsers.toLocaleString()} icon={Users} />
        <AdminStatCard title="Total Products" value={stats.totalProducts} icon={Package} />
        <AdminStatCard title="Total Orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingCart} />
        <AdminStatCard title="Revenue (YTD)" value={stats.revenue} icon={IndianRupee} />
        
        <AdminStatCard title="Pending Orders" value={stats.pendingOrders} icon={AlertCircle} />
        <AdminStatCard title="Applications" value={stats.applications} icon={FileText} />
        <AdminStatCard title="Workshops" value={stats.workshops} icon={BookOpen} />
        <AdminStatCard title="Messages" value={stats.messages} icon={MessageSquare} />
        <AdminStatCard title="Company Location" value="Silicon Valley, CA" icon={MapPin} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        {/* Activity Feed */}
        <div className="bg-[#111] border border-zinc-800 rounded-xl p-5 flex flex-col h-[350px]">
          <h3 className="text-sm font-bold text-zinc-300 mb-4 flex-shrink-0">Recent Activity Log</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="relative pl-4 border-l border-zinc-800">
                <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm text-zinc-300 mb-1">{activity.message}</p>
                <p className="text-xs text-zinc-500">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Data Table Section */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Manage Orders</h3>
        {/* We pass searchableKey="customer" to enable filtering by customer name */}
        <AdminDataTable columns={orderColumns} data={orders} searchableKey="customer" itemsPerPage={5} />
      </div>

    </div>
  );
}
