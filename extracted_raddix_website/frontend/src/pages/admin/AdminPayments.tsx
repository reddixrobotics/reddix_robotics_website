import { useState, useEffect } from 'react';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { paymentService } from '@/features/admin/services/apiService';
import { Eye } from 'lucide-react';

export default function AdminPayments() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await paymentService.getAll();
      setData(items);
    } catch (error) {
      console.error('Failed to load payments', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const columns = [
    { header: 'Payment ID', accessor: 'id' as const, cell: (item: any) => <span className="font-mono text-xs">{item.id.slice(0, 8)}...</span> },
    { header: 'Order ID', accessor: 'order' as const, cell: (item: any) => item.order?.orderNumber || 'N/A' },
    { header: 'Customer', accessor: 'customer' as const, cell: (item: any) => item.order?.customer?.name || 'Guest' },
    { header: 'Amount', accessor: 'amount' as const, cell: (item: any) => `$${item.amount.toLocaleString()}` },
    { header: 'Method', accessor: 'paymentMethod' as const },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'SUCCESS' ? 'bg-green-500/20 text-green-400' : item.status === 'FAILED' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
        {item.status}
      </span>
    )},
    { header: 'Date', accessor: 'createdAt' as const, cell: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: any) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openDetails(item)} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded">
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
          <h1 className="text-2xl font-black text-white mb-1">Payments Management</h1>
          <p className="text-sm text-zinc-400">View and track customer payments and transactions.</p>
        </div>
      </div>

      <AdminDataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        searchPlaceholder="Search by Order ID..."
        searchKey="order"
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Payment Details"
      >
        {selectedPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500 block mb-1">Payment ID</span>
                <span className="text-white font-mono">{selectedPayment.id}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Date</span>
                <span className="text-white font-medium">{new Date(selectedPayment.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Status</span>
                <span className={`font-semibold ${selectedPayment.status === 'SUCCESS' ? 'text-green-400' : selectedPayment.status === 'FAILED' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block mb-1">Amount</span>
                <span className="text-white font-medium">${selectedPayment.amount.toLocaleString()} {selectedPayment.currency}</span>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <h3 className="text-white font-semibold mb-3">Order Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Order Number</span>
                  <span className="text-white">{selectedPayment.order?.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer Name</span>
                  <span className="text-white">{selectedPayment.order?.customer?.name || 'Guest'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Customer Email</span>
                  <span className="text-white">{selectedPayment.order?.customer?.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4">
              <h3 className="text-white font-semibold mb-3">Gateway Details (Razorpay)</h3>
              <div className="space-y-2 text-sm font-mono text-zinc-300">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 font-sans">Razorpay Order ID</span>
                  <span className="break-all bg-zinc-900 p-2 rounded">{selectedPayment.razorpayOrderId || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-zinc-500 font-sans">Razorpay Payment ID</span>
                  <span className="break-all bg-zinc-900 p-2 rounded">{selectedPayment.razorpayPaymentId || 'N/A'}</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-zinc-500 font-sans">Payment Method</span>
                  <span className="bg-zinc-900 p-2 rounded">{selectedPayment.paymentMethod}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
}
