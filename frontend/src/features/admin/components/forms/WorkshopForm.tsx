import { useState, useEffect, useRef } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { uploadFile } from '../../services/apiService';
import { Upload, RefreshCw, ExternalLink } from 'lucide-react';
import { ImageCropperModal } from '../ui/ImageCropperModal';
import { supabase } from '@/lib/supabase';
import { DEFAULT_ROS2_APPLY_URL } from '@/hooks/useRos2ApplyUrl';

export interface WorkshopFormData {
  id?: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  location: string;
  posterUrl?: string;
  externalUrl?: string;
  applyUrl?: string;
  status?: string;
}

interface WorkshopFormProps {
  initialData?: WorkshopFormData | null;
  onSubmit: (data: WorkshopFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function WorkshopForm({ initialData, onSubmit, onCancel, isSubmitting }: WorkshopFormProps) {
  const [formData, setFormData] = useState<WorkshopFormData>({
    title: '',
    description: '',
    date: '',
    duration: '',
    location: '',
    posterUrl: '',
    externalUrl: '/workshops/ros2-industry-immersion',
    applyUrl: DEFAULT_ROS2_APPLY_URL,
    status: 'PUBLISHED'
  });

  const [ros2ApplyUrl, setRos2ApplyUrl] = useState<string>(DEFAULT_ROS2_APPLY_URL);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        status: initialData.status || 'PUBLISHED',
        externalUrl: initialData.externalUrl || '/workshops/ros2-industry-immersion'
      });
      if (initialData.applyUrl) {
        setRos2ApplyUrl(initialData.applyUrl);
      }
    }
  }, [initialData]);

  // Load present ROS 2 application link from WorkshopMedia or default
  useEffect(() => {
    async function loadPresentLink() {
      try {
        const { data, error } = await supabase
          .from('WorkshopMedia')
          .select('mediaUrl')
          .eq('sectionKey', 'ros2_apply_url')
          .maybeSingle();

        if (!error && data?.mediaUrl && data.mediaUrl.trim()) {
          setRos2ApplyUrl(data.mediaUrl.trim());
        }
      } catch (err) {
        console.warn('Could not load present ROS 2 apply URL:', err);
      }
    }
    loadPresentLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If destination is ROS 2, persist the application link to WorkshopMedia immediately
    if (formData.externalUrl === '/workshops/ros2-industry-immersion') {
      try {
        await supabase.from('WorkshopMedia').upsert({
          sectionKey: 'ros2_apply_url',
          title: 'ROS 2 Application Form Link',
          mediaUrl: ros2ApplyUrl.trim(),
          mediaType: 'link',
          isActive: true,
          updatedAt: new Date().toISOString()
        }, { onConflict: 'sectionKey' });
      } catch (err) {
        console.warn('Failed to upsert ROS 2 apply link to WorkshopMedia:', err);
      }
    }

    onSubmit({
      ...formData,
      applyUrl: ros2ApplyUrl.trim()
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setCropperOpen(false);
    setUploading(true);
    try {
      const url = await uploadFile(croppedFile);
      setFormData({ ...formData, posterUrl: url });
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const isRos2Destination = formData.externalUrl === '/workshops/ros2-industry-immersion';

  return (
    <>
      <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting || uploading}>
        <FormRow>
          <FormField label="Workshop Title">
            <input required type="text" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <select className={InputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="PUBLISHED">Published (Open)</option>
              <option value="COMING_SOON">Coming Soon</option>
              <option value="DRAFT">Draft</option>
            </select>
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Date (Optional)">
            <input type="date" className={InputClass} value={formData.date || ""} onChange={e => setFormData({ ...formData, date: e.target.value })} />
          </FormField>
          <FormField label="Duration (e.g., '3 Days', '90 Minutes')">
            <input required type="text" className={InputClass} value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Location">
            <input required type="text" className={InputClass} value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
          </FormField>
          <FormField label="Button Destination">
            <select 
              className={InputClass} 
              value={isRos2Destination ? 'ROS2' : 'CUSTOM'}
              onChange={e => {
                if (e.target.value === 'ROS2') {
                  setFormData({ ...formData, externalUrl: '/workshops/ros2-industry-immersion' });
                } else {
                  setFormData({ ...formData, externalUrl: '' });
                }
              }}
            >
              <option value="ROS2">Link to ROS 2 Industry Immersion Page</option>
              <option value="CUSTOM">Custom Link (Google Form, External, etc.)</option>
            </select>
          </FormField>
        </FormRow>
        
        {/* Present Link with Edit Option */}
        {isRos2Destination ? (
          <FormRow>
            <FormField label="ROS 2 Application Form Link (Present Apply URL)">
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    className={InputClass} 
                    value={ros2ApplyUrl} 
                    onChange={e => setRos2ApplyUrl(e.target.value)} 
                    placeholder="https://docs.google.com/forms/d/..."
                    required
                  />
                  {ros2ApplyUrl && (
                    <a 
                      href={ros2ApplyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-md hover:bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--color-brand)] shrink-0"
                      title="Open and test current link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Present form link shown above. When visitors click &quot;Apply Now&quot; on the ROS 2 page, this link opens. You can edit it here anytime.
                </p>
              </div>
            </FormField>
          </FormRow>
        ) : (
          <FormRow>
            <FormField label="Custom Link URL">
              <input 
                type="url" 
                className={InputClass} 
                value={formData.externalUrl || ''} 
                onChange={e => setFormData({ ...formData, externalUrl: e.target.value })} 
                placeholder="https://docs.google.com/forms/..."
                required
              />
            </FormField>
          </FormRow>
        )}

        <FormField label="Description">
          <textarea required className={TextareaClass} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </FormField>

        <FormField label="Promotional Image / Poster URL">
          <div className="flex gap-2">
            <input
              type="url"
              value={formData.posterUrl || ''}
              onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
              placeholder="https://..."
              className={InputClass}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-md hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
            >
              {uploading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? 'Uploading...' : 'Upload & Crop'}
            </button>
          </div>
        </FormField>
      </AdminForm>

      {cropperOpen && (
        <ImageCropperModal isOpen={true}
          imageSrc={currentImageSrc}
          onClose={() => setCropperOpen(false)}
          onCropComplete={handleCropComplete}
          aspectRatio={16 / 9}
        />
      )}
    </>
  );
}
