import { dashboardData } from '@/data/dashboard';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';

export default function DashboardOrders() {
  const { recentOrders } = dashboardData;

  const columns = [
    { header: 'Order ID', accessor: 'id' as const, cell: (item: any) => <span className="font-mono text-[var(--color-brand)] font-medium">{item.id}</span> },
    { header: 'Date', accessor: 'date' as const },
    { header: 'Products', accessor: 'products' as const, cell: (item: any) => (
        <div className="flex flex-col gap-1">
          {item.products.map((p: string, i: number) => (
            <span key={i} className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-strong)] inline-block w-max">{p}</span>
          ))}
        </div>
      )
    },
    { header: 'Amount', accessor: 'amount' as const },
    { header: 'Advance Paid (50%)', accessor: 'deposit' as const },
    { header: 'Balance (50%)', accessor: 'deposit' as const }, // In our mock data, they are the same amount
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
    { header: 'Action', accessor: 'id' as const, cell: () => <Button variant="outline" size="sm">View Details</Button> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Order History</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">View and manage your industrial equipment orders.</p>
      </div>

      <DataTable columns={columns} data={recentOrders} />
    </div>
  );
}
