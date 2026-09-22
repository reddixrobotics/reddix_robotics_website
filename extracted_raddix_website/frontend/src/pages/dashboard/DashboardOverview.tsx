import { Package, IndianRupee, FileText, Bookmark } from 'lucide-react';
import { dashboardData } from '@/data/dashboard';
import { StatCard, DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';

export default function DashboardOverview() {
  const { stats, recentOrders, user } = dashboardData;

  const orderColumns = [
    { header: 'Order ID', accessor: 'id' as const, cell: (item: any) => <span className="font-mono text-[var(--color-brand)]">{item.id}</span> },
    { header: 'Date', accessor: 'date' as const },
    { header: 'Amount', accessor: 'amount' as const },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-display-sm mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Here's an overview of your account activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} />
        <StatCard title="Pending Payments" value={stats.pendingPayments} icon={IndianRupee} trend="Due soon" />
        <StatCard title="Active Applications" value={stats.activeApplications} icon={FileText} />
        <StatCard title="Saved Products" value={stats.savedProducts} icon={Bookmark} />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Button variant="outline" as={Link} to={ROUTES.DASHBOARD_ORDERS}>View All</Button>
        </div>
        <DataTable columns={orderColumns} data={recentOrders} />
      </div>

    </div>
  );
}
