import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { InputField } from '@/components/ui/Input';
import { ROUTES } from '@/routes/routePaths';
import { supabase } from '@/lib/supabase';

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Optional: check if we have a valid session to update password
    // Sometimes the hash is automatically processed by supabase-js.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setStatus('error');
        setMessage('Your password reset link is invalid or has expired. Please request a new one.');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setStatus('success');
      setMessage('Your password has been successfully updated.');
      setTimeout(() => {
        navigate(ROUTES.PORTAL);
      }, 2000);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(error.message || 'Failed to update password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-brand)]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="w-full max-w-lg relative z-10">
        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-strong)] shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[var(--color-brand)] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand/20 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
              <KeyRound size={32} className="text-white relative z-10" />
            </div>
            <h1 className="text-display-xs mb-2">Update Password</h1>
            <p className="text-body-md text-[var(--text-secondary)]">Enter your new secure password.</p>
          </div>

          {status === 'success' ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-emerald-400 font-medium">{message}</div>
              <p className="text-sm text-[var(--text-secondary)]">Redirecting you to the portal...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <InputField label="New Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={status === 'submitting' || message === 'Your password reset link is invalid or has expired. Please request a new one.'} required />
              </div>
              <div>
                <InputField label="Confirm Password" type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={status === 'submitting' || message === 'Your password reset link is invalid or has expired. Please request a new one.'} required />
              </div>
              {status === 'error' && <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium text-center">{message}</div>}
              <Button type="submit" className="w-full" size="lg" disabled={status === 'submitting' || message === 'Your password reset link is invalid or has expired. Please request a new one.'}>
                {status === 'submitting' ? <><Loader2 className="animate-spin mr-2" size={18} /> Updating...</> : 'Update Password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
