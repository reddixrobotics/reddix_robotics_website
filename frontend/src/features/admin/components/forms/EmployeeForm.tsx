import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';
import { uploadFile } from '../../services/apiService';

export interface EmployeeFormData {
  id?: string;
  name: string;
  designation: string;
  experience: number;
  skills: string;
  biography: string;
  linkedinUrl: string;
  profilePhoto?: string;
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData | null;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function EmployeeForm({ initialData, onSubmit, onCancel, isSubmitting }: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    designation: '',
    experience: 0,
    skills: '',
    biography: '',
    linkedinUrl: '',
    profilePhoto: '',
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;
    try {
      setIsUploading(true);
      const url = await uploadFile(files[0]);
      setFormData({ ...formData, profilePhoto: url });
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting || isUploading}>
      <FormRow>
        <FormField label="Full Name">
          <input required type="text" className={InputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </FormField>
        <FormField label="Designation">
          <input required type="text" className={InputClass} value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Years of Experience">
          <input required type="number" min="0" className={InputClass} value={formData.experience} onChange={e => setFormData({ ...formData, experience: Number(e.target.value) })} />
        </FormField>
        <FormField label="LinkedIn Profile URL">
          <input type="url" className={InputClass} value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} />
        </FormField>
      </FormRow>

      <FormField label="Skills (comma separated)">
        <input required type="text" className={InputClass} value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
      </FormField>

      <FormField label="Biography">
        <textarea required className={TextareaClass} value={formData.biography} onChange={e => setFormData({ ...formData, biography: e.target.value })} />
      </FormField>

      <FormField label="Profile Photo">
        <FileUpload 
          accept="image/*" 
          onChange={handleFileUpload} 
        />
        {formData.profilePhoto && (
          <p className="mt-2 text-xs text-green-500">Photo uploaded successfully.</p>
        )}
      </FormField>
    </AdminForm>
  );
}
