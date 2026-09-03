/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import type { InternshipFormData } from '@/features/admin/components/forms/InternshipForm';
import { InternshipForm } from '@/features/admin/components/forms/InternshipForm';
import { internshipService } from '@/features/admin/services/apiService';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function AdminInternships() {
  const [data, setData] = useState<InternshipFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InternshipFormData | null>(null);
  const [deletingItem, setDeletingItem] = useState<InternshipFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await internshipService.getAll();
      setData(items);
    } catch (error) {
      console.error('Failed to load internships:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData: InternshipFormData) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await internshipService.update(editingItem.id, formData);
      } else {
        await internshipService.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save internship:', error);
      alert('Failed to save internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem?.id) return;
    setIsSubmitting(true);
    try {
      await internshipService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to delete internship:', error);
      alert('Failed to delete internship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Title', accessor: 'title' as const },
    { header: 'Company', accessor: 'company' as const },
    { header: 'Department', accessor: 'department' as const },
    { header: 'Status', accessor: 'status' as const },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: InternshipFormData) => (
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
          <h1 className="text-2xl font-black text-content mb-1">Internships</h1>
          <p className="text-sm text-content-secondary">Manage internship opportunities.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Internship
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-content-tertiary">Loading data...</div>
      ) : (
        <AdminDataTable columns={columns} data={data} searchableKey="title" itemsPerPage={10} />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); }} title={editingItem ? 'Edit Internship' : 'Add New Internship'}>
        <InternshipForm initialData={editingItem} onSubmit={handleSave} onCancel={() => { setIsModalOpen(false); }} isSubmitting={isSubmitting} />
      </AdminModal>

      <ConfirmDeleteDialog isOpen={isDeleteDialogOpen} onClose={() => { setIsDeleteDialogOpen(false); }} onConfirm={handleDelete} itemName={deletingItem?.title} isDeleting={isSubmitting} />
    </div>
  );
}
