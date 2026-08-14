import { Button } from '@/components/ui';
import { Bell, Shield, Key } from 'lucide-react';

export default function DashboardSettings() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Account Settings</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Manage your preferences and security settings.</p>
      </div>

      <div className="space-y-6">
        
        {/* Notifications */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center flex-shrink-0">
              <Bell size={20} className="text-[var(--color-brand)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Notifications</h3>
              <p className="text-body-sm text-[var(--text-secondary)] mb-4">Manage how you receive order updates and news.</p>
              
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]" />
                  <span className="text-sm">Email updates about orders and payments</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--border-strong)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]" />
                  <span className="text-sm">Marketing and product announcements</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-[var(--color-brand)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Security</h3>
              <p className="text-body-sm text-[var(--text-secondary)] mb-4">Protect your account with Two-Factor Authentication.</p>
              
              <div className="flex items-center justify-between p-4 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)]">
                <div>
                  <p className="font-medium text-sm">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Currently disabled.</p>
                </div>
                <Button variant="outline" size="sm">Enable 2FA</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-brand)]/10 flex items-center justify-center flex-shrink-0">
              <Key size={20} className="text-[var(--color-brand)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Change Password</h3>
              <p className="text-body-sm text-[var(--text-secondary)] mb-4">Update your password to keep your account secure.</p>
              
              <Button variant="outline">Update Password</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
