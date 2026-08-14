import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';

export interface WorkshopFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
}

interface WorkshopFormProps {
  initialData?: WorkshopFormData | null;
  onSubmit: (data: WorkshopFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function WorkshopForm({ initialData, onSubmit, onCancel, isSubmitting }: WorkshopFormProps) {
  const [formData, setFormData] = useState<WorkshopFormData>({
    title: '',
    description: '',
    date: '',
    duration: '',
    location: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting}>
      <FormRow>
        <FormField label="Workshop Title">
          <input required type="text" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </FormField>
        <FormField label="Date">
          <input required type="date" className={InputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Duration (e.g., '3 Days', '4 Hours')">
          <input required type="text" className={InputClass} value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
        </FormField>
        <FormField label="Location">
          <input required type="text" className={InputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
        </FormField>
      </FormRow>

      <FormField label="Description">
        <textarea required className={TextareaClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      </FormField>

      <FormField label="Promotional Image">
        <FileUpload accept="image/*" />
      </FormField>
    </AdminForm>
  );
}
