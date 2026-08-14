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
  // images handle simulated
}

interface ProductFormProps {
  initialData?: ProductFormData | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProductForm({ initialData, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    description: '',
    price: 0,
    depositPercentage: 20,
    stock: 0,
    specifications: '',
    features: ''
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

      <FormField label="Specifications (JSON or text)">
        <textarea 
          className={TextareaClass}
          value={formData.specifications}
          onChange={e => setFormData({ ...formData, specifications: e.target.value })}
        />
      </FormField>

      <FormField label="Features (One per line)">
        <textarea 
          className={TextareaClass}
          value={formData.features}
          onChange={e => setFormData({ ...formData, features: e.target.value })}
        />
      </FormField>

      <FormField label="Product Images">
        <FileUpload multiple accept="image/*" />
      </FormField>
    </AdminForm>
  );
}
