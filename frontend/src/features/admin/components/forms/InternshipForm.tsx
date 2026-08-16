import React, { useState, useEffect } from 'react';
import { uploadFile } from '../../services/apiService';

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

export function InternshipForm({ initialData, onSubmit, onCancel, isSubmitting }: InternshipFormProps) {
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
    applicationLink: '',
    imageUrl: '',
    deadline: '',
    status: 'PUBLISHED',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = formData.imageUrl;

    if (imageFile) {
      setIsUploading(true);
      try {
        finalImageUrl = await uploadFile(imageFile);
      } catch (err) {
        console.error('Failed to upload image', err);
        alert('Failed to upload image. Please try again.');
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSubmit({ ...formData, imageUrl: finalImageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div>
        <label className="block text-sm font-medium mb-1">Internship Title *</label>
        <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Company</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Department *</label>
          <input required type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration *</label>
          <input required type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Internship Type</label>
          <input type="text" name="type" placeholder="e.g. Summer Internship" value={formData.type} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stipend</label>
          <input type="text" name="stipend" value={formData.stipend} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
        <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Requirements (comma separated)</label>
        <input type="text" name="requirements" value={formData.requirements} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Application Link</label>
        <input type="url" name="applicationLink" value={formData.applicationLink} onChange={handleChange} placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Deadline</label>
        <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2">
          <option value="DRAFT">Draft (Unpublished)</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" accept="image/jpeg, image/png, image/webp" onChange={handleImageChange} className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2" />
        {imagePreview && (
          <div className="mt-2 relative w-32 h-32 rounded overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white">
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting || isUploading} className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-2">
          {isSubmitting || isUploading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
