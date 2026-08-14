import { dashboardData } from '@/data/dashboard';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';

export default function DashboardApplications() {
  const { applications } = dashboardData;

  const columns = [
    { header: 'Application ID', accessor: 'id' as const, cell: (item: any) => <span className="font-mono text-[var(--color-brand)]">{item.id}</span> },
    { header: 'Type', accessor: 'type' as const, cell: (item: any) => <span className="font-medium">{item.type}</span> },
    { header: 'Submitted Date', accessor: 'date' as const },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
    { header: 'Action', accessor: 'id' as const, cell: () => <Button variant="outline" size="sm">View Status</Button> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Applications</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Track the status of your partnership requests and job applications.</p>
      </div>

      <DataTable columns={columns} data={applications} emptyMessage="You haven't submitted any applications yet." />
    </div>
  );
}
