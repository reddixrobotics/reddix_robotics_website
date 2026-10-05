import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Shield, MailPlus, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

export default function AdminTeachers() {
  const { userRole, session } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Security block - Only SUPER_ADMIN can manage teachers
  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        <Shield size={48} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>Only Super Admins can invite Teachers.</p>
      </div>
    );
  }

  const handleInviteTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !session?.access_token) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Use our Supabase Edge Function which uses the Service Role Key to bypass the 400 error
      // and natively send a Supabase Auth Invite Email!
      const { error, data } = await supabase.functions.invoke('admin-users', {
        body: { action: 'invite_teacher', email: email.trim().toLowerCase() }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setMessage({ text: `Success! An invite email has been sent to ${email} with login instructions.`, type: 'success' });
      setEmail('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to send invite.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">Teacher Management</h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Invite new Teachers to the platform. They will receive an email to set their password and will be restricted to the Teacher portal.
        </p>
      </div>

      <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-strong)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center">
            <MailPlus size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Invite a new Teacher</h2>
            <p className="text-sm text-[var(--text-secondary)]">Sends an official invite email directly to their inbox.</p>
          </div>
        </div>

        <form onSubmit={handleInviteTeacher} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
              Teacher's Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className="w-full p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none"
              required
            />
          </div>

          {message.text && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              message.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
            }`}>
              {message.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertTriangle size={20} className="shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full py-4 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending Invite...' : 'Send Teacher Invite Email'}
          </button>
        </form>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4 text-blue-400">
        <MessageSquare className="shrink-0" />
        <div className="text-sm">
          <p className="font-bold mb-1">How the Invite Flow Works</p>
          <ul className="list-disc pl-4 space-y-1 opacity-90">
            <li>You enter their email above and click Send.</li>
            <li>Supabase sends them a secure "You have been invited" email.</li>
            <li>They click the link in their email to securely set their password.</li>
            <li>Upon logging in, they are immediately locked into the Teacher Dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
