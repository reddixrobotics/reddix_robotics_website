import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Shield, UserPlus, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

export default function AdminTeachers() {
  const { userRole } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Security block - Only SUPER_ADMIN can manage teachers
  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        <Shield size={48} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>Only Super Admins can assign the Teacher role.</p>
      </div>
    );
  }

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // Calls our custom Postgres RPC function
      const { error } = await supabase.rpc('assign_user_role', {
        target_email: email.trim().toLowerCase(),
        target_role: 'TEACHER'
      });

      if (error) throw error;

      setMessage({ text: `Successfully upgraded ${email} to TEACHER!`, type: 'success' });
      setEmail('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to assign role. Ensure the user exists.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">Teacher Management</h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Assign the Teacher role to existing users. Teachers get an isolated dashboard where they can only view and answer student doubts.
        </p>
      </div>

      <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-strong)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Add a new Teacher</h2>
            <p className="text-sm text-[var(--text-secondary)]">The user must already have registered an account.</p>
          </div>
        </div>

        <form onSubmit={handleAssignTeacher} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">
              User's Email Address
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
            {loading ? 'Assigning...' : 'Assign Teacher Role'}
          </button>
        </form>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4 text-blue-400">
        <MessageSquare className="shrink-0" />
        <div className="text-sm">
          <p className="font-bold mb-1">How it works</p>
          <ul className="list-disc pl-4 space-y-1 opacity-90">
            <li>Tell your teacher to sign up normally on the public website.</li>
            <li>Enter their email here to upgrade them to a Teacher.</li>
            <li>The next time they log in, they will be sent straight to the isolated Doubt Forum dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
