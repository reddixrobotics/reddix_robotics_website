import { ReactNode } from 'react';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

export function AdminStatCard({ title, value, icon: Icon }: AdminStatCardProps) {
  return (
    <div className="bg-[#111] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{title}</p>
        <div className="text-zinc-600">
          <Icon size={18} />
        </div>
      </div>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
  );
}
