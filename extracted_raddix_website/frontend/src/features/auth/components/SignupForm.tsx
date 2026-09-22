import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui';
import { ROUTES } from '@/routes/routePaths';
import apiClient from '@/services/apiClient';

export default function SignupForm() {
  const navigate = useNavigate();
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Password Strength State (0-4)
  const [strength, setStrength] = useState(0);

  // Calculate password strength whenever password changes
  useEffect(() => {
    let score = 0;
    if (password.length > 0) {
      if (password.length >= 8) score += 1;
      if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;
    }
    setStrength(score);
  }, [password]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setStatus('error');
      setErrorMessage('You must agree to the Terms & Conditions.');
      return;
    }

    if (strength < 2) {
      setStatus('error');
      setErrorMessage('Please choose a stronger password.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Send API request to backend
    apiClient.post('/api/auth/signup', { name, email, password, phone })
      .then(() => {
        setStatus('success');
        setTimeout(() => navigate(ROUTES.LOGIN), 1500);
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'An error occurred during registration.');
      });
  };

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-[var(--border-strong)]';
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength >= 3) return 'bg-green-500';
    return 'bg-[var(--border-strong)]';
  };

  const getStrengthText = () => {
    if (password.length === 0) return '';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    if (strength === 4) return 'Strong';
    return '';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Name Field */}
        <div>
          <InputField 
            type="text"
            id="name"
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="name"
          />
        </div>

        {/* Email Field */}
        <div>
          <InputField 
            type="email"
            id="email"
            label="Email Address"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="email"
          />
        </div>

        {/* Phone Field */}
        <div>
          <InputField 
            type="tel"
            id="phone"
            label="Phone Number (Optional)"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={status === 'submitting' || status === 'success'}
            autoComplete="tel"
          />
        </div>

        {/* Password Field */}
        <div>
          <InputField 
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="new-password"
            iconRight={
              <button
                type="button"
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] rounded"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={status === 'submitting' || status === 'success'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-1 flex-grow mr-4">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`h-1.5 flex-grow rounded-full transition-colors duration-300 ${level <= strength ? getStrengthColor() : 'bg-[var(--border-strong)]'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-[var(--text-secondary)] min-w-[40px] text-right">
                {getStrengthText()}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <InputField 
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={status === 'submitting' || status === 'success'}
            required
            autoComplete="new-password"
            error={confirmPassword && password !== confirmPassword ? "Passwords do not match" : undefined}
            iconRight={
              <button
                type="button"
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] rounded"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={status === 'submitting' || status === 'success'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="flex items-start gap-3 pt-2 pb-1">
          <input 
            type="checkbox" 
            id="terms" 
            className="mt-1 w-4 h-4 rounded border border-[var(--border-strong)] text-[var(--color-brand)] focus:ring-[var(--color-brand)] focus:ring-offset-[var(--bg-secondary)]"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            disabled={status === 'submitting' || status === 'success'}
          />
          <label htmlFor="terms" className="text-body-sm text-[var(--text-secondary)]">
            I agree to the <a href="#" className="text-[var(--color-brand)] hover:underline">Terms of Service</a> and <a href="#" className="text-[var(--color-brand)] hover:underline">Privacy Policy</a>.
          </label>
        </div>

        {/* Error Message */}
        {status === 'error' && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2 text-red-500 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
        )}

        {/* Success Message */}
        {status === 'success' && (
          <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center justify-center gap-2 text-green-500 animate-in fade-in zoom-in-95">
            <ShieldCheck size={18} className="text-green-500" />
            <p className="text-sm font-medium">Account created! Redirecting to login...</p>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full mt-4" 
          size="lg"
          disabled={status === 'submitting' || status === 'success'}
        >
          {status === 'submitting' ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Creating Account...</>
          ) : (
            <>Create Account <ArrowRight className="ml-2" size={18} /></>
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center text-body-sm text-[var(--text-secondary)]">
        Already have an account?{' '}
        <Link 
          to={ROUTES.LOGIN} 
          className="font-bold text-[var(--text-primary)] hover:text-[var(--color-brand)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-brand)] rounded px-1"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
