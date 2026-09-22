import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass, FormSection } from '../ui/AdminForm';
import { TagInput } from '../ui/TagInput';

export interface JobFormData {
  id?: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  salary?: string;
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
    salary: '',
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
      <FormSection title="Basic Information" description="Primary details for this job posting.">
        <FormRow>
          <FormField label="Job Title *">
            <input required type="text" placeholder="e.g. Senior Frontend Engineer" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </FormField>
          <FormField label="Department *">
            <input required type="text" placeholder="e.g. Engineering" className={InputClass} value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title="Job Attributes" description="Location, type, and experience requirements.">
        <FormRow>
          <FormField label="Location *">
            <input required type="text" placeholder="e.g. Remote, New York, etc." className={InputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </FormField>
          <FormField label="Employment Type *">
            <select required className={InputClass} value={formData.employmentType} onChange={e => setFormData({ ...formData, employmentType: e.target.value })}>
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </FormField>
        </FormRow>
        <FormRow>
          <FormField label="Experience Level *">
            <input required type="text" placeholder="e.g. 3-5 Years" className={InputClass} value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
          </FormField>
          <FormField label="Salary / Compensation">
            <input type="text" placeholder="e.g. $100k - $120k" className={InputClass} value={formData.salary || ''} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField label="Core Skills & Requirements">
            <TagInput 
              value={formData.skills} 
              onChange={val => setFormData({ ...formData, skills: val })} 
              placeholder="Type a skill and press Enter" 
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title="Job Description" description="Write a detailed description. Line breaks and paragraphs will be preserved on the public careers page.">
        <FormField label="Full Description *">
          <textarea 
            required 
            placeholder="About the role... What you will do... What we offer..."
            className={`${TextareaClass} min-h-[200px] leading-relaxed`} 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })} 
          />
        </FormField>
      </FormSection>
    </AdminForm>
  );
}
