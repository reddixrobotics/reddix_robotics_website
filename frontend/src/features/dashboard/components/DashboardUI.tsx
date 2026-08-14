import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center">
          <Icon size={24} className="text-[var(--color-brand)]" />
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-body-sm text-[var(--text-secondary)] mb-1">{title}</p>
        <h3 className="text-display-xs">{value}</h3>
      </div>
    </div>
  );
}

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-12 text-center">
        <p className="text-[var(--text-secondary)]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-strong)]">
              {columns.map((col, idx) => (
                <th key={idx} className="p-4 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-strong)]">
            {data.map((item, idx) => (
              <tr key={idx} className="hover:bg-[var(--bg-primary)] transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="p-4 text-sm whitespace-nowrap">
                    {col.cell ? col.cell(item) : (item[col.accessor] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Badge Component specifically for Status fields
export function StatusBadge({ status }: { status: string }) {
  let colorClass = 'bg-gray-500/10 text-gray-500';
  
  const s = status.toLowerCase();
  if (s.includes('delivered') || s.includes('success')) colorClass = 'bg-green-500/10 text-green-500';
  else if (s.includes('processing') || s.includes('review') || s.includes('scheduled')) colorClass = 'bg-yellow-500/10 text-yellow-500';
  else if (s.includes('upcoming') || s.includes('pending')) colorClass = 'bg-blue-500/10 text-blue-500';
  else if (s.includes('failed') || s.includes('cancelled')) colorClass = 'bg-red-500/10 text-red-500';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {status}
    </span>
  );
}
