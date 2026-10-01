import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { User, Mail, Phone, Calendar } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase
        .from('User')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)]">Customers / Users</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            View all registered customer accounts.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--bg-tertiary)] border-b border-[var(--border-strong)]">
              <tr>
                <th className="px-4 py-3 font-medium text-[var(--text-secondary)]">Name</th>
                <th className="px-4 py-3 font-medium text-[var(--text-secondary)]">Email</th>
                <th className="px-4 py-3 font-medium text-[var(--text-secondary)]">Phone</th>
                <th className="px-4 py-3 font-medium text-[var(--text-secondary)]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-strong)]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-tertiary)]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-primary)]">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">
                            {u.firstName} {u.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Mail size={14} />
                        {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Phone size={14} />
                        {u.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Calendar size={14} />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
