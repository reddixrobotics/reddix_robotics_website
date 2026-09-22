import { useState, useEffect, useRef } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { uploadFile } from '../../services/apiService';
import { Upload, RefreshCw } from 'lucide-react';

export interface WorkshopFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  posterUrl?: string;
  externalUrl?: string;
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
    location: '',
    posterUrl: '',
    externalUrl: ''
  });
  
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setFormData({ ...formData, posterUrl: url });
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting || uploading}>
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

      <FormField label="Promotional Image / Poster URL">
        <div className="flex gap-2">
          <input
            type="url"
            value={formData.posterUrl || ''}
            onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
            placeholder="https://..."
            className={InputClass}
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] text-sm font-medium transition-colors disabled:opacity-50 shrink-0"
          >
            {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </FormField>
      <FormField label="External Website URL (Optional)">
        <input 
          type="url" 
          className={InputClass} 
          value={formData.externalUrl || ''} 
          onChange={e => setFormData({ ...formData, externalUrl: e.target.value })} 
          placeholder="https://..."
        />
      </FormField>
    </AdminForm>
  );
}
