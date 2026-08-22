import { dashboardData } from '@/data/dashboard';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import apiClient from '@/services/apiClient';

export default function DashboardProfile() {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: dashboardData.user.location // Fallback as backend doesn't store location yet
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/auth/user/profile');
        setUserProfile(prev => ({
          ...prev,
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
        }));
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: Implement actual save endpoint
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Profile</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Manage your personal and contact information.</p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField 
              label="Full Name" 
              value={userProfile.name} 
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} 
            />
            <InputField 
              label="Email Address" 
              type="email" 
              value={userProfile.email} 
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              disabled // Usually email changes require separate verification
            />
            <InputField 
              label="Phone Number" 
              type="tel" 
              value={userProfile.phone} 
              onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
            />
            <InputField 
              label="Location" 
              value={userProfile.location} 
              onChange={(e) => setUserProfile({ ...userProfile, location: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-[var(--border-strong)] flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 animate-spin" size={18} /> Saving...</> : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
