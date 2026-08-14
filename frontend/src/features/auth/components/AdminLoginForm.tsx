import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui';
import apiClient from '@/services/apiClient';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam === '2fa') {
      setStep('mfa');
    }

    apiClient.get('/api/admin/auth/session')
      .then((res) => {
        if (res.data.authenticated) {
          if (res.data.session.needs2fa) {
            setStep('mfa');
          } else {
            window.location.href = '/admin';
          }
        }
      })
      .catch(() => {
        // Ignore session check error
      });
  }, [searchParams]);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('error');
      setErrorMessage('Email and password are required.');
      return;
    }
    
    setStatus('submitting');
    setErrorMessage('');

    apiClient.post('/api/admin/auth/login', { email, password })
      .then((res) => {
        setStatus('idle');
        if (res.data.require2fa) {
          setStep('mfa');
        } else {
          setStatus('success');
          window.location.href = '/admin';
        }
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'Invalid credentials or unauthorized access.');
      });
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setStatus('error');
      setErrorMessage('Please enter a valid 6-digit code.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    apiClient.post('/api/admin/auth/verify-2fa', { token: mfaCode })
      .then(() => {
        setStatus('success');
        window.location.href = '/admin';
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'Verification failed. Please check the code.');
      });
  };

  if (step === 'mfa') {
    return (
      <form onSubmit={handleMfaSubmit} className="space-y-6">
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3 mb-6">
          <ShieldAlert className="text-yellow-500 flex-shrink-0" />
          <p className="text-sm text-yellow-500 font-medium">
            Two-factor authentication is required for all administrative access.
          </p>
        </div>

        <div>
          <InputField 
            label="Verification Code"
            type="text"
            id="mfaCode"
            placeholder="000000"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="one-time-code"
          />
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>

        {status === 'error' && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-500">
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={status === 'submitting' || status === 'success'}
        >
          {status === 'submitting' ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Verifying...</>
          ) : status === 'success' ? (
            'Access Granted'
          ) : (
            'Verify & Login'
          )}
        </Button>
        
        <div className="text-center">
          <button 
            type="button" 
            onClick={() => { setStep('credentials'); setMfaCode(''); setStatus('idle'); }}
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            disabled={status === 'submitting' || status === 'success'}
          >
            Back to login
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
      <div>
        <InputField 
          label="Admin Email"
          type="email"
          id="email"
          placeholder="admin@reddixrobotics.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'submitting'}
          required
          autoComplete="email"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="text-body-sm font-medium text-[var(--text-primary)]">
            Password
          </label>
          <a href="#" className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">
            Forgot Password?
          </a>
        </div>
        <InputField 
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={status === 'submitting'}
          required
          autoComplete="current-password"
          iconRight={
            <button
              type="button"
              className="p-1 text-[var(--text-secondary)] hover:text-white focus:outline-none rounded"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={status === 'submitting'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>

      {status === 'error' && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-500">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <><Loader2 className="animate-spin mr-2" size={18} /> Authenticating...</>
        ) : (
          'Login'
        )}
      </Button>
    </form>
  );
}
