import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Shield, UserPlus, MessageSquare, Trash2 } from 'lucide-react';

export default function AdminTeachers() {
  const { userRole, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pass = "Teach-";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass + "!";
  };

  useEffect(() => {
    setPassword(generatePassword());
    if (userRole === 'SUPER_ADMIN') {
      fetchTeachers();
    }
  }, [userRole]);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_teachers');
      if (error) {
        // Suppress error in UI if function doesn't exist yet, just leave array empty
        console.error("Failed to fetch teachers:", error.message);
        return;
      }
      setTeachers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveTeacher = async (teacherId: string, teacherEmail: string) => {
    if (!confirm(`Are you sure you want to completely delete the teacher account for ${teacherEmail}?`)) return;
    
    try {
      // For simplicity, we reuse the admin-users delete_admin (which deletes from Admin table, 
      // but wait - we need to delete from auth.users! Let's just remove the role for now)
      // Actually, since we don't have a delete_teacher edge function, we will alert the user:
      alert("To fully delete this account, please remove them from the Supabase Authentication Dashboard.");
    } catch (err: any) {
      console.error(err);
    }
  }

  // Security block - Only SUPER_ADMIN can manage teachers
  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        <Shield size={48} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>Only Super Admins can provision Teachers.</p>
      </div>
    );
  }

  const handleProvisionTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !session?.access_token) return;

    setLoading(true);
    setStatus('Creating teacher account...');

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ action: 'create_teacher', email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create teacher account');

      setStatus(`Provisioned! Sending email to ${email}...`);

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({
            to: email,
            subject: 'Welcome to the Reddix Robotics Teacher Portal!',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #b91c1c;">Welcome to the Reddix Teaching Team!</h2>
                <p>Your official Teacher Portal account has been created successfully.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Login URL:</strong> <a href="https://reddixrobotics.com/login">reddixrobotics.com/login</a></p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Password:</strong> ${password}</p>
                </div>
                <p>Please log in using the credentials above. You will be immediately redirected to the Doubt Forum dashboard to start helping students.</p>
                <p>Best regards,<br/>The Reddix Robotics Team</p>
              </div>
            `
          })
        });
        setStatus(`Success! Account created and email sent to ${email}`);
      } catch (mailErr) {
        setStatus(`Success, but failed to send email to ${email}. Give them the password manually: ${password}`);
      }

      setEmail('');
      setPassword(generatePassword());
      fetchTeachers(); // Refresh table!
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">Teacher Provisioning</h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Create new Teacher accounts and view existing active teachers on the platform.
        </p>
      </div>

      <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-strong)]">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand)] flex items-center justify-center">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">Provision a Teacher</h2>
            <p className="text-sm text-[var(--text-secondary)]">The system will generate a secure password and email it to them.</p>
          </div>
        </div>

        {status && (
          <div className={`p-4 mb-6 rounded-xl border font-medium ${status.startsWith('Error') ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
            {status}
          </div>
        )}

        <form onSubmit={handleProvisionTeacher} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Teacher Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className="w-full p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--text-primary)] mb-2">Temporary Password</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                required 
                minLength={6} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" 
              />
              <button 
                type="button" 
                onClick={() => setPassword(generatePassword())} 
                className="px-6 py-4 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-xl hover:bg-[var(--surface-hover)] font-bold transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full py-4 mt-2 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Provisioning Teacher...' : 'Create Account & Send Email'}
          </button>
        </form>
      </div>

      {/* Teachers List Table */}
      <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-[var(--border-strong)] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Active Teachers</h2>
          <span className="px-3 py-1 bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-bold rounded-full text-sm">
            {teachers.length} Total
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-strong)] text-[var(--text-secondary)] text-sm uppercase tracking-wider bg-[var(--bg-primary)]">
                <th className="p-4 font-semibold">Teacher Email</th>
                <th className="p-4 font-semibold">Role Status</th>
                <th className="p-4 font-semibold">Created At</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--text-secondary)]">
                    No teachers found. Provision one above! (Ensure you ran the SQL function).
                  </td>
                </tr>
              ) : (
                teachers.map(t => (
                  <tr key={t.id} className="border-b border-[var(--border-strong)] hover:bg-[var(--bg-primary)] transition-colors">
                    <td className="p-4 text-[var(--text-primary)] font-medium">{t.email}</td>
                    <td className="p-4">
                      <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold">
                        TEACHER
                      </span>
                    </td>
                    <td className="p-4 text-[var(--text-secondary)] text-sm">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleRemoveTeacher(t.id, t.email)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove Teacher"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
