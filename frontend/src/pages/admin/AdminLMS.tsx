import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, BookOpen, List, Trash2, Filter, Layers } from 'lucide-react';

export default function AdminLMS() {
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [batchName, setBatchName] = useState('Batch 2');
  const [selectedBatchFilter, setSelectedBatchFilter] = useState('ALL');
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
    try {
      const { data: cData } = await supabase.from('Workshop').select('*');
      if (cData) setCourses(cData);

      const { data: eData, error: rpcError } = await supabase.rpc('get_lms_student_details');
      if (!rpcError && eData && eData.length > 0) {
        setEnrollments(eData);
        return;
      }

      // Fallback 1: View
      const { data: vData, error: vError } = await supabase.from('lms_student_details').select('*');
      if (!vError && vData && vData.length > 0) {
        setEnrollments(vData);
        return;
      }

      // Fallback 2: Direct query on Enrollment
      const { data: dirData } = await supabase
        .from('Enrollment')
        .select('id, user_id, status, batch_name, created_at, course_id, Workshop(title)')
        .order('created_at', { ascending: false });

      if (dirData && dirData.length > 0) {
        setEnrollments(dirData.map((d: any) => ({
          enrollment_id: d.id,
          student_email: 'Student (' + (d.user_id?.slice(0, 8) || 'User') + ')',
          course_title: d.Workshop?.title || 'General Course (Unassigned)',
          batch_name: d.batch_name || 'Batch 1',
          status: d.status || 'ACTIVE',
          enrolled_at: d.created_at
        })));
      } else {
        setEnrollments([]);
      }
    } catch (err) {
      console.error('Failed to fetch LMS data:', err);
    }
  }

  // Extract distinct batches for filter
  const distinctBatches = useMemo(() => {
    const batches = new Set<string>(['Batch 1', 'Batch 2', 'Batch 3']);
    enrollments.forEach(e => {
      if (e.batch_name) batches.add(e.batch_name);
    });
    return Array.from(batches).sort();
  }, [enrollments]);

  // Filter enrollments by selected batch
  const filteredEnrollments = useMemo(() => {
    if (selectedBatchFilter === 'ALL') return enrollments;
    return enrollments.filter(e => (e.batch_name || 'Batch 1') === selectedBatchFilter);
  }, [enrollments, selectedBatchFilter]);

  const handleRemoveEnrollment = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this enrollment?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('Enrollment').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      setStatus('Enrollment removed successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus(`Failed to remove: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
          courseId: selectedCourse || null,
          batchName: batchName.trim() || 'Batch 1'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create student');

      setStatus(`Provisioned for ${batchName}! Sending welcome email to ${email}...`);

      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
          body: JSON.stringify({
            to: email,
            subject: 'Welcome to the Reddix Robotics Learning Portal!',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #b91c1c;">Welcome to Reddix Robotics!</h2>
                <p>Your student portal account has been created successfully for <strong>${batchName}</strong>.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Login URL:</strong> <a href="https://reddixrobotics.com/login">reddixrobotics.com/login</a></p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Password:</strong> ${password}</p>
                  <p><strong>Assigned Batch:</strong> ${batchName}</p>
                </div>
                <p>Please log in using the credentials above to access your assigned course and recordings.</p>
                <p>Best regards,<br/>The Reddix Robotics Team</p>
              </div>
            `
          })
        });
        setStatus(`Success! Account created for ${batchName} and email sent to ${email}`);
      } catch (mailErr) {
        setStatus(`Success, but failed to send email. Provide credentials manually: ${password} (${batchName})`);
      }

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">LMS Batch & Student Management</h1>
          <p className="text-[var(--text-secondary)]">Provision students into specific batches and manage course access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Provisioning Form */}
        <div className="lg:col-span-1 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <UserPlus className="text-[var(--color-brand)]" />
            Provision Student into Batch
          </h2>

          <form onSubmit={handleProvision} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Student Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Temporary Password</label>
              <div className="flex gap-2">
                <input type="text" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" />
                <button type="button" onClick={() => setPassword(generatePassword())} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-lg hover:bg-[var(--surface-hover)] text-sm font-medium transition-colors" title="Generate New Password">
                  Regenerate
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Assign Workshop / Course</label>
              <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none">
                <option value="">-- Do not assign yet --</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Batch Name</label>
              <div className="space-y-2">
                <input 
                  type="text" 
                  required 
                  value={batchName} 
                  onChange={e => setBatchName(e.target.value)} 
                  placeholder="e.g. Batch 1, Batch 2, Nov 2026"
                  className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none font-medium" 
                />
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="text-[var(--text-muted)] self-center">Quick pick:</span>
                  {['Batch 1', 'Batch 2', 'Batch 3'].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBatchName(b)}
                      className={`px-2.5 py-1 rounded-md border text-xs transition-colors ${batchName === b ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]' : 'border-[var(--border-strong)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 mt-4 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors">
              {loading ? 'Provisioning...' : 'Create Account & Assign Batch'}
            </button>

            {status && (
              <div className={`p-4 mt-4 rounded-lg text-sm ${status.includes('Error') || status.includes('Failed') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                {status}
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Enrolled Students */}
        <div className="lg:col-span-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <List className="text-[var(--color-brand)]" />
              Enrolled Students ({filteredEnrollments.length})
            </h2>

            {/* Batch Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full pb-1 flex-nowrap">
              <span className="text-xs font-semibold text-[var(--text-muted)] flex items-center gap-1">
                <Filter size={12} /> Filter Batch:
              </span>
              <button
                onClick={() => setSelectedBatchFilter('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${selectedBatchFilter === 'ALL' ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-strong)]'}`}
              >
                All Batches
              </button>
              {distinctBatches.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBatchFilter(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${selectedBatchFilter === b ? 'bg-[var(--color-brand)] text-white' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-strong)]'}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-strong)] text-[var(--text-muted)] text-xs uppercase tracking-wider">
                  <th className="p-3 font-semibold">Student Email</th>
                  <th className="p-3 font-semibold">Course Enrolled</th>
                  <th className="p-3 font-semibold">Batch</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Enrolled At</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[var(--text-muted)]">
                      No students found for this batch filter.
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map(e => (
                    <tr key={e.enrollment_id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-primary)]/50 transition-colors">
                      <td className="p-3 text-[var(--text-primary)] font-medium">{e.student_email}</td>
                      <td className="p-3 text-[var(--text-secondary)] text-sm">{e.course_title}</td>
                      <td className="p-3">
                        <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md text-xs font-bold inline-flex items-center gap-1">
                          <Layers size={11} />
                          {e.batch_name || 'Batch 1'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full text-xs font-bold">
                          {e.status}
                        </span>
                      </td>
                      <td className="p-3 text-[var(--text-muted)] text-xs">
                        {new Date(e.enrolled_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleRemoveEnrollment(e.enrollment_id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                          title="Remove Enrollment"
                        >
                          <Trash2 size={16} />
                        </button>
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
