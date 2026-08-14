import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { InputField } from '@/components/ui/Input';
import { Button } from '@/components/ui';
import { ROUTES } from '@/routes/routePaths';

export default function LoginForm() {
  const navigate = useNavigate();
  
  // State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handlers
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!email || !password) {
      setStatus('error');
      setErrorMessage('Please fill in all fields.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    // Simulate API request to backend
    setTimeout(() => {
      // Simulate random error or success
      if (email === 'error@reddix.com') {
        setStatus('error');
        setErrorMessage('Invalid credentials. Please try again.');
      } else {
        setStatus('success');
        // Simulate redirect after successful login
        setTimeout(() => navigate(ROUTES.HOME), 1000);
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        
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

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="input-label mb-0">Password</label>
            <Link 
              to="#" 
              className="text-body-sm font-medium text-[var(--color-brand)] hover:underline focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-brand)] rounded"
              tabIndex={0}
            >
              Forgot Password?
            </Link>
          </div>
          
          <div className="relative">
            <InputField 
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={status === 'submitting' || status === 'success'}
              required
              autoComplete="current-password"
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
          </div>
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
            <Loader2 size={18} className="animate-spin" />
            <p className="text-sm font-medium">Authentication successful. Redirecting...</p>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full mt-2" 
          size="lg"
          disabled={status === 'submitting' || status === 'success'}
        >
          {status === 'submitting' ? (
            <><Loader2 className="animate-spin mr-2" size={18} /> Authenticating...</>
          ) : (
            <>Sign In <ArrowRight className="ml-2" size={18} /></>
          )}
        </Button>
      </form>

      {/* Footer Links */}
      <div className="mt-8 text-center text-body-sm text-[var(--text-secondary)]">
        Don't have an account?{' '}
        <Link 
          to={ROUTES.SIGNUP} 
          className="font-bold text-[var(--text-primary)] hover:text-[var(--color-brand)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--color-brand)] rounded px-1"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
