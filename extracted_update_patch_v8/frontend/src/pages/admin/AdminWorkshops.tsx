/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import type { WorkshopFormData } from '@/features/admin/components/forms/WorkshopForm';
import { WorkshopForm } from '@/features/admin/components/forms/WorkshopForm';
import { workshopService } from '@/features/admin/services/apiService';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function AdminWorkshops() {
  const [data, setData] = useState<WorkshopFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkshopFormData | null>(null);
  const [deletingItem, setDeletingItem] = useState<WorkshopFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const items = await workshopService.getAll();
    setData(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData: WorkshopFormData) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await workshopService.update(editingItem.id, formData);
      } else {
        await workshopService.create(formData);
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
      await workshopService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error("Delete failed", error);
      alert("Failed to delete workshop: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Image',
      accessor: 'posterUrl' as const,
      cell: (item: WorkshopFormData) => (
        item.posterUrl ? (
          <img src={item.posterUrl} alt="Poster" className="w-10 h-10 object-cover rounded-md border border-surface-tertiary" />
        ) : (
          <div className="w-10 h-10 bg-surface-tertiary rounded-md flex items-center justify-center text-content-tertiary text-xs">No img</div>
        )
      )
    },
    { header: 'Title', accessor: 'title' as const },
    { header: 'Date', accessor: 'date' as const },
    { header: 'Location', accessor: 'location' as const },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: WorkshopFormData) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1.5 text-content-secondary hover:text-content bg-surface-tertiary rounded">
            <Edit2 size={14} />
          </button>
          <button onClick={() => { setDeletingItem(item); setIsDeleteDialogOpen(true); }} className="p-1.5 text-content-secondary hover:text-red-500 bg-surface-tertiary rounded">
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
          <h1 className="text-2xl font-black text-content mb-1">Workshops Management</h1>
          <p className="text-sm text-content-secondary">Schedule and organize training events.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Workshop
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-content-tertiary">Loading data...</div>
      ) : (
        <AdminDataTable columns={columns} data={data} searchableKey="title" itemsPerPage={10} />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); }} title={editingItem ? 'Edit Workshop' : 'Create Workshop'}>
        <WorkshopForm initialData={editingItem} onSubmit={handleSave} onCancel={() => { setIsModalOpen(false); }} isSubmitting={isSubmitting} />
      </AdminModal>

      <ConfirmDeleteDialog isOpen={isDeleteDialogOpen} onClose={() => { setIsDeleteDialogOpen(false); }} onConfirm={handleDelete} itemName={deletingItem?.title} isDeleting={isSubmitting} />
    </div>
  );
}
