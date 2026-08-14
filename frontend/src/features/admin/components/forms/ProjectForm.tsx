import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';

export interface ProjectFormData {
  id?: string;
  name: string;
  category: string;
  description: string;
  technologies: string;
  year: number;
  details: string;
}

interface ProjectFormProps {
  initialData?: ProjectFormData | null;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProjectForm({ initialData, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    category: '',
    description: '',
    technologies: '',
    year: new Date().getFullYear(),
    details: ''
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
        <FormField label="Project Name">
          <input required type="text" className={InputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </FormField>
        <FormField label="Category">
          <input required type="text" className={InputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Completion Year">
          <input required type="number" min="1900" className={InputClass} value={formData.year} onChange={e => setFormData({ ...formData, year: Number(e.target.value) })} />
        </FormField>
        <FormField label="Technologies (comma separated)">
          <input required type="text" className={InputClass} value={formData.technologies} onChange={e => setFormData({ ...formData, technologies: e.target.value })} />
        </FormField>
      </FormRow>

      <FormField label="Short Description">
        <textarea required className={TextareaClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      </FormField>

      <FormField label="Detailed Case Study / Content">
        <textarea required className={TextareaClass} value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} />
      </FormField>

      <FormField label="Project Cover Image">
        <FileUpload accept="image/*" />
      </FormField>
    </AdminForm>
  );
}
