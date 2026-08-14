import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';

export interface EmployeeFormData {
  id?: string;
  name: string;
  designation: string;
  experience: number;
  skills: string;
  biography: string;
  linkedinUrl: string;
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
    linkedinUrl: ''
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
        <FileUpload accept="image/*" />
      </FormField>
    </AdminForm>
  );
}
