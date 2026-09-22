import { AdminModal } from './AdminModal';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  itemName,
  isDeleting = false
}: ConfirmDeleteDialogProps) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center pb-6">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <p className="text-zinc-300 mb-2">{message}</p>
        {itemName && (
          <p className="font-bold text-white mb-6">Item: "{itemName}"</p>
        )}
        <div className="flex w-full gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
          </Button>
        </div>
      </div>
    </AdminModal>
  );
}
