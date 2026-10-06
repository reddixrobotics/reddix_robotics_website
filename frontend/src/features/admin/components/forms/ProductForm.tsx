import { useState, useEffect } from 'react';
import { AdminForm, FormField, FormRow, InputClass, TextareaClass } from '../ui/AdminForm';
import { FileUpload } from '../ui/FileUpload';

export interface ProductFormData {
  id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  depositPercentage: number;
  stock: number;
  specifications: string;
  features: string;
  images: string[];
}

interface ProductFormProps {
  initialData?: ProductFormData | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

import { ImageCropperModal } from '../ui/ImageCropperModal';
import { uploadFile } from '../../services/apiService';

// ... (keep the rest unchanged until the component render)
export function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: 0,
    depositPercentage: 20,
    stock: 0,
    specifications: '',
    features: '',
    images: []
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentImageSrc, setCurrentImageSrc] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Please upload at least 1 image.');
      return;
    }
    onSubmit(formData);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (formData.images.length >= 6) {
      alert('Maximum 6 items allowed.');
      e.target.value = '';
      return;
    }

    const isVideo = file.type.startsWith('video/');
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, PNG, WebP images and MP4, WebM videos are allowed.');
      e.target.value = '';
      return;
    }

    const maxSize = isVideo ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds limit (' + (isVideo ? '25MB for video' : '5MB for image') + ').');
      e.target.value = '';
      return;
    }

    if (isVideo) {
      try {
        setUploadingImage(true);
        const url = await uploadFile(file);
        setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      } catch (err: any) {
        alert('Video upload failed: ' + (err.message || 'Unknown error'));
      } finally {
        setUploadingImage(false);
      }
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCurrentImageSrc(reader.result as string);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (formData.images.length >= 6) {
      alert('Maximum 6 images allowed.');
      setCropperOpen(false);
      return;
    }
    try {
      setUploadingImage(true);
      const url = await uploadFile(croppedFile);
      setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
      setCropperOpen(false);
    } catch (err: any) {
      alert('Failed to upload cropped image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <>
      <AdminForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isSubmitting || uploadingImage}>
        <FormRow>
          <FormField label="Product Name">
            <input 
              required 
              type="text" 
              className={InputClass} 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </FormField>
          <FormField label="Category">
            <select 
              required 
              className={InputClass}
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Industrial Arms">Industrial Arms</option>
              <option value="Mobile Robots">Mobile Robots</option>
              <option value="Drones">Drones</option>
              <option value="Components">Components</option>
              <option value="Sensors & Vision">Sensors & Vision</option>
              <option value="Compute Modules">Compute Modules</option>
              <option value="Accessories">Accessories</option>
            </select>
          </FormField>
        </FormRow>

        <FormField label="Description">
          <textarea 
            required 
            className={TextareaClass}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </FormField>

        <FormRow>
          <FormField label="Price (₹)">
            <input 
              required 
              type="number" 
              min="0" 
              className={InputClass}
              value={formData.price}
              onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </FormField>
          <FormField label="Deposit Percentage (%)">
            <input 
              required 
              type="number" 
              min="0" 
              max="100" 
              className={InputClass}
              value={formData.depositPercentage}
              onChange={e => setFormData({ ...formData, depositPercentage: Number(e.target.value) })}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Stock Quantity">
            <input 
              required 
              type="number" 
              min="0" 
              className={InputClass}
              value={formData.stock}
              onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
            />
          </FormField>
        </FormRow>

        <FormField label="Specifications (Key: Value per line)">
          <textarea 
            className={TextareaClass}
            value={formData.specifications}
            onChange={e => setFormData({ ...formData, specifications: e.target.value })}
            placeholder="Weight: 10kg&#10;Power: 220V"
          />
        </FormField>

        <FormField label="Features (One per line)">
          <textarea 
            className={TextareaClass}
            value={formData.features}
            onChange={e => setFormData({ ...formData, features: e.target.value })}
          />
        </FormField>

        <FormField label="Product Images (1 Min, 6 Max)">
          <div className="flex flex-col gap-3">
            {formData.images && formData.images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    {img.match(/\.(mp4|webm|mov)$/i) ? <video src={img} className="h-32 w-32 object-cover rounded border border-[var(--border-strong)] shadow-sm bg-[var(--bg-tertiary)]" muted loop autoPlay /> : <img src={img} alt={"Preview " + idx} className="h-32 w-32 object-cover rounded border border-[var(--border-strong)] shadow-sm bg-[var(--bg-tertiary)]" />}
                    <button type="button" onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                  </div>
                ))}
              </div>
            )}
            {(!formData.images || formData.images.length < 6) && (
              <input 
                type="file" 
                accept="image/jpeg, image/png, image/jpg, image/webp, video/mp4, video/webm" 
                onChange={handleFileSelect} 
                disabled={uploadingImage}
                className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-brand)] file:text-white hover:file:brightness-110 cursor-pointer"
              />
            )}
            {uploadingImage && <span className="text-sm text-[var(--color-brand)] animate-pulse">Processing & Uploading...</span>}
            {(!formData.images || formData.images.length === 0) && <p className="text-xs text-red-500 mt-1">At least 1 image is required.</p>}
          </div>
        </FormField>
      </AdminForm>

      {cropperOpen && (
        <ImageCropperModal
          isOpen={cropperOpen}
          imageSrc={currentImageSrc}
          onClose={() => setCropperOpen(false)}
          onCropComplete={handleCropComplete}
          aspectRatio={4 / 3} // Products generally look good at 4:3
        />
      )}
    </>
  );
}







