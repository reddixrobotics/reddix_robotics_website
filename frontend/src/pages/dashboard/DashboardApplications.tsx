import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { DataTable, StatusBadge } from '@/features/dashboard/components/DashboardUI';
import { Button } from '@/components/ui';

export default function DashboardApplications() {
  const [data, setData] = useState<{ applications: any[], registrations: any[] }>({ applications: [], registrations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/api/auth/user/applications')
      .then(res => {
        setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formattedData = [
    ...data.applications.map(app => ({
      id: app.id,
      type: app.type,
      title: app.job?.title || app.internship?.title || 'General Application',
      date: new Date(app.createdAt).toLocaleDateString(),
      status: app.status === 'RECEIVED' ? 'APPLIED' : app.status
    })),
    ...data.registrations.map(reg => ({
      id: reg.id,
      type: 'WORKSHOP',
      title: reg.workshop?.title || 'Workshop Registration',
      date: new Date(reg.createdAt).toLocaleDateString(),
      status: reg.status
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const columns = [
    { header: 'Title', accessor: 'title' as const, cell: (item: any) => <span className="font-medium text-white">{item.title}</span> },
    { header: 'Type', accessor: 'type' as const, cell: (item: any) => <span className="text-[var(--color-brand)]">{item.type}</span> },
    { header: 'Submitted Date', accessor: 'date' as const },
    { header: 'Status', accessor: 'status' as const, cell: (item: any) => <StatusBadge status={item.status} /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-sm mb-2">Applications</h1>
        <p className="text-body-lg text-[var(--text-secondary)]">Track the status of your job, internship, and workshop applications.</p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-[var(--text-secondary)]">Loading applications...</div>
      ) : (
        <DataTable columns={columns} data={formattedData} emptyMessage="You haven't submitted any applications yet." />
      )}
    </div>
  );
}
