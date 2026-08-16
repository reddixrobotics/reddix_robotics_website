import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';
import { FeaturedProjectFormData } from '../../services/apiService';

interface FeaturedProjectFormProps {
  initialData?: FeaturedProjectFormData | null;
  onSubmit: (data: FeaturedProjectFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FeaturedProjectForm({ initialData, onSubmit, onCancel, isSubmitting }: FeaturedProjectFormProps) {
  const [formData, setFormData] = useState<FeaturedProjectFormData>({
    title: '',
    category: '',
    description: '',
    imageUrl: '',
    projectUrl: '',
    status: 'PUBLISHED'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        projectUrl: initialData.projectUrl || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting}>
      <FormRow>
        <FormField label="Project Title">
          <input required type="text" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </FormField>
        <FormField label="Category">
          <input required type="text" className={InputClass} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Project URL (Optional)">
          <input type="url" className={InputClass} value={formData.projectUrl} onChange={e => setFormData({ ...formData, projectUrl: e.target.value })} />
        </FormField>
        <FormField label="Status">
          <select className={InputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </FormField>
      </FormRow>

      <FormField label="Short Description">
        <textarea required className={TextareaClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      </FormField>

      <FormField label="Project Cover Image URL">
        <input required type="text" className={InputClass} value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" />
      </FormField>
    </AdminForm>
  );
}
