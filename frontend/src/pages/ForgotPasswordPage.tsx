import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Loader2, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui';
import { InputField } from '@/components/ui/Input';
import { ROUTES } from '@/routes/routePaths';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    setMessage('');

    // Simulate API call for forgot password
    setTimeout(() => {
      setStatus('success');
      setMessage('If an account exists with that email, a password reset link has been sent.');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--color-brand)]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Card */}
        <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl border border-[var(--border-strong)] shadow-2xl rounded-3xl p-8 md:p-12">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[var(--color-brand)] rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-brand/20 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
              <Bot size={32} className="text-white relative z-10" />
            </div>
            <h1 className="text-display-xs mb-2">Reset Password</h1>
            <p className="text-body-md text-[var(--text-secondary)]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {status === 'success' ? (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm font-medium text-center">
                {message}
              </div>
              <div className="text-center">
                <Link 
                  to={ROUTES.LOGIN} 
                  className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--color-brand)] transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <InputField 
                  label="Email Address"
                  type="email"
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'submitting'}
                  required
                  autoComplete="email"
                />
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium text-center">
                  {message}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <><Loader2 className="animate-spin mr-2" size={18} /> Sending Link...</>
                ) : (
                  <><Send className="mr-2" size={18} /> Send Reset Link</>
                )}
              </Button>
              
              <div className="text-center mt-6">
                <Link 
                  to={ROUTES.LOGIN} 
                  className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--color-brand)] transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Back to Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
