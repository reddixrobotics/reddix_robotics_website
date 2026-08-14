import { ReactNode } from 'react';
import { Button } from '@/components/ui';

interface AdminFormProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  children: ReactNode;
  submitText?: string;
}

export function AdminForm({ onSubmit, onCancel, isSubmitting = false, children, submitText = 'Save Changes' }: AdminFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">
      <div className="flex-1 space-y-6 pb-6">
        {children}
      </div>
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-800 mt-auto">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitText}
        </Button>
      </div>
    </form>
  );
}

// Helper components for form fields
export function FormRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-zinc-400">{label}</label>
      {children}
    </div>
  );
}

export const InputClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors";
export const TextareaClass = "w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 transition-colors min-h-[100px] resize-y custom-scrollbar";
