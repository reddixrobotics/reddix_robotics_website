import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';
import { FeaturedProjectFormData, uploadFile } from '../../services/apiService';

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

  const [isUploading, setIsUploading] = useState(false);

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
    if (!formData.imageUrl) {
      alert("Please upload an image.");
      return;
    }
    onSubmit(formData);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    try {
      setIsUploading(true);
      const url = await uploadFile(files[0]);
      setFormData({ ...formData, imageUrl: url });
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload project image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting || isUploading}>
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

      <FormField label="Project Cover Image">
        <FileUpload 
          accept="image/*" 
          onChange={handleFileUpload} 
          aspectRatio={16/9} // Featured projects often use wider layouts
        />
        {isUploading && <p className="mt-2 text-sm text-brand animate-pulse">Uploading image...</p>}
        {formData.imageUrl && !isUploading && (
          <div className="mt-4">
            <p className="text-xs text-zinc-400 mb-2">Current Image Preview:</p>
            <img src={formData.imageUrl} alt="Preview" className="w-full max-w-sm rounded-lg border border-zinc-700 shadow-md object-cover" />
          </div>
        )}
      </FormField>
    </AdminForm>
  );
}
