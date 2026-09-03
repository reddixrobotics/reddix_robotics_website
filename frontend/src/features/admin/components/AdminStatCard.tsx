import { ReactNode } from 'react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

export function AdminStatCard({ title, value, icon: Icon }: AdminStatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-border-strong transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-content-tertiary uppercase tracking-wider">{title}</p>
        <div className="text-zinc-600">
          <Icon size={18} />
        </div>
      </div>
      <h3 className="text-2xl font-black text-content">{value}</h3>
    </div>
  );
}
