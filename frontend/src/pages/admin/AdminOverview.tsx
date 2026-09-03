/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';

import { AdminStatCard } from '@/features/admin/components/AdminStatCard';
import { RevenueChart } from '@/features/admin/components/AdminCharts';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { Users, Package, ShoppingCart, IndianRupee, FileText, BookOpen, MessageSquare, AlertCircle, MapPin, DollarSign } from 'lucide-react';
import { StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';
import { orderService, paymentService, dashboardService } from '@/features/admin/services/apiService';
import { Link } from 'react-router-dom';

export default function AdminOverview() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await dashboardService.getStats();
        setDashboardData(data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = dashboardData?.stats || {
    totalUsers: 0, totalProducts: 0, totalOrders: 0, revenue: 0, pendingOrders: 0, applications: 0, workshops: 0, messages: 0
  };
  const revenueData = dashboardData?.revenueData || [];
  const recentActivity = dashboardData?.recentActivity || [];
  const realOrders = dashboardData?.orders || [];
  const completedOrders = stats.totalOrders - stats.pendingOrders;

  const orderColumns = [
    { header: 'Order ID', accessor: 'id' as const, cell: (item: any) => <span className="text-red-500 font-bold">{item.id}</span> },
    { header: 'Customer', accessor: 'customer' as const, cell: (item: any) => item.customer },
    { header: 'Date', accessor: 'date' as const, cell: (item: any) => item.date },
    { header: 'Amount', accessor: 'amount' as const, cell: (item: any) => `₹${item.amount.toLocaleString()}` },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-surface-tertiary text-content-secondary">
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
          <h1 className="text-2xl font-black text-content mb-1">System Overview</h1>
          <p className="text-sm text-content-secondary">Monitor key metrics and recent system activity.</p>
        </div>
        <div className="text-xs text-content-tertiary font-medium">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard title="Total Users" value={isLoading ? '...' : stats.totalUsers.toLocaleString()} icon={Users} />
        <AdminStatCard title="Total Products" value={isLoading ? '...' : stats.totalProducts} icon={Package} />
        <AdminStatCard title="Total Orders" value={isLoading ? '...' : stats.totalOrders.toLocaleString()} icon={ShoppingCart} />
        <AdminStatCard title="Total Revenue" value={isLoading ? '...' : `₹${stats.revenue.toLocaleString()}`} icon={IndianRupee} />
        
        <AdminStatCard title="Pending Orders" value={isLoading ? '...' : stats.pendingOrders} icon={AlertCircle} />
        <AdminStatCard title="Applications" value={isLoading ? '...' : stats.applications} icon={FileText} />
        <AdminStatCard title="Workshops" value={isLoading ? '...' : stats.workshops} icon={BookOpen} />
        <AdminStatCard title="Completed Orders" value={isLoading ? '...' : completedOrders} icon={Package} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Section */}
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>

        {/* Activity Feed */}
        <div className="bg-surface border border-border rounded-xl p-5 flex flex-col h-[350px]">
          <h3 className="text-sm font-bold text-content-secondary mb-4 flex-shrink-0">Recent Activity Log</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="relative pl-4 border-l border-border">
                <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-red-500" />
                <p className="text-sm text-content-secondary mb-1">{activity.message}</p>
                <p className="text-xs text-content-tertiary">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Data Table Section */}
      <div>
        <h3 className="text-lg font-bold text-content mb-4">Recent Orders</h3>
        <AdminDataTable columns={orderColumns} data={realOrders} searchableKey="id" itemsPerPage={5} isLoading={isLoading} />
      </div>

    </div>
  );
}
