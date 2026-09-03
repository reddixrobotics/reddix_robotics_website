/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { orderService } from '@/features/admin/services/apiService';
import { Eye, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui';

export default function AdminOrders() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await orderService.getAll();
      setData(items);
    } catch (error) {
      console.error('Failed to load orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedOrder?.id) return;
    setIsSubmitting(true);
    try {
      await orderService.updateStatus(selectedOrder.id, status);
      await loadData();
      // Update selected order with new status
      setSelectedOrder({ ...selectedOrder, status });
    } catch (error: any) {
      alert(error.message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Order ID', accessor: 'orderNumber' as const },
    { 
      header: 'Customer', 
      accessor: 'customer' as const, 
      cell: (item: any) => (
        <button 
          onClick={() => { openDetails(item); }} 
          className="text-blue-400 hover:text-blue-300 hover:underline font-medium text-left"
        >
          {item.customer?.name || 'Guest'}
        </button>
      ) 
    },
    { header: 'Product(s)', accessor: 'items' as const, cell: (item: any) => (
      <span className="truncate max-w-[150px] inline-block" title={item.items?.map((i: any) => i.product?.name).filter(Boolean).join(', ')}>
        {item.items?.map((i: any) => i.product?.name).filter(Boolean).join(', ') || 'N/A'}
      </span>
    )},
    { header: 'Total Value', accessor: 'totalAmount' as const, cell: (item: any) => `$${item.totalAmount.toLocaleString()}` },
    { header: 'Amount Paid', accessor: 'advanceAmount' as const, cell: (item: any) => `$${item.advanceAmount.toLocaleString()}` },
    { header: 'Remaining', accessor: 'remainingAmount' as const, cell: (item: any) => `$${item.remainingAmount.toLocaleString()}` },
    { header: 'Payment', accessor: 'paymentStatus' as const, cell: (item: any) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.paymentStatus === 'FULLY_PAID' ? 'bg-green-500/20 text-green-400' : item.paymentStatus === 'PARTIALLY_PAID' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
        {item.paymentStatus}
      </span>
    )},
    { header: 'Courier', accessor: 'shipment' as const, cell: (item: any) => (
      item.shipment ? (
        <span className="text-xs text-content-secondary">{item.shipment.courier}</span>
      ) : (
        <button onClick={() => { openDetails(item); }} className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-600/40">
          Create Shipment
        </button>
      )
    )},
    { header: 'AWB', accessor: 'shipment' as const, cell: (item: any) => (
      <span className="font-mono text-xs">{item.shipment?.awbNumber || '--'}</span>
    )},
    { header: 'Shipment Status', accessor: 'shipment' as const, cell: (item: any) => (
      item.shipment?.status ? (
        <span className="px-2 py-1 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-400">
          {item.shipment.status.replace(/_/g, ' ')}
        </span>
      ) : (
        <span className="text-zinc-600 text-[10px] italic">NOT CREATED</span>
      )
    )},
    { header: 'Order Status', accessor: 'status' as const, cell: (item: any) => (
      <span className="px-2 py-1 rounded text-xs font-semibold bg-surface-tertiary text-content-secondary">
        {item.status.replace(/_/g, ' ')}
      </span>
    )},
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { openDetails(item); }} className="p-1.5 text-content-secondary hover:text-content bg-surface-tertiary rounded">
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-content mb-1">Orders Management</h1>
          <p className="text-sm text-content-secondary">View and manage customer orders and statuses.</p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchPlaceholder="Search by Order ID..."
        searchableKey="orderNumber"
        filters={[
          {
            key: 'status',
            label: 'Order Status',
            options: [
              { label: 'Order Placed', value: 'ORDER_PLACED' },
              { label: 'Order Confirmed', value: 'ORDER_CONFIRMED' },
              { label: 'Processing', value: 'PROCESSING' },
              { label: 'Shipped', value: 'SHIPPED' },
              { label: 'Delivered', value: 'DELIVERED' },
              { label: 'Cancelled', value: 'CANCELLED' },
            ]
          },
          {
            key: 'paymentStatus',
            label: 'Payment Status',
            options: [
              { label: 'Pending', value: 'PENDING' },
              { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
              { label: 'Fully Paid', value: 'FULLY_PAID' },
            ]
          }
        ]}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        title="Order Details"
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-content-tertiary block mb-1">Order Number</span>
                <span className="text-content font-medium">{selectedOrder.orderNumber}</span>
              </div>
              <div>
                <span className="text-content-tertiary block mb-1">Date</span>
                <span className="text-content font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-content-tertiary block mb-1">Customer Name</span>
                <span className="text-content font-medium">{selectedOrder.customer?.name || 'Guest'}</span>
              </div>
              <div>
                <span className="text-content-tertiary block mb-1">Customer Email</span>
                <span className="text-content font-medium">{selectedOrder.customer?.email || 'N/A'}</span>
              </div>
            </div>

            {/* Shipment Section */}
            <div className="border-t border-border pt-4">
              <h3 className="text-content font-semibold mb-3">Shipment</h3>
              
              {!selectedOrder.shipment ? (
                <div className="bg-surface-card border border-border rounded p-4">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-yellow-400 mb-1">⚠️ Manual Delhivery Shipment</p>
                    <p className="text-xs text-content-secondary mb-2">Create the shipment in Delhivery One first. Then enter the AWB number here.</p>
                    
                    <div className="text-xs text-content-secondary bg-zinc-950 p-3 rounded mt-3">
                      <p className="font-semibold mb-1">Workflow:</p>
                      <ul className="list-decimal pl-4 space-y-1 text-content-secondary">
                        <li>Create the shipment manually in Delhivery One.</li>
                        <li>Copy the AWB/tracking number from Delhivery.</li>
                        <li>Click below to initialize the shipment in our system.</li>
                        <li>Enter the AWB and tracking URL.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      try {
                        setIsSubmitting(true);
                        await orderService.createShipment(selectedOrder.id, { courier: 'DELHIVERY' });
                        await loadData();
                        // Close and reopen to refresh or rely on parent refetch (here we just reload data and close modal for simplicity or fetch specific order)
                        // For smooth UI, we manually patch the state
                        setSelectedOrder({ ...selectedOrder, shipment: { courier: 'DELHIVERY', status: 'CREATED', awbNumber: null, trackingUrl: null } });
                      } catch (error: any) {
                        alert(error.message || 'Failed to create shipment');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting || selectedOrder.paymentStatus === 'PENDING'}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-content rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {selectedOrder.paymentStatus === 'PENDING' ? 'Cannot Ship Unpaid Order' : 'Initialize Shipment Entry'}
                  </button>
                </div>
              ) : (
                <div className="bg-surface-card border border-border rounded p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-content-tertiary text-xs block">Courier</span>
                      <span className="text-content font-medium">{selectedOrder.shipment.courier}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-content-tertiary text-xs block">Status</span>
                      <select 
                        value={selectedOrder.shipment.status}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            setIsSubmitting(true);
                            await orderService.updateShipment(selectedOrder.id, { status: newStatus });
                            await loadData();
                            setSelectedOrder(prev => prev ? { ...prev, shipment: { ...prev.shipment, status: newStatus } } : prev);
                          } catch (error: any) {
                            alert(error.message || 'Failed to update status');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        disabled={isSubmitting}
                        className="bg-zinc-950 border border-border text-indigo-400 text-xs font-semibold rounded px-2 py-1 outline-none focus:border-indigo-500"
                      >
                        {['CREATED', 'READY_TO_SHIP', 'PICKUP_REQUESTED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'DELIVERY_FAILED', 'RTO', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const awbNumber = formData.get('awbNumber') as string;
                      const trackingUrl = formData.get('trackingUrl') as string;
                      
                      if (!awbNumber || awbNumber.trim() === '') {
                        alert('AWB Number is required');
                        return;
                      }

                      try {
                        setIsSubmitting(true);
                        await orderService.updateShipment(selectedOrder.id, { 
                          awbNumber: awbNumber.trim(), 
                          trackingUrl: trackingUrl.trim() || undefined 
                        });
                        await loadData();
                        setSelectedOrder({ ...selectedOrder, shipment: { ...selectedOrder.shipment, awbNumber: awbNumber.trim(), trackingUrl: trackingUrl.trim() } });
                      } catch (error: any) {
                        alert(error.message || 'Failed to save shipment details');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-xs text-content-secondary mb-1 block">AWB Number *</label>
                      <input 
                        type="text" 
                        name="awbNumber"
                        defaultValue={selectedOrder.shipment.awbNumber || ''}
                        placeholder="e.g. 123456789"
                        className="w-full bg-zinc-950 border border-border rounded px-3 py-1.5 text-sm text-content focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-content-secondary mb-1 block">Tracking URL</label>
                      <input 
                        type="url" 
                        name="trackingUrl"
                        defaultValue={selectedOrder.shipment.trackingUrl || ''}
                        placeholder="https://www.delhivery.com/track/..."
                        className="w-full bg-zinc-950 border border-border rounded px-3 py-1.5 text-sm text-content focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2 bg-surface-tertiary hover:bg-surface-tertiary text-content rounded text-sm font-medium transition-colors"
                    >
                      Save Shipment Details
                    </button>
                  </form>

                  <div className="pt-2 border-t border-border">
                    {selectedOrder.shipment.trackingUrl ? (
                      <a 
                        href={selectedOrder.shipment.trackingUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="block w-full text-center py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded text-xs font-semibold transition-colors border border-indigo-500/30"
                      >
                        Track Shipment
                      </a>
                    ) : (
                      <p className="text-xs text-content-tertiary text-center italic">Tracking URL not available</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-4">
              <h3 className="text-content font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center bg-surface-secondary p-3 rounded">
                    <div>
                      <p className="text-content text-sm">{item.product?.name}</p>
                      <p className="text-content-secondary text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-content text-sm font-medium">${item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-content font-semibold mb-3">Financials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-content-secondary">Total Value</span>
                  <span className="text-content">${selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Amount Paid (Deposit)</span>
                  <span className="text-green-400">${selectedOrder.advanceAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-secondary">Remaining Balance</span>
                  <span className="text-red-400">${selectedOrder.remainingAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <h3 className="text-content font-semibold mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {['ORDER_PLACED', 'ORDER_CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(status)}
                    disabled={selectedOrder.status === status || isSubmitting}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      selectedOrder.status === status
                        ? 'bg-blue-600 text-content cursor-default'
                        : 'bg-surface-tertiary text-content-secondary hover:bg-surface-tertiary disabled:opacity-50'
                    }`}
                  >
                    {status.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
