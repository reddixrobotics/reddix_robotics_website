import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';

export interface JobFormData {
  id?: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  skills: string;
  description: string;
}

interface JobFormProps {
  initialData?: JobFormData | null;
  onSubmit: (data: JobFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function JobForm({ initialData, onSubmit, onCancel, isSubmitting }: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    department: '',
    location: '',
    employmentType: '',
    experience: '',
    skills: '',
    description: ''
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
        <FormField label="Job Title">
          <input required type="text" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
        </FormField>
        <FormField label="Department">
          <input required type="text" className={InputClass} value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Location">
          <input required type="text" className={InputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
        </FormField>
        <FormField label="Employment Type (e.g., Full-time)">
          <select required className={InputClass} value={formData.employmentType} onChange={e => setFormData({ ...formData, employmentType: e.target.value })}>
            <option value="">Select Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Experience Required">
          <input required type="text" placeholder="e.g. 3-5 Years" className={InputClass} value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
        </FormField>
        <FormField label="Core Skills (comma separated)">
          <input required type="text" className={InputClass} value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
        </FormField>
      </FormRow>

      <FormField label="Job Description">
        <textarea required className={TextareaClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
      </FormField>
    </AdminForm>
  );
}
