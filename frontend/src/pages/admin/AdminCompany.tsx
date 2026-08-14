import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { Building, MapPin, Mail, Phone, Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';
import { InputClass, TextareaClass } from '@/features/admin/components/ui/AdminForm';

interface CompanyInfo {
  name: string;
  aboutContent: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export default function AdminCompany() {
  const [formData, setFormData] = useState<CompanyInfo>({
    name: '',
    aboutContent: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    apiClient.get<CompanyInfo>('/api/admin/company')
      .then(res => {
        if (!active) return;
        if (res.data) {
          setFormData({
            name: res.data.name || '',
            aboutContent: res.data.aboutContent || '',
            email: res.data.email || '',
            phone: res.data.phone || '',
            address: res.data.address || '',
            city: res.data.city || '',
            state: res.data.state || '',
            country: res.data.country || '',
            latitude: res.data.latitude !== null ? Number(res.data.latitude) : null,
            longitude: res.data.longitude !== null ? Number(res.data.longitude) : null,
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load company info:', err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      ...formData,
      latitude: formData.latitude !== null ? Number(formData.latitude) : null,
      longitude: formData.longitude !== null ? Number(formData.longitude) : null,
    };

    try {
      await apiClient.patch('/api/admin/company', payload);
      setFeedback({ type: 'success', message: 'Company settings updated successfully.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update company settings.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-zinc-500 font-mono">Loading company settings...</div>;
  }

  return (
    <div className="space-y-6 font-mono text-zinc-300">
      <div>
        <h1 className="text-2xl font-black text-white mb-1">Company Profile</h1>
        <p className="text-sm text-zinc-400">Configure global company details, contact information, and geographic office coordinates.</p>
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg flex items-start gap-3 border ${
          feedback.type === 'success' 
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400' 
            : 'bg-red-950/30 border-red-800/50 text-red-400'
        }`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Core Info */}
        <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building size={18} className="text-red-500" />
            General Information
          </h2>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-400 uppercase">Company Name</label>
            <input
              required
              type="text"
              className={InputClass}
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-400 uppercase">About Summary</label>
            <textarea
              required
              rows={4}
              className={TextareaClass}
              value={formData.aboutContent}
              onChange={e => setFormData({ ...formData, aboutContent: e.target.value })}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail size={18} className="text-red-500" />
            Contact & Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">Public Email</label>
              <input
                required
                type="email"
                className={InputClass}
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">Public Phone</label>
              <input
                required
                type="text"
                className={InputClass}
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="bg-[#111] border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin size={18} className="text-red-500" />
            Location & Geographic Coordinates
          </h2>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-400 uppercase">Street Address</label>
            <input
              required
              type="text"
              className={InputClass}
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">City</label>
              <input
                required
                type="text"
                className={InputClass}
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">State/Region</label>
              <input
                required
                type="text"
                className={InputClass}
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">Country</label>
              <input
                required
                type="text"
                className={InputClass}
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">Office Latitude (e.g. 12.9716)</label>
              <input
                type="number"
                step="any"
                className={InputClass}
                value={formData.latitude !== null ? formData.latitude : ''}
                onChange={e => setFormData({ ...formData, latitude: e.target.value === '' ? null : Number(e.target.value) })}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-400 uppercase">Office Longitude (e.g. 77.5946)</label>
              <input
                type="number"
                step="any"
                className={InputClass}
                value={formData.longitude !== null ? formData.longitude : ''}
                onChange={e => setFormData({ ...formData, longitude: e.target.value === '' ? null : Number(e.target.value) })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Save size={16} />
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
