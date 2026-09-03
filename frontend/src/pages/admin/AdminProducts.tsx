/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import type { ProductFormData } from '@/features/admin/components/forms/ProductForm';
import { ProductForm } from '@/features/admin/components/forms/ProductForm';
import { productService } from '@/features/admin/services/apiService';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function AdminProducts() {
  const [data, setData] = useState<ProductFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductFormData | null>(null);
  const [deletingItem, setDeletingItem] = useState<ProductFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const items = await productService.getAll();
    setData(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData: ProductFormData) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await productService.update(editingItem.id, formData);
      } else {
        await productService.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem?.id) return;
    setIsSubmitting(true);
    try {
      await productService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      loadData();
    } catch (e: any) {
      alert(e.message || 'Failed to delete product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (item: ProductFormData) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const confirmDelete = (item: ProductFormData) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Category', accessor: 'category' as const },
    { header: 'Price', accessor: 'price' as const, cell: (item: any) => `₹${item.price.toLocaleString()}` },
    { header: 'Stock', accessor: 'stock' as const },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: ProductFormData) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { openEdit(item); }} className="p-1.5 text-content-secondary hover:text-content bg-surface-tertiary rounded">
            <Edit2 size={14} />
          </button>
          <button onClick={() => { confirmDelete(item); }} className="p-1.5 text-content-secondary hover:text-red-500 bg-surface-tertiary rounded">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-content mb-1">Products Management</h1>
          <p className="text-sm text-content-secondary">Manage product catalog, pricing, and inventory.</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-content-tertiary">Loading data...</div>
      ) : (
        <AdminDataTable columns={columns} data={data} searchableKey="name" itemsPerPage={10} />
      )}

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); }}
        title={editingItem ? 'Edit Product' : 'Create New Product'}
      >
        <ProductForm
          initialData={editingItem}
          onSubmit={handleSave}
          onCancel={() => { setIsModalOpen(false); }}
          isSubmitting={isSubmitting}
        />
      </AdminModal>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); }}
        onConfirm={handleDelete}
        itemName={deletingItem?.name}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
