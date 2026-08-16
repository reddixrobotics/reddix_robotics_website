import { useState, useEffect } from 'react';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';
import apiClient from '@/services/apiClient';
import { formatCurrency } from '@/utils';
import { Link } from 'react-router-dom';

export default function DashboardOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/api/orders');
        setOrders(res.data);
      } catch (err: any) {
        console.error('Failed to fetch orders:', err);
        setError('Failed to load your order history. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const columns = [
    { header: 'Order Number', accessor: 'orderNumber' as const, cell: (item: any) => <span className="font-mono text-[var(--color-brand)] font-medium">{item.orderNumber}</span> },
    { header: 'Date', accessor: 'createdAt' as const, cell: (item: any) => new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
    { header: 'Products', accessor: 'items' as const, cell: (item: any) => (
        <div className="flex flex-col gap-1">
          {item.items.map((orderItem: any) => (
            <span key={orderItem.id} className="text-xs bg-[var(--bg-primary)] px-2 py-1 rounded border border-[var(--border-strong)] inline-block w-max">
              {orderItem.product.name} × {orderItem.quantity}
            </span>
          ))}
        </div>
      )
    },
    { header: 'Amount', accessor: 'totalAmount' as const, cell: (item: any) => formatCurrency(item.totalAmount) },
    { header: 'Advance Paid', accessor: 'advanceAmount' as const, cell: (item: any) => formatCurrency(item.advanceAmount) },
    { header: 'Balance', accessor: 'remainingAmount' as const, cell: (item: any) => formatCurrency(item.remainingAmount) },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)]">
        <h2 className="text-xl font-semibold mb-2 text-red-500">{error}</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)]">
        <h2 className="text-xl font-semibold mb-2">You haven't placed any orders yet.</h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-md">
          Once you place an order, it will appear here.
        </p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Order History</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">View and manage your industrial equipment orders.</p>
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
}
