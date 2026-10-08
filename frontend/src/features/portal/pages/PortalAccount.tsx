import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Key, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PortalAccount() {
  const { user } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    // If the user arrived via a password recovery link, open the form automatically
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowPasswordForm(true);
        setUpdateMessage('Please enter your new password below.');
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setUpdateMessage('Password must be at least 6 characters.');
      return;
    }
    
    setIsUpdating(true);
    setUpdateMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setUpdateMessage('Password successfully updated!');
      setNewPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setUpdateMessage('');
      }, 3000);
    } catch (err: any) {
      setUpdateMessage(err.message || 'Failed to update password.');
    } finally {
      setIsUpdating(false);
    }
  };

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
            
            {!showPasswordForm ? (
              <>
                <button 
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center gap-3 px-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-xl hover:border-[var(--color-brand)] text-[var(--text-primary)] font-medium transition-all w-full md:w-auto"
                >
                  <Key size={18} className="text-[var(--text-secondary)]" />
                  Change Password
                </button>
                <p className="text-sm text-[var(--text-secondary)] mt-3">
                  Update your password to keep your account secure.
                </p>
              </>
            ) : (
              <form onSubmit={handleUpdatePassword} className="bg-[var(--bg-primary)] p-6 rounded-xl border border-[var(--border-strong)] max-w-md space-y-4">
                <h4 className="font-bold text-[var(--text-primary)]">Enter New Password</h4>
                
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full p-3 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none focus:border-[var(--color-brand)]"
                  disabled={isUpdating}
                  required
                />
                
                {updateMessage && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${updateMessage.includes('success') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {updateMessage}
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex-1 py-3 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 flex justify-center items-center"
                  >
                    {isUpdating ? <Loader2 size={18} className="animate-spin" /> : 'Save Password'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setShowPasswordForm(false); setUpdateMessage(''); setNewPassword(''); }}
                    className="px-6 py-3 bg-[var(--surface-secondary)] text-[var(--text-primary)] font-bold rounded-lg hover:bg-[var(--border-strong)]"
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
