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

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadFile(file);
      setFormData(prev => ({ ...prev, images: [url] }));
    } catch (err: any) {
      alert('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingImage(false);
    }
  };

  return (
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

      <FormField label="Product Image">
        <div className="flex flex-col gap-2">
          {formData.images?.[0] && (
            <img src={formData.images[0]} alt="Preview" className="h-24 w-24 object-cover rounded border border-zinc-700" />
          )}
          <input 
            type="file" 
            accept="image/*"
            className={InputClass} 
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
          {uploadingImage && <span className="text-sm text-brand">Uploading...</span>}
        </div>
      </FormField>
    </AdminForm>
  );
}
