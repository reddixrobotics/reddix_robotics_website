import React, { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass, FormSection } from '../ui/AdminForm';
import { TagInput } from '../ui/TagInput';

export interface InternshipFormData {
  id?: string;
  title: string;
  company?: string;
  description: string;
  department: string;
  location?: string;
  duration: string;
  type?: string;
  stipend?: string;
  skills?: string;
  requirements?: string;
  applicationLink?: string;
  imageUrl?: string;
  deadline?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface InternshipFormProps {
  initialData?: InternshipFormData | null;
  onSubmit: (data: InternshipFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function InternshipForm({ initialData, onSubmit, onCancel, isSubmitting = false }: InternshipFormProps) {
  const [formData, setFormData] = useState<InternshipFormData>({
    title: '',
    company: '',
    description: '',
    department: '',
    location: '',
    duration: '',
    type: '',
    stipend: '',
    skills: '',
    requirements: '',
    imageUrl: '',
    deadline: '',
    status: 'PUBLISHED',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData });
  };

  return (
    <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting}>
      <FormSection title="Basic Information" description="Primary details for this internship opportunity.">
        <FormRow>
          <FormField label="Internship Title *">
            <input required type="text" placeholder="e.g. Summer Software Engineering Intern" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </FormField>
          <FormField label="Company">
            <input type="text" placeholder="Optional" className={InputClass} value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField label="Department *">
            <input required type="text" placeholder="e.g. Engineering" className={InputClass} value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
          </FormField>
          <FormField label="Location">
            <input type="text" placeholder="e.g. Remote, San Francisco" className={InputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title="Internship Attributes" description="Duration, type, and compensation.">
        <FormRow>
          <FormField label="Duration *">
            <input required type="text" placeholder="e.g. 12 Weeks, 3 Months" className={InputClass} value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
          </FormField>
          <FormField label="Internship Type">
            <input type="text" placeholder="e.g. Summer Internship" className={InputClass} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
          </FormField>
        </FormRow>
        <FormRow>
          <FormField label="Stipend / Compensation">
            <input type="text" placeholder="e.g. $5000/month, Unpaid, etc." className={InputClass} value={formData.stipend} onChange={e => setFormData({ ...formData, stipend: e.target.value })} />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title="Skills & Requirements" description="What are you looking for in a candidate?">
        <FormRow>
          <FormField label="Preferred Skills">
            <TagInput 
              value={formData.skills || ''} 
              onChange={val => setFormData({ ...formData, skills: val })} 
              placeholder="e.g. React, Python, Git (Press Enter)" 
            />
          </FormField>
          <FormField label="Hard Requirements">
            <TagInput 
              value={formData.requirements || ''} 
              onChange={val => setFormData({ ...formData, requirements: val })} 
              placeholder="e.g. Enrolled in CS Degree (Press Enter)" 
            />
          </FormField>
        </FormRow>
      </FormSection>

      <FormSection title="Description & Status" description="The detailed description and publishing settings.">
        <FormField label="Full Description *">
          <textarea 
            required 
            placeholder="About the internship... What the intern will learn... Expectations..."
            className={`${TextareaClass} min-h-[150px] leading-relaxed`} 
            value={formData.description} 
            onChange={e => setFormData({ ...formData, description: e.target.value })} 
          />
        </FormField>
        
        <FormRow>
          <FormField label="Deadline">
            <input type="date" className={InputClass} value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <select className={InputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as any })}>
              <option value="DRAFT">Draft (Unpublished)</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </FormField>
        </FormRow>
      </FormSection>
    </AdminForm>
  );
}
