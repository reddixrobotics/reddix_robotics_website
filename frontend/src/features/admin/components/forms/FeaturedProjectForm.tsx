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
    designProcess: '',
    designDate: '',
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
        <FormField label="Design Date">
          <input type="date" className={InputClass} value={formData.designDate || ''} onChange={e => setFormData({ ...formData, designDate: e.target.value })} />
        </FormField>
        <FormField label="Status">
          <select className={InputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="How it was Designed (Design Process & Tools)">
          <textarea rows={3} className={TextareaClass} value={formData.designProcess || ''} onChange={e => setFormData({ ...formData, designProcess: e.target.value })} placeholder="Describe the engineering and design process..."></textarea>
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Description">
          <textarea required rows={4} className={TextareaClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Project URL (Optional)">
          <input type="url" className={InputClass} value={formData.projectUrl} onChange={e => setFormData({ ...formData, projectUrl: e.target.value })} />
        </FormField>
      </FormRow>

            <div className="mb-4">
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Cover Image</label>
        <FileUpload 
          accept="image/*" 
          onChange={handleFileUpload} 
          aspectRatio={16/9} 
        />
        {isUploading && <p className="mt-2 text-sm text-[var(--color-brand)] animate-pulse">Uploading image...</p>}
        {formData.imageUrl && !isUploading && (
          <div className="mt-4">
             <img src={formData.imageUrl} alt="Preview" className="w-full max-w-sm rounded border border-[var(--border-strong)]" />
          </div>
        )}
      </div>
    </AdminForm>
  );
}






