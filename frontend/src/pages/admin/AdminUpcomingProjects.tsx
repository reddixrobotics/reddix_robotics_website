/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import { InputField, TextareaField } from '@/components/ui';
import { upcomingProjectService } from '@/features/admin/services/apiService';

export default function AdminUpcomingProjects() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItem, setDeletingItem] = useState<any>(null);


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    team: '',
    status: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await upcomingProjectService.getAll();
      setItems(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load upcoming projects',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        team: item.team,
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        team: '',
        status: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await upcomingProjectService.update(editingItem.id, formData);
      } else {
        await upcomingProjectService.create(formData);
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Failed to save project', error);
      alert('Failed to save project');
    }
  };

  const handleDeleteClick = (item: any) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await upcomingProjectService.delete(deletingItem.id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete project', error);
      alert('Failed to delete project');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingItem(null);
    }
  };

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'team', header: 'Team' },
    { key: 'status', header: 'Status' },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => { handleOpenModal(item); }}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => { handleDeleteClick(item); }}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Upcoming Projects</h1>
        <Button onClick={() => { handleOpenModal(); }}>
          <Plus size={20} className="mr-2" />
          Add Project
        </Button>
      </div>

      <AdminDataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Project' : 'Add Project'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <InputField
            label="Title"
            value={formData.title}
            onChange={(e) => { setFormData({ ...formData, title: e.target.value }); }}
            required
          />
          <InputField
            label="Team"
            value={formData.team}
            onChange={(e) => { setFormData({ ...formData, team: e.target.value }); }}
            required
            placeholder="e.g. AI Research"
          />
          <InputField
            label="Status"
            value={formData.status}
            onChange={(e) => { setFormData({ ...formData, status: e.target.value }); }}
            required
            placeholder="e.g. In Development"
          />
          <TextareaField
            label="Description"
            value={formData.description}
            onChange={(e) => { setFormData({ ...formData, description: e.target.value }); }}
            required
            rows={4}
          />
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => { setIsDeleteDialogOpen(false); }}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
