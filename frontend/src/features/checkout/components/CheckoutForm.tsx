import { useState } from 'react';

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
}

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });
  
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});

  const validate = () => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // We expose form validation to the parent via an ID so the external button can trigger it
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-heading-sm border-b border-[var(--border-strong)] pb-2 mb-4">Customer Information</h3>
        
        <div>
          <label htmlFor="name" className="block text-body-sm text-[var(--text-secondary)] mb-1">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.name ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-body-sm text-[var(--text-secondary)] mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.email ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="jane@company.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-body-sm text-[var(--text-secondary)] mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.phone ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-heading-sm border-b border-[var(--border-strong)] pb-2 mb-4">Shipping Address</h3>
        
        <div>
          <label htmlFor="address" className="block text-body-sm text-[var(--text-secondary)] mb-1">Street Address</label>
          <input 
            type="text" 
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.address ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
            placeholder="123 Robotics Blvd"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-body-sm text-[var(--text-secondary)] mb-1">City</label>
            <input 
              type="text" 
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.city ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="San Francisco"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-body-sm text-[var(--text-secondary)] mb-1">Postal Code</label>
            <input 
              type="text" 
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.postalCode ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="94105"
            />
            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
          </div>
        </div>
      </div>
    </form>
  );
}
