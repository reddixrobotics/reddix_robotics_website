import { useState, useEffect } from 'react';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button, Modal } from '@/components/ui';
import { Check, X } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { Link } from 'react-router-dom';

export default function DashboardOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [trackingOrder, setTrackingOrder] = useState<any | null>(null);
  const [liveTracking, setLiveTracking] = useState<any>(null);
  const [liveTrackingLoading, setLiveTrackingLoading] = useState(false);
  const [liveTrackingError, setLiveTrackingError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingOrder || !trackingOrder.shipment?.awbNumber) {
      setLiveTracking(null);
      setLiveTrackingError(null);
      return;
    }
    const fetchTracking = async () => {
      try {
        setLiveTrackingLoading(true);
        setLiveTrackingError(null);
        // We use standard fetch with the same token mechanism used by apiClient for simplicity here
        const { supabase } = await import('@/lib/supabase');
        const { data, error } = await supabase.functions.invoke('shiprocket-api', {
          body: { action: 'track', orderId: trackingOrder.id }
        });
        if (error) throw new Error(error.message || 'Failed to fetch tracking data');
        setLiveTracking(data);
      } catch (err: any) {
        setLiveTrackingError(err.message);
      } finally {
        setLiveTrackingLoading(false);
      }
    };
    fetchTracking();
  }, [trackingOrder]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const { supabase } = await import('@/lib/supabase');
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Not authenticated');

        const { data, error } = await supabase
          .from('Order')
          .select('*, items:OrderItem(*, product:Product(*, images:ProductImage(*))), shipment:Shipment(*)')
          .eq('customerId', userData.user.id)
          .neq('status', 'ORDER_PLACED')
          .order('createdAt', { ascending: false });
          
        if (error) throw error;
        setOrders(data || []);
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
                {trackingOrder.shipment.awbNumber && (
                    <p className="text-xs text-[var(--color-brand)] font-mono mt-1">AWB: {trackingOrder.shipment.awbNumber}</p>
                )}
              </div>

              {liveTrackingLoading ? (
                <div className="flex justify-center p-8">
                  <div className="h-6 w-6 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)]" />
                </div>
              ) : liveTracking && liveTracking.tracking_data?.track_status === 1 ? (
                <div className="flex flex-col gap-6 relative ml-2 mb-8 max-h-[300px] overflow-y-auto pr-2">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[var(--border-strong)] z-0" />
                  
                  {liveTracking.tracking_data.shipment_track.map((track: any, idx: number) => (
                    <div key={idx} className="relative z-10 flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 bg-[var(--bg-primary)] border-[var(--color-brand)] text-[var(--color-brand)]">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-brand)]" />
                      </div>
                      <div className="pb-1">
                        <p className="font-semibold text-sm text-white">{track.activity || 'Status Update'}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{new Date(track.date).toLocaleString()} - {track.location}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!liveTracking.tracking_data.shipment_track || liveTracking.tracking_data.shipment_track.length === 0) && (
                     <p className="text-sm text-[var(--text-secondary)] pl-8">Awaiting courier updates...</p>
                  )}
                </div>
              ) : liveTrackingError ? (
                <p className="text-sm text-red-400 mb-6">{liveTrackingError}</p>
              ) : (
                <p className="text-sm text-[var(--text-secondary)] mb-6">Tracking timeline is not available yet.</p>
              )}

              {trackingOrder.shipment.trackingUrl ? (
                <a 
                  href={trackingOrder.shipment.trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center bg-[var(--surface-tertiary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-sm font-medium border border-[var(--border-subtle)]"
                >
                  View on Courier Website
                </a>
              ) : trackingOrder.shipment.provider === 'SHIPROCKET' && trackingOrder.shipment.awbNumber ? (
                <a 
                  href={`https://shiprocket.co/tracking/${trackingOrder.shipment.awbNumber}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 text-center bg-[var(--surface-tertiary)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors text-sm font-medium border border-[var(--border-subtle)]"
                >
                  Track via Shiprocket
                </a>
              ) : null}
            </div>
          )}
        </Modal>
    </div>
  );
}
