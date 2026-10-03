import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, BookOpen, List } from 'lucide-react';

export default function AdminLMS() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let pass = "Rx-";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass + "!";
  };

  useEffect(() => {
    fetchData();
    setPassword(generatePassword());
  }, []);

  async function fetchData() {
    const { data: cData } = await supabase.from('Course').select('*');
    if (cData) setCourses(cData);

    // Fetch from the secure view we will ask the admin to create
    const { data: eData } = await supabase.from('lms_student_details').select('*').order('enrolled_at', { ascending: false });
    if (eData) setEnrollments(eData);
  }

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
        body: JSON.stringify({ email, password, courseId: selectedCourse || null })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create student');

      setStatus(`Success! Student account created for ${email}`);
      setEmail('');
      setPassword(generatePassword());
      setSelectedCourse('');
      fetchData(); // Refresh table
    } catch (err: any) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-black text-[var(--text-primary)]">LMS Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Provisioning Form */}
        <div className="lg:col-span-1 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <UserPlus className="text-[var(--color-brand)]" />
            Provision New Student
          </h2>
          
          <form onSubmit={handleProvision} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Student Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Temporary Password</label>
              <input type="text" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Assign Course (Optional)</label>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none">
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

        {/* Right Column: Enrolled Students */}
        <div className="lg:col-span-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <List className="text-[var(--color-brand)]" />
            Enrolled Students
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-strong)] text-[var(--text-muted)] text-sm uppercase tracking-wider">
                  <th className="p-3 font-semibold">Student Email</th>
                  <th className="p-3 font-semibold">Course Enrolled</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Enrolled At</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">
                      No students enrolled yet. Provision a student to see them here! (If you just enrolled someone, make sure you ran the SQL View script).
                    </td>
                  </tr>
                ) : (
                  enrollments.map(e => (
                    <tr key={e.enrollment_id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]/50 transition-colors">
                      <td className="p-3 text-[var(--text-primary)] font-medium">{e.student_email}</td>
                      <td className="p-3 text-[var(--text-secondary)]">{e.course_title}</td>
                      <td className="p-3">
                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded-full text-xs font-bold">
                          {e.status}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--text-muted)] text-sm">
                        {new Date(e.enrolled_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
