import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Key } from 'lucide-react';

export default function PortalAccount() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-black text-[var(--text-primary)] mb-8">Account Settings</h1>
      
      <div className="bg-[var(--surface-secondary)] rounded-2xl border border-[var(--border-strong)] p-8 shadow-sm">
        <div className="flex items-center gap-6 pb-8 border-b border-[var(--border-strong)] mb-8">
          <div className="w-24 h-24 bg-[var(--color-brand)]/10 text-[var(--color-brand)] rounded-full flex items-center justify-center border-4 border-[var(--bg-primary)] shadow-inner">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{user?.email?.split('@')[0] || 'Student'}</h2>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] mt-1">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 bg-[var(--color-brand)]/10 text-[var(--color-brand)] px-3 py-1 rounded-full w-fit">
              <Shield size={14} />
              <span className="text-xs font-bold uppercase tracking-wider">Student Access</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Security</h3>
            <button className="flex items-center gap-3 px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-xl hover:border-[var(--color-brand)] text-[var(--text-primary)] font-medium transition-all w-full md:w-auto">
              <Key size={18} className="text-[var(--text-secondary)]" />
              Reset Password
            </button>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              If you need to update your password, a reset link will be sent to your email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
