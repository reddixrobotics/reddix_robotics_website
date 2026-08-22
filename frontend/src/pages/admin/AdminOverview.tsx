import { useState, useEffect } from 'react';
import { adminMockData } from '@/data/adminMockData';
import { AdminStatCard } from '@/features/admin/components/AdminStatCard';
import { RevenueChart } from '@/features/admin/components/AdminCharts';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { Users, Package, ShoppingCart, IndianRupee, FileText, BookOpen, MessageSquare, AlertCircle, MapPin, DollarSign } from 'lucide-react';
import { StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';
import { orderService, paymentService } from '@/features/admin/services/apiService';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const { stats, revenueData, recentActivity } = adminMockData;
  const [realOrders, setRealOrders] = useState<any[]>([]);
  const [realPayments, setRealPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [ordersRes, paymentsRes] = await Promise.all([
          orderService.getAll().catch(() => []),
          paymentService.getAll().catch(() => [])
        ]);
        setRealOrders(ordersRes || []);
        setRealPayments(paymentsRes || []);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute real stats
  const totalOrders = realOrders.length;
  const pendingOrders = realOrders.filter(o => ['ORDER_PLACED', 'PROCESSING'].includes(o.status)).length;
  const completedOrders = realOrders.filter(o => ['DELIVERED', 'COMPLETED'].includes(o.status)).length;
  
  const successfulPayments = realPayments.filter(p => p.status === 'SUCCESS');
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  const orderColumns = [
    { header: 'Order ID', accessor: 'orderNumber' as const, cell: (item: any) => <span className="text-red-500 font-bold">{item.orderNumber}</span> },
    { header: 'Customer', accessor: 'customer' as const, cell: (item: any) => item.customer?.name || 'Guest' },
    { header: 'Date', accessor: 'createdAt' as const, cell: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    { header: 'Amount', accessor: 'totalAmount' as const, cell: (item: any) => `$${item.totalAmount.toLocaleString()}` },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-zinc-800 text-zinc-300">
        {item.status?.replace(/_/g, ' ')}
      </span>
    ) },
    { header: 'Action', accessor: 'id' as const, cell: () => (
      <Link to="/admin/orders">
        <Button variant="outline" size="sm" className="h-7 text-xs px-2">Manage</Button>
      </Link>
    )},
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
        <AdminStatCard title="Total Orders" value={isLoading ? '...' : totalOrders.toLocaleString()} icon={ShoppingCart} />
        <AdminStatCard title="Total Revenue" value={isLoading ? '...' : `$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
        
        <AdminStatCard title="Pending Orders" value={isLoading ? '...' : pendingOrders} icon={AlertCircle} />
        <AdminStatCard title="Applications" value={stats.applications} icon={FileText} />
        <AdminStatCard title="Workshops" value={stats.workshops} icon={BookOpen} />
        <AdminStatCard title="Completed Orders" value={isLoading ? '...' : completedOrders} icon={Package} />
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
        <h3 className="text-lg font-bold text-white mb-4">Recent Orders</h3>
        <AdminDataTable columns={orderColumns} data={realOrders} searchableKey="orderNumber" itemsPerPage={5} isLoading={isLoading} />
      </div>

    </div>
  );
}
