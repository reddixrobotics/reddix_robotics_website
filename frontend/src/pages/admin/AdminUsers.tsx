import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';
import { Button } from '@/components/ui';
import { Plus, Trash2, Shield, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsers() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [formError, setFormError] = useState('');
  
  const { userRole } = useAuth();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await apiClient.get('/api/admin/admins');
      setAdmins(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      await apiClient.post('/api/admin/admins', { email, password, role });
      setIsAdding(false);
      setEmail('');
      setPassword('');
      setRole('ADMIN');
      fetchAdmins();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add admin');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      await apiClient.delete(`/api/admin/admins/${id}`);
      fetchAdmins();
    } catch (err: any) {
      alert(err.message || 'Failed to delete admin');
    }
  };

  if (userRole !== 'SUPER_ADMIN') {
    return (
      <div className="p-8 text-center text-[var(--text-secondary)]">
        <Shield size={48} className="mx-auto mb-4 opacity-50" />
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>Only Super Admins can access this page.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">Admin Users</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage dashboard access and roles for your team.
          </p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
          {isAdding ? 'Cancel' : <><Plus size={16} /> Add Admin</>}
        </Button>
      </div>

      {isAdding && (
        <div className="p-6 border border-[var(--border-strong)] rounded-xl bg-[var(--bg-secondary)]">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Add New Admin</h2>
          <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Temporary Password</label>
              <input 
                type="text" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                minLength={8}
                placeholder="Must be at least 8 chars"
                className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select 
                value={role} 
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-[var(--border-strong)] rounded-lg bg-[var(--bg-primary)]"
              >
                <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
                <option value="ADMIN">Admin (Standard Access)</option>
                <option value="CONTENT_MANAGER">Content Manager</option>
              </select>
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <Button type="submit">Create Account</Button>
          </form>
        </div>
      )}

      {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">{error}</div>}

      {loading ? (
        <div className="py-10 text-center">Loading admins...</div>
      ) : (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-primary)] border-b border-[var(--border-strong)]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[var(--text-secondary)]">User</th>
                <th className="px-6 py-4 font-semibold text-[var(--text-secondary)]">Role</th>
                <th className="px-6 py-4 font-semibold text-[var(--text-secondary)]">2FA Status</th>
                <th className="px-6 py-4 text-right font-semibold text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-strong)]">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-brand)]/20 text-[var(--color-brand)] flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{admin.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium bg-[var(--bg-tertiary)] rounded-full">
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {admin.twoFactorEnabled ? (
                      <span className="text-emerald-500 font-medium text-xs">Enabled</span>
                    ) : (
                      <span className="text-yellow-500 font-medium text-xs">Pending Setup</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
