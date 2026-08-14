import { dashboardData } from '@/data/dashboard';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardProfile() {
  const { user } = dashboardData;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Profile</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Manage your personal and company information.</p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" defaultValue={user.name} />
            <InputField label="Email Address" type="email" defaultValue={user.email} />
            <InputField label="Company" defaultValue={user.company} />
            <InputField label="Role" defaultValue={user.role} />
            <InputField label="Phone Number" type="tel" defaultValue={user.phone} />
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
