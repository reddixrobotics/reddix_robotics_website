import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, BookOpen } from 'lucide-react';

export default function AdminLMS() {
  const [courses, setCourses] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      const { data } = await supabase.from('Course').select('*');
      if (data) setCourses(data);
    }
    fetchCourses();
  }, []);

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active admin session");

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/provision-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          email,
          password,
          courseId: selectedCourse || null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create student');

      setStatus(`Success! Student account created for ${email}`);
      setEmail('');
      setPassword('');
      setSelectedCourse('');
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-black text-white mb-8">LMS Management</h1>
      
      <div className="bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <UserPlus className="text-[var(--color-brand)]" />
          Provision New Student
        </h2>
        
        <form onSubmit={handleProvision} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Student Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-white focus:border-[var(--color-brand)] outline-none" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Temporary Password</label>
            <input type="text" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-white focus:border-[var(--color-brand)] outline-none" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Assign Course (Optional)</label>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-white focus:border-[var(--color-brand)] outline-none">
              <option value="">-- Do not assign yet --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50">
            {loading ? 'Provisioning...' : 'Create Account & Enroll'}
          </button>

          {status && (
            <div className={`p-4 mt-4 rounded-lg text-sm ${status.includes('Error') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
