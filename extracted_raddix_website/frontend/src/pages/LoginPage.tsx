import { Link } from 'react-router-dom';
import { Bot, ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/features/auth';
import { ROUTES } from '@/routes/routePaths';

export default function LoginPage() {
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
            <h1 className="text-display-xs mb-2">Welcome Back</h1>
            <p className="text-body-md text-[var(--text-secondary)]">
              Sign in to manage your enterprise fleet.
            </p>
          </div>

          <LoginForm />

        </div>
      </div>
    </div>
  );
}
