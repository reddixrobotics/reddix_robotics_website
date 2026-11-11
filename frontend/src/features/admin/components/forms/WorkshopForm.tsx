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

function parseApplyUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('apply=')) {
    const match = url.match(/[?&]apply=([^&]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]).trim();
  }
  if (url.includes('docs.google.com/forms')) {
    return url.trim();
  }
  return '';
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

  const [destinationType, setDestinationType] = useState<'ROS2' | 'CUSTOM'>('ROS2');
  const [ros2ApplyUrl, setRos2ApplyUrl] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('ros2_apply_url')) || DEFAULT_ROS2_APPLY_URL;
  });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  
  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      const isRos2 = 
        !initialData.externalUrl || 
        initialData.externalUrl.startsWith('/workshops/ros2-industry-immersion') ||
        (initialData.title || '').toLowerCase().includes('ros2');

      setDestinationType(isRos2 ? 'ROS2' : 'CUSTOM');

      const extractedApply = 
        parseApplyUrl(initialData.externalUrl) || 
        (initialData.applyUrl && initialData.applyUrl.trim()) ||
        (typeof window !== 'undefined' ? localStorage.getItem('ros2_apply_url') : '') ||
        DEFAULT_ROS2_APPLY_URL;

      setRos2ApplyUrl(extractedApply);

      setFormData({
        ...initialData,
        status: initialData.status || 'PUBLISHED',
        externalUrl: initialData.externalUrl || '/workshops/ros2-industry-immersion',
        applyUrl: extractedApply
      });
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
          const trimmed = data.mediaUrl.trim();
          setRos2ApplyUrl(trimmed);
          if (typeof window !== 'undefined') {
            localStorage.setItem('ros2_apply_url', trimmed);
          }
        }
      } catch (err) {
        console.warn('Could not load present ROS 2 apply URL from WorkshopMedia:', err);
      }
    }
    loadPresentLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanApplyUrl = ros2ApplyUrl.trim();

    if (destinationType === 'ROS2') {
      // Store in localStorage immediately
      if (cleanApplyUrl && typeof window !== 'undefined') {
        try {
          localStorage.setItem('ros2_apply_url', cleanApplyUrl);
        } catch {}
      }

      // Also try to persist to WorkshopMedia
      try {
        await supabase.from('WorkshopMedia').upsert({
          sectionKey: 'ros2_apply_url',
          title: 'ROS 2 Application Form Link',
          mediaUrl: cleanApplyUrl,
          mediaType: 'link',
          isActive: true,
          updatedAt: new Date().toISOString()
        }, { onConflict: 'sectionKey' });
      } catch (err) {
        console.warn('Failed to upsert ROS 2 apply link to WorkshopMedia:', err);
      }

      const targetExternalUrl = cleanApplyUrl 
        ? `/workshops/ros2-industry-immersion?apply=${encodeURIComponent(cleanApplyUrl)}`
        : '/workshops/ros2-industry-immersion';

      onSubmit({
        ...formData,
        externalUrl: targetExternalUrl,
        applyUrl: cleanApplyUrl
      });
    } else {
      onSubmit({
        ...formData,
        externalUrl: formData.externalUrl || '',
        applyUrl: formData.externalUrl || ''
      });
    }
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

  return (
    <>
      <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting || uploading}>
        <FormRow>
          <FormField label="Workshop Title">
            <input required type="text" className={InputClass} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <select className={InputClass} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
              <option value="PUBLISHED">Published</option>
              <option value="COMING_SOON">Coming Soon</option>
              <option value="CLOSED">Closed</option>
            </select>
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Date (Optional)">
            <input type="date" className={InputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
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
              value={destinationType}
              onChange={e => {
                const nextType = e.target.value as 'ROS2' | 'CUSTOM';
                setDestinationType(nextType);
                if (nextType === 'ROS2') {
                  const target = ros2ApplyUrl.trim() 
                    ? `/workshops/ros2-industry-immersion?apply=${encodeURIComponent(ros2ApplyUrl.trim())}` 
                    : '/workshops/ros2-industry-immersion';
                  setFormData({ ...formData, externalUrl: target });
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
        {destinationType === 'ROS2' ? (
          <FormRow>
            <FormField label="ROS 2 Application Form Link (Present Apply URL)">
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    className={InputClass} 
                    value={ros2ApplyUrl} 
                    onChange={e => {
                      const val = e.target.value;
                      setRos2ApplyUrl(val);
                      if (val.trim() && typeof window !== 'undefined') {
                        try {
                          localStorage.setItem('ros2_apply_url', val.trim());
                        } catch {}
                      }
                    }} 
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
