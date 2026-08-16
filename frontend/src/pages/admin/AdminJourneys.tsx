import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import { journeyService, JourneyFormData } from '@/features/admin/services/apiService';
import JourneyForm from '@/features/admin/components/forms/JourneyForm';

export default function AdminJourneys() {
  const [journeys, setJourneys] = useState<JourneyFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<JourneyFormData | null>(null);
  const [deletingItem, setDeletingItem] = useState<JourneyFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await journeyService.getAll();
      setJourneys(data);
    } catch (err) {
      console.error('Failed to load journeys:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (data: JourneyFormData) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await journeyService.update(editingItem.id, data);
      } else {
        await journeyService.create(data);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save journey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem?.id) return;
    setIsSubmitting(true);
    try {
      await journeyService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to delete journey:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Year', accessor: 'year' as const },
    { header: 'Title', accessor: 'title' as const },
    { 
      header: 'Description', 
      accessor: 'description' as const,
      cell: (item: JourneyFormData) => (
        <span className="truncate max-w-xs inline-block">
          {item.description}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: JourneyFormData) => (
        <div className="flex items-center gap-2">
          <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded">
            <Edit2 size={14} />
          </button>
          <button onClick={() => { setDeletingItem(item); setIsDeleteDialogOpen(true); }} className="p-1.5 text-zinc-400 hover:text-red-500 bg-zinc-800 rounded">
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
          <h1 className="text-2xl font-black text-white mb-1">Company Journeys</h1>
          <p className="text-sm text-zinc-400">Manage your company milestones and history.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Milestone
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-zinc-500">Loading data...</div>
      ) : (
        <AdminDataTable columns={columns} data={journeys} searchableKey="title" itemsPerPage={10} />
      )}

      {isModalOpen && (
        <JourneyForm
          initialData={editingItem || undefined}
          onSubmit={handleSave}
          onCancel={() => setIsModalOpen(false)}
          isLoading={isSubmitting}
        />
      )}

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        itemName={deletingItem?.title}
        isDeleting={isSubmitting}
      />
    </div>
  );
}
