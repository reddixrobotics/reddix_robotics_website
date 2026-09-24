import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertTriangle, ShieldAlert, Clock } from 'lucide-react';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui';
import apiClient from '@/services/apiClient';
import { fetchAdminSession } from '@/services/authSession';
import { TwoFASetupWizard } from '@/features/auth/components/TwoFASetupWizard';
import { ROUTES } from '@/routes/routePaths';

import { useAuth } from '@/context/AuthContext';

// Map raw API error messages to user-friendly strings
function friendlyError(rawMessage: string): string {
  const msg = rawMessage.toLowerCase();
  if (msg.includes('too many') || msg.includes('throttle') || msg.includes('rate')) {
    return 'Too many attempts. Please wait a few minutes before trying again.';
  }
  if (msg.includes('invalid credentials') || msg.includes('unauthorized')) {
    return 'Invalid email or password. Please check your credentials.';
  }
  if (msg.includes('invalid verification') || msg.includes('invalid authentication code') || msg.includes('totp')) {
    return 'Invalid authentication code. Please check your authenticator app and try again.';
  }
  if (msg.includes('2fa') && msg.includes('session')) {
    return 'Your session has expired. Please log in again.';
  }
  if (msg.includes('no active session')) {
    return 'Session expired. Please log in again.';
  }
  return rawMessage || 'An unexpected error occurred. Please try again.';
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  
  const [emailOtpCode, setEmailOtpCode] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'credentials' | 'email_otp' | 'setup_mfa' | 'mfa'>('credentials');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleSuccessRedirect = async (role: string) => {
    await checkAuth(); // Make sure AuthContext knows we are logged in before navigating
    const redirect = searchParams.get('redirect');
    if (redirect && redirect.startsWith('/')) {
      navigate(redirect);
      return;
    }
    if (role === 'USER') {
      navigate(ROUTES.PROFILE);
    } else {
      navigate(ROUTES.ADMIN);
    }
  };

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam === '2fa') {
      setStep('mfa');
    }

    fetchAdminSession()
      .then((res) => {
        if (res.data.authenticated) {
          if (res.data.session.authStatus === 'PENDING_EMAIL_OTP') {
            setStep('email_otp');
          } else if (res.data.session.authStatus === 'PENDING_AUTHENTICATOR') {
            if (res.data.isTwoFactorSetup) {
              setStep('mfa');
            } else {
              setStep('setup_mfa');
            }
          } else if (res.data.session.authStatus === 'AUTHENTICATED') {
            handleSuccessRedirect(res.data.role);
          }
        }
      })
      .catch(() => {
        // Ignore session check error — user simply isn't logged in
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
    setIsRateLimited(false);

    apiClient.post('/api/auth/login', { email, password })
      .then((res) => {
        setStatus('idle');
        if (res.data.requireEmailOtp) {
          setStep('email_otp');
        } else {
          setStatus('success');
          handleSuccessRedirect(res.data.role);
        }
      })
      .catch((err) => {
        const msg = err.message || '';
        const isThrottled = msg.toLowerCase().includes('too many') || msg.toLowerCase().includes('throttle');
        setIsRateLimited(isThrottled);
        setStatus('error');
        setErrorMessage(friendlyError(msg));
      });
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setStatus('error');
      setErrorMessage('Please enter the 6-digit authentication code from your app.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setIsRateLimited(false);

    apiClient.post('/api/auth/verify-2fa', { token: mfaCode })
      .then((res) => {
        setStatus('success');
        handleSuccessRedirect(res.data.session.role);
      })
      .catch((err) => {
        const msg = err.message || '';
        const isThrottled = msg.toLowerCase().includes('too many') || msg.toLowerCase().includes('throttle');
        setIsRateLimited(isThrottled);
        setStatus('error');
        setMfaCode('');
        setErrorMessage(friendlyError(msg));
      });
  };

  const handleEmailOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailOtpCode.length < 6) {
      setStatus('error');
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setIsRateLimited(false);

    apiClient.post('/api/auth/verify-email-otp', { otp: emailOtpCode })
      .then((res) => {
        setStatus('idle');
        if (res.data.session.authStatus === 'PENDING_AUTHENTICATOR') {
          if (res.data.isTwoFactorSetup) {
            setStep('mfa');
          } else {
            setStep('setup_mfa');
          }
        } else if (res.data.session.authStatus === 'AUTHENTICATED') {
          handleSuccessRedirect(res.data.session.role);
        }
      })
      .catch((err) => {
        const msg = err.message || '';
        const isThrottled = msg.toLowerCase().includes('too many') || msg.toLowerCase().includes('throttle');
        setIsRateLimited(isThrottled);
        setStatus('error');
        setEmailOtpCode('');
        setErrorMessage(friendlyError(msg));
      });
  };

  const handleResendEmailOtp = () => {
    setStatus('submitting');
    setErrorMessage('');
    
    apiClient.post('/api/auth/resend-email-otp')
      .then(() => {
        setStatus('idle');
        setErrorMessage('Verification code resent successfully.');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .catch((err) => {
        const msg = err.message || '';
        const isThrottled = msg.toLowerCase().includes('too many') || msg.toLowerCase().includes('throttle');
        setIsRateLimited(isThrottled);
        setStatus('error');
        setErrorMessage(friendlyError(msg));
      });
  };

  // ── Email OTP Step ────────────────────────────────────────────────────────

  if (step === 'email_otp') {
    return (
      <form onSubmit={handleEmailOtpSubmit} className="space-y-6">
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-3 mb-6">
          <ShieldAlert className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-500 font-medium">
              Email Verification
            </p>
            <p className="text-xs text-blue-500/70 mt-1">
              We've sent a 6-digit code to your email. Enter it below.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="emailOtpCode" className="block text-body-sm font-medium text-[var(--text-primary)] mb-2">
            Verification Code
          </label>
          <input
            id="emailOtpCode"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={emailOtpCode}
            onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="one-time-code"
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl font-mono text-white tracking-[0.5em] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 placeholder:text-zinc-700 placeholder:tracking-normal"
          />
        </div>

        {status === 'error' && errorMessage && !errorMessage.includes('successfully') && (
          <div className={`p-3 rounded-lg flex items-start gap-2 border ${
            isRateLimited
              ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {isRateLimited ? (
              <Clock size={18} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {errorMessage && errorMessage.includes('successfully') && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm font-medium text-center">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm font-medium text-center">
            Verification successful — continuing...
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={status === 'submitting' || status === 'success' || isRateLimited}
        >
          {status === 'submitting' ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Verifying...</>
          ) : status === 'success' ? (
            'Verification Successful'
          ) : (
            'Verify Email'
          )}
        </Button>
        
        <div className="flex flex-col gap-3 text-center mt-4">
          <button 
            type="button" 
            onClick={handleResendEmailOtp}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            disabled={status === 'submitting' || status === 'success'}
          >
            Resend Verification Code
          </button>
          <button 
            type="button" 
            onClick={() => { setStep('credentials'); setEmailOtpCode(''); setStatus('idle'); setErrorMessage(''); setIsRateLimited(false); apiClient.post('/api/auth/logout').catch(() => {}); }}
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            disabled={status === 'submitting' || status === 'success'}
          >
            ← Back to login
          </button>
        </div>
      </form>
    );
  }

  // ── 2FA Setup Step ────────────────────────────────────────────────────────
  if (step === 'setup_mfa') {
    return (
      <div className="space-y-6">
        <TwoFASetupWizard
          onEnabled={() => {
            navigate(ROUTES.ADMIN);
          }}
          onCancel={() => {
            setStep('credentials');
            apiClient.post('/api/auth/logout').catch(() => {});
          }}
        />
      </div>
    );
  }

  // ── 2FA Step ──────────────────────────────────────────────────────────────

  if (step === 'mfa') {
    return (
      <form onSubmit={handleMfaSubmit} className="space-y-6">
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-3 mb-6">
          <ShieldAlert className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-yellow-500 font-medium">
              Two-factor authentication required
            </p>
            <p className="text-xs text-yellow-500/70 mt-1">
              Enter the 6-digit code from your authenticator app to continue.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="mfaCode" className="block text-body-sm font-medium text-[var(--text-primary)] mb-2">
            Authentication Code
          </label>
          <input
            id="mfaCode"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            maxLength={6}
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="one-time-code"
            autoFocus
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-center text-2xl font-mono text-white tracking-[0.5em] focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 disabled:opacity-50 placeholder:text-zinc-700 placeholder:tracking-normal"
          />
          <p className="text-xs text-[var(--text-secondary)] mt-2">
            The code refreshes every 30 seconds.
          </p>
        </div>

        {status === 'error' && (
          <div className={`p-3 rounded-lg flex items-start gap-2 border ${
            isRateLimited
              ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          }`}>
            {isRateLimited ? (
              <Clock size={18} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/40 rounded-lg text-emerald-400 text-sm font-medium text-center">
            Authentication successful — redirecting...
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          id="btn-mfa-submit"
          disabled={status === 'submitting' || status === 'success' || isRateLimited}
        >
          {status === 'submitting' ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Verifying...</>
          ) : status === 'success' ? (
            'Authentication Successful'
          ) : (
            'Verify & Login'
          )}
        </Button>
        
        <div className="text-center">
          <button 
            type="button" 
            onClick={() => { setStep('credentials'); setMfaCode(''); setStatus('idle'); setErrorMessage(''); setIsRateLimited(false); }}
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            disabled={status === 'submitting' || status === 'success'}
          >
            ← Back to login
          </button>
        </div>
      </form>
    );
  }

  // ── Credentials Step ──────────────────────────────────────────────────────

  return (
    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
      {searchParams.get('redirect') && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm font-medium text-center">
          Please login to continue.
        </div>
      )}
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

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="password" className="text-body-sm font-medium text-[var(--text-primary)]">
            Password
          </label>
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors">
            Forgot Password?
          </Link>
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
        <div className={`p-3 rounded-lg flex items-start gap-2 border ${
          isRateLimited
            ? 'bg-orange-500/10 border-orange-500/40 text-orange-400'
            : 'bg-red-500/10 border-red-500/50 text-red-400'
        }`}>
          {isRateLimited ? (
            <Clock size={18} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        id="btn-login-submit"
        disabled={status === 'submitting' || isRateLimited}
      >
        {status === 'submitting' ? (
          <><Loader2 className="animate-spin mr-2" size={18} /> Authenticating...</>
        ) : (
          'Login'
        )}
      </Button>
      
      {/* Footer Links */}
      <div className="mt-6 text-center text-body-sm text-[var(--text-secondary)]">
        Don't have an account?{' '}
        <Link 
          to={ROUTES.SIGNUP} 
          className="font-bold text-[var(--text-primary)] hover:text-[var(--color-brand)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-brand)] rounded px-1"
        >
          Create Account
        </Link>
      </div>
    </form>
  );
}
