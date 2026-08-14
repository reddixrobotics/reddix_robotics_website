import { dashboardData } from '@/data/dashboard';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';
import { CreditCard } from 'lucide-react';

export default function DashboardPayments() {
  const { pendingPayments } = dashboardData;

  const columns = [
    { header: 'Payment ID', accessor: 'id' as const, cell: (item: any) => <span className="font-mono">{item.id}</span> },
    { header: 'Order ID', accessor: 'orderId' as const, cell: (item: any) => <span className="font-mono text-[var(--color-brand)]">{item.orderId}</span> },
    { header: 'Due Date', accessor: 'dueDate' as const },
    { header: 'Amount', accessor: 'amount' as const, cell: (item: any) => <span className="font-bold">{item.amount}</span> },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
    { header: 'Action', accessor: 'id' as const, cell: () => <Button size="sm" className="w-max"><CreditCard size={14} className="mr-2" /> Pay Now</Button> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Payments & Invoices</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Manage your deposits, balances, and payment history.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Pending Payments</h2>
        <DataTable columns={columns} data={pendingPayments} emptyMessage="No pending payments." />
      </div>

      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-bold">Payment History</h2>
        {/* Mock empty state for history */}
        <DataTable columns={columns} data={[]} emptyMessage="No past payments found." />
      </div>
    </div>
  );
}
