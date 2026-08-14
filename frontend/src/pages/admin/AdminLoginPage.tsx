import { Shield } from 'lucide-react';
import AdminLoginForm from '@/features/auth/components/AdminLoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden font-mono">
      
      {/* Industrial/Security Background Styling */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #222 0, #222 1px, transparent 0, transparent 50%)',
            backgroundSize: '10px 10px'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Warning Banner */}
        <div className="bg-red-950/50 border border-red-900/50 rounded-t-xl p-3 flex items-center justify-center gap-2">
          <Shield size={16} className="text-red-500" />
          <span className="text-red-500 text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border-x border-b border-zinc-800 rounded-b-xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle grid in card */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="text-white font-black text-2xl tracking-tighter">REDDIX</span>
              <span className="text-red-500 font-bold text-lg ml-2 px-2 py-0.5 border border-red-500/30 bg-red-500/10 rounded">SYSTEM</span>
            </div>
            <h1 className="text-xl text-white font-semibold">System Administration</h1>
            <p className="text-zinc-400 text-sm mt-2">
              Authentication required to access internal services.
            </p>
          </div>

          <div className="relative z-10">
            {/* We enforce a dark mode internally for the admin login to ensure it looks distinct from the main site */}
            <div className="dark">
              <AdminLoginForm />
            </div>
          </div>

        </div>

        <div className="text-center mt-6 text-zinc-600 text-xs tracking-widest uppercase">
          IP Logged • Strict Monitoring Active
        </div>
      </div>
    </div>
  );
}
