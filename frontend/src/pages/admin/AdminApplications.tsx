/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-floating-promises, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react';
import type { ApplicationData, WorkshopRegistrationData } from '@/features/admin/services/apiService';
import { applicationService } from '@/features/admin/services/apiService';
import { Button, Card, Badge } from '@/components/ui';
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function AdminApplications() {
  const [activeTab, setActiveTab] = useState<'JOBS' | 'INTERNSHIPS' | 'WORKSHOPS'>('JOBS');
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [registrations, setRegistrations] = useState<WorkshopRegistrationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, regRes] = await Promise.all([
        applicationService.getAllApplications(),
        applicationService.getAllWorkshopRegistrations()
      ]);
      setApplications(appsRes);
      setRegistrations(regRes);
    } catch (error) {
      console.error('Error fetching applications data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (id: string, status: string) => {
    try {
      await applicationService.updateApplicationStatus(id, status);
      setApplications(applications.map(app => app.id === id ? { ...app, status } : app));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleUpdateRegistrationStatus = async (id: string, status: string) => {
    try {
      await applicationService.updateWorkshopRegistrationStatus(id, status);
      setRegistrations(registrations.map(reg => reg.id === id ? { ...reg, status } : reg));
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const jobsData = applications.filter(a => a.type === 'JOB');
  const internshipsData = applications.filter(a => a.type === 'INTERNSHIP');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-content">Applications</h1>
          <p className="text-[var(--text-secondary)]">Manage applicants across all your opportunities.</p>
        </div>
      </div>

      <div className="flex border-b border-border">
        <button
          onClick={() => { setActiveTab('JOBS'); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'JOBS' ? 'border-red-500 text-content' : 'border-transparent text-content-secondary hover:text-content'}`}
        >
          Jobs ({jobsData.length})
        </button>
        <button
          onClick={() => { setActiveTab('INTERNSHIPS'); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'INTERNSHIPS' ? 'border-red-500 text-content' : 'border-transparent text-content-secondary hover:text-content'}`}
        >
          Internships ({internshipsData.length})
        </button>
        <button
          onClick={() => { setActiveTab('WORKSHOPS'); }}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'WORKSHOPS' ? 'border-red-500 text-content' : 'border-transparent text-content-secondary hover:text-content'}`}
        >
          Workshops ({registrations.length})
        </button>
      </div>

      <Card className="bg-surface-card border-border">
        {loading ? (
          <div className="p-8 text-center text-content-secondary">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-surface-secondary text-content-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Applied For</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {activeTab === 'JOBS' && jobsData.map(app => (
                  <tr key={app.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-content">{app.name}</div>
                      <div className="text-content-tertiary text-xs">{app.email}</div>
                      <div className="text-content-tertiary text-xs">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-content">{app.job?.title || 'Unknown Job'}</td>
                    <td className="px-6 py-4 text-content-secondary">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status} 
                        onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                        className="bg-surface-tertiary border border-border-strong text-content text-xs rounded px-2 py-1 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="RECEIVED">Received</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <FileText size={14} /> Resume
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
                
                {activeTab === 'INTERNSHIPS' && internshipsData.map(app => (
                  <tr key={app.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-content">{app.name}</div>
                      <div className="text-content-tertiary text-xs">{app.email}</div>
                      <div className="text-content-tertiary text-xs">{app.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-content">{app.internship?.title || 'Unknown Internship'}</td>
                    <td className="px-6 py-4 text-content-secondary">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={app.status} 
                        onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                        className="bg-surface-tertiary border border-border-strong text-content text-xs rounded px-2 py-1 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="RECEIVED">Received</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="INTERVIEWING">Interviewing</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.resumeUrl && (
                        <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                          <FileText size={14} /> Resume
                        </a>
                      )}
                    </td>
                  </tr>
                ))}

                {activeTab === 'WORKSHOPS' && registrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-content">{reg.name}</div>
                      <div className="text-content-tertiary text-xs">{reg.email}</div>
                      <div className="text-content-tertiary text-xs">{reg.phone}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-content">{reg.workshop?.title || 'Unknown Workshop'}</td>
                    <td className="px-6 py-4 text-content-secondary">{new Date(reg.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={reg.status} 
                        onChange={(e) => handleUpdateRegistrationStatus(reg.id, e.target.value)}
                        className="bg-surface-tertiary border border-border-strong text-content text-xs rounded px-2 py-1 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="ATTENDED">Attended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      -
                    </td>
                  </tr>
                ))}

                {/* Empty states */}
                {activeTab === 'JOBS' && jobsData.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-content-tertiary">No job applications found.</td></tr>
                )}
                {activeTab === 'INTERNSHIPS' && internshipsData.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-content-tertiary">No internship applications found.</td></tr>
                )}
                {activeTab === 'WORKSHOPS' && registrations.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-content-tertiary">No workshop registrations found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
