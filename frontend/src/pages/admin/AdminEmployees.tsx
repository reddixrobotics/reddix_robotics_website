/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { AdminDataTable } from '@/features/admin/components/AdminDataTable';
import { AdminModal } from '@/features/admin/components/ui/AdminModal';
import { ConfirmDeleteDialog } from '@/features/admin/components/ui/ConfirmDeleteDialog';
import type { EmployeeFormData } from '@/features/admin/components/forms/EmployeeForm';
import { EmployeeForm } from '@/features/admin/components/forms/EmployeeForm';
import { employeeService } from '@/features/admin/services/apiService';
import { Edit2, Trash2, Plus } from 'lucide-react';

export default function AdminEmployees() {
  const [data, setData] = useState<EmployeeFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmployeeFormData | null>(null);
  const [deletingItem, setDeletingItem] = useState<EmployeeFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const items = await employeeService.getAll();
    setData(items);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      if (editingItem?.id) {
        await employeeService.update(editingItem.id, formData);
      } else {
        await employeeService.create(formData);
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
      await employeeService.delete(deletingItem.id);
      setIsDeleteDialogOpen(false);
      loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { header: 'Designation', accessor: 'designation' as const },
    { header: 'Experience', accessor: 'experience' as const, cell: (item: any) => `${item.experience} Yrs` },
    {
      header: 'Actions',
      accessor: 'id' as const,
      cell: (item: EmployeeFormData) => (
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
          <h1 className="text-2xl font-black text-content mb-1">Employee Directory</h1>
          <p className="text-sm text-content-secondary">Manage staff profiles and details.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Employee
        </Button>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-content-tertiary">Loading data...</div>
      ) : (
        <AdminDataTable columns={columns} data={data} searchableKey="name" itemsPerPage={10} />
      )}

      <AdminModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); }} title={editingItem ? 'Edit Employee' : 'Add New Employee'}>
        <EmployeeForm initialData={editingItem} onSubmit={handleSave} onCancel={() => { setIsModalOpen(false); }} isSubmitting={isSubmitting} />
      </AdminModal>

      <ConfirmDeleteDialog isOpen={isDeleteDialogOpen} onClose={() => { setIsDeleteDialogOpen(false); }} onConfirm={handleDelete} itemName={deletingItem?.name} isDeleting={isSubmitting} />
    </div>
  );
}
