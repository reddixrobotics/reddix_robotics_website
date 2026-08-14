import { AlertTriangle } from 'lucide-react';

export default function DevDataBanner() {
  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-2 flex items-center justify-center gap-2 flex-shrink-0">
      <AlertTriangle size={16} className="text-yellow-500" />
      <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest">
        Development Mode: Displaying Mock Data
      </span>
    </div>
  );
}
