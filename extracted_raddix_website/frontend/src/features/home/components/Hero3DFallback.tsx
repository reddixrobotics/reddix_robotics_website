import React from 'react';
import { cn } from '@/utils';
import { ShieldAlert } from 'lucide-react';

export default function Hero3DFallback() {
  return (
    <div className={cn(
      "w-full h-full flex items-center justify-center",
      "bg-gradient-to-br from-[var(--bg-primary)] to-[#1a0a0a]",
      "border border-[var(--border-primary)] rounded-lg overflow-hidden",
      "relative"
    )}>
      {/* Subtle tech background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(var(--color-brand) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }} />
      
      <div className="z-10 flex flex-col items-center p-6 text-center bg-black/40 backdrop-blur-md rounded-xl border border-[var(--color-brand)]/20 shadow-[0_0_30px_rgba(255,51,51,0.1)]">
        <ShieldAlert className="w-12 h-12 text-[var(--color-brand)] mb-4 opacity-80" />
        <h3 className="text-lg font-display text-[var(--text-primary)] tracking-wide mb-2">
          Interactive Experience Unavailable
        </h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-[250px]">
          Hardware acceleration is disabled or unsupported on this device.
        </p>
      </div>
      
      {/* Decorative scanning line */}
      <div className="absolute left-0 right-0 h-0.5 bg-[var(--color-brand)] opacity-20 shadow-[0_0_10px_var(--color-brand)] animate-scan" />
    </div>
  );
}
