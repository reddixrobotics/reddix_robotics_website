/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import { FeaturedProjectForm } from '@/features/admin/components/forms/FeaturedProjectForm';
import type { FeaturedProjectFormData } from '@/features/admin/services/apiService';
import { featuredProjectService } from '@/features/admin/services/apiService';
import { Edit2, Trash2, Plus } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function AdminFeaturedProjects() {
  const [data, setData] = useState<FeaturedProjectFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FeaturedProjectFormData | null>(null);
  const [deletingItem, setDeletingItem] = useState<FeaturedProjectFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await featuredProjectService.getAll();
      setData(items);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData: FeaturedProjectFormData) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await featuredProjectService.update(editingItem.id, formData);
      } else {
        await featuredProjectService.create(formData);
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
      await featuredProjectService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Image',
      accessor: 'imageUrl' as const,
      cell: (item: FeaturedProjectFormData) => (
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-12 h-12 object-contain p-1 rounded bg-surface-tertiary" 
          onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
        />
      ),
    },
    { header: 'Project Title', accessor: 'title' as const },
    { header: 'Category', accessor: 'category' as const },
    {
      header: 'Status',
      accessor: 'status' as const,
      cell: (item: FeaturedProjectFormData) => (
        <Badge variant={item.status === 'PUBLISHED' ? 'success' : 'neutral'} size="sm">
          {item.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: FeaturedProjectFormData) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={async () => {
              const newStatus = item.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
              try {
                await featuredProjectService.update(item.id!, { status: newStatus });
                loadData();
              } catch (e) {
                console.error('Failed to toggle status', e);
              }
            }}
            title={item.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
            className={`p-1.5 rounded ${item.status === 'PUBLISHED' ? 'text-green-500 hover:text-green-400 bg-green-500/10' : 'text-content-secondary hover:text-content bg-surface-tertiary'}`}
          >
            {item.status === 'PUBLISHED' ? <span className="text-xs font-bold px-1">Unpublish</span> : <span className="text-xs font-bold px-1">Publish</span>}
          </button>
          <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="p-1.5 text-content-secondary hover:text-content bg-surface-tertiary rounded" title="Edit">
            <Edit2 size={14} />
          </button>
          <button onClick={() => { setDeletingItem(item); setIsDeleteDialogOpen(true); }} className="p-1.5 text-content-secondary hover:text-red-500 bg-surface-tertiary rounded" title="Delete">
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
          <h1 className="text-2xl font-black text-content mb-1">Featured Projects</h1>
          <p className="text-sm text-content-secondary">Manage projects displayed on the public home page.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Featured Project
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-content-tertiary">Loading data...</div>
      ) : (
        <AdminDataTable columns={columns} data={data} searchableKey="title" itemsPerPage={10} />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); }} title={editingItem ? 'Edit Featured Project' : 'Add New Featured Project'}>
        <FeaturedProjectForm initialData={editingItem} onSubmit={handleSave} onCancel={() => { setIsModalOpen(false); }} isSubmitting={isSubmitting} />
      </AdminModal>

      <ConfirmDeleteDialog isOpen={isDeleteDialogOpen} onClose={() => { setIsDeleteDialogOpen(false); }} onConfirm={handleDelete} itemName={deletingItem?.title} isDeleting={isSubmitting} />
    </div>
  );
}
