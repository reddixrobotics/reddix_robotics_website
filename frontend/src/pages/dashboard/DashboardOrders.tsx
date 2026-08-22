import { useState, useEffect } from 'react';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button, Modal } from '@/components/ui';
import { Check, X } from 'lucide-react';
import apiClient from '@/services/apiClient';
import { formatCurrency } from '@/utils';
import { Link } from 'react-router-dom';

export default function DashboardOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);

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

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'CREATED':
      case 'READY_TO_SHIP':
      case 'PICKUP_REQUESTED': return 0;
      case 'PICKED_UP': return 1;
      case 'IN_TRANSIT': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      case 'DELIVERY_FAILED':
      case 'RTO':
      case 'CANCELLED': return -1;
      default: return 0;
    }
  };

  const steps = [
    { label: 'Order Placed', desc: 'We have received your order' },
    { label: 'Shipped', desc: 'Courier has picked up your package' },
    { label: 'In Transit', desc: 'Package is on its way' },
    { label: 'Out for Delivery', desc: 'Package will be delivered today' },
    { label: 'Delivered', desc: 'Package has been delivered' },
  ];

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
    { header: 'Tracking', accessor: 'shipment' as const, cell: (item: any) => {
        if (!item.shipment) return <span className="text-xs text-[var(--text-tertiary)] italic">Processing</span>;
        return (
          <button 
             onClick={() => setTrackingOrder(item)}
             className="text-xs text-[var(--color-brand)] font-medium hover:underline flex items-center gap-1"
          >
             Track Shipment
          </button>
        );
      }
    },
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

      <Modal open={!!trackingOrder} onClose={() => setTrackingOrder(null)}>
        {trackingOrder?.shipment && (
          <div className="p-4 sm:p-6">
            <div className="mb-6 pb-4 border-b border-[var(--border-subtle)]">
              <h3 className="text-lg font-bold mb-1">Track Shipment</h3>
              <p className="text-sm text-[var(--text-secondary)]">Order #{trackingOrder.orderNumber}</p>
            </div>

            <div className="flex flex-col gap-6 relative ml-2 mb-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[var(--border-strong)] z-0" />
              {steps.map((step, idx) => {
                const currentIndex = getStepIndex(trackingOrder.shipment.status);
                const isCompleted = currentIndex >= idx;
                const isFailed = trackingOrder.shipment.status === 'CANCELLED' || trackingOrder.shipment.status === 'DELIVERY_FAILED' || trackingOrder.shipment.status === 'RTO';
                
                return (
                  <div key={idx} className="relative z-10 flex gap-4 items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      isCompleted 
                        ? 'bg-[var(--color-brand)] border-[var(--color-brand)] text-white' 
                        : 'bg-[var(--bg-primary)] border-[var(--border-strong)] text-transparent'
                    }`}>
                      {isCompleted && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div className="pb-1">
                      <p className={`font-semibold text-sm ${isCompleted ? 'text-white' : 'text-[var(--text-tertiary)]'}`}>{step.label}</p>
                      <p className={`text-xs ${isCompleted ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)]'}`}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
              
              {(trackingOrder.shipment.status === 'CANCELLED' || trackingOrder.shipment.status === 'DELIVERY_FAILED' || trackingOrder.shipment.status === 'RTO') && (
                <div className="relative z-10 flex gap-4 items-start mt-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 bg-red-500 border-red-500 text-white">
                    <X size={12} strokeWidth={3} />
                  </div>
                  <div className="pb-1">
                    <p className="font-semibold text-sm text-red-500">Delivery Failed / Cancelled</p>
                    <p className="text-xs text-[var(--text-secondary)]">Status: {trackingOrder.shipment.status.replace(/_/g, ' ')}</p>
                  </div>
                </div>
              )}
            </div>

            {(trackingOrder.shipment.courier || trackingOrder.shipment.awbNumber) && (
              <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-4 rounded-xl mb-4">
                <p className="text-sm font-medium mb-2">Courier Details</p>
                {trackingOrder.shipment.courier && (
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)]">Provider:</span>
                    <span className="font-medium">{trackingOrder.shipment.courier}</span>
                  </div>
                )}
                {trackingOrder.shipment.awbNumber && (
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">AWB / Tracking Number:</span>
                    <span className="font-mono text-[var(--color-brand)]">{trackingOrder.shipment.awbNumber}</span>
                  </div>
                )}
              </div>
            )}

            {trackingOrder.shipment.trackingUrl && (
              <a 
                href={trackingOrder.shipment.trackingUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex justify-center w-full py-2.5 bg-[var(--color-brand)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Track on Courier Website
              </a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
