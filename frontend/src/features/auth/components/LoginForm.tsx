import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Loader2, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { Button, InputField } from '@/components/ui';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import { TwoFASetupWizard } from './TwoFASetupWizard';
import { supabase } from '@/lib/supabase';

type LoginStep = 'credentials' | 'mfa' | 'setup_mfa';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [step, setStep] = useState<LoginStep>('credentials');
  const [factorId, setFactorId] = useState('');
  
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect handling
  const handleSuccessRedirect = async (role: string) => {
    await checkAuth(); // Make sure context captures session
    const redirectUrl = searchParams.get('redirect');
    if (redirectUrl) {
      navigate(redirectUrl);
    } else if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'ORDER_MANAGER' || role === 'CONTENT_MANAGER' || role === 'CAREER_MANAGER') {
      navigate(ROUTES.ADMIN);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus('error');
      setErrorMessage('Email and password are required.');
      return;
    }
    
    setStatus('submitting');
    setErrorMessage('');
    setIsRateLimited(false);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('rate limit')) {
          setIsRateLimited(true);
        }
        throw error;
      }
      
      if (data.user) {
        // Check if MFA is required
        const factorsRes = await supabase.auth.mfa.listFactors();
        if (factorsRes.error) throw factorsRes.error;
        
        const totpFactors = factorsRes.data.totp;
        const verifiedFactor = totpFactors.find(f => f.status === 'verified');
        
        if (verifiedFactor) {
          // Has verified factor, require challenge
          setFactorId(verifiedFactor.id);
          setStep('mfa');
          setStatus('idle');
          return;
        }
        
        // Admin role check -> MUST setup MFA
        const role = data.user.app_metadata?.role as string;
        if (role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'ORDER_MANAGER' || role === 'CONTENT_MANAGER' || role === 'CAREER_MANAGER') {
          setStep('setup_mfa');
          setStatus('idle');
          return;
        }

        // Normal user, skip MFA
        setStatus('success');
        setPassword('');
        await handleSuccessRedirect(role || 'USER');
      }
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Invalid email or password.');
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setStatus('error');
      setErrorMessage('Please enter the 6-digit authentication code from your app.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setIsRateLimited(false);

    try {
      const challengeRes = await supabase.auth.mfa.challenge({ factorId });
      if (challengeRes.error) throw challengeRes.error;

      const verifyRes = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeRes.data.id,
        code: mfaCode
      });
      
      if (verifyRes.error) throw verifyRes.error;

      setStatus('success');
      
      // Ensure session is fresh and we read role correctly
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.app_metadata?.role as string;
      
      await handleSuccessRedirect(role || 'USER');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || 'Invalid code. Please try again.');
    }
  };

  if (step === 'setup_mfa') {
    return (
      <div className="space-y-6">
        <TwoFASetupWizard
          onEnabled={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const role = user?.app_metadata?.role as string;
            await handleSuccessRedirect(role || 'USER');
          }}
          onCancel={async () => {
            setStep('credentials');
            await supabase.auth.signOut();
          }}
        />
      </div>
    );
  }

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
            onClick={async () => { 
              setStep('credentials'); 
              setMfaCode(''); 
              setStatus('idle'); 
              setErrorMessage(''); 
              setIsRateLimited(false);
              await supabase.auth.signOut();
            }}
            className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            disabled={status === 'submitting' || status === 'success'}
          >
            ? Back to login
          </button>
        </div>
      </form>
    );
  }

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
