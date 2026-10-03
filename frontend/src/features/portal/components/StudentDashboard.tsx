import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, buildPath } from '@/routes/routePaths';

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEnrollments() {
      try {
        // Because of RLS, this will only return enrollments for the logged in user
        const { data: enrollments, error } = await supabase
          .from('Enrollment')
          .select(`
            id,
            status,
            course_id,
            Workshop (
              id,
              title,
              description,
              posterUrl
            )
          `)
          .eq('status', 'ACTIVE');
          
        if (error) throw error;
        
        // Map the relation array correctly based on Supabase return format
        console.log("Raw Enrollments from DB:", enrollments);
        const enrolledCourses = enrollments?.filter((e: any) => e.Workshop).map((e: any) => ({ ...e.Workshop, course_id: e.course_id })) || [];
        setCourses(enrolledCourses);
      } catch (err) {
        console.error('Failed to load enrollments:', err);
        alert('Error loading enrollments: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
    loadEnrollments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black text-[var(--text-primary)] tracking-tight">Welcome Back</h1>
        <p className="text-[var(--text-secondary)] mt-2 text-lg">Pick up where you left off and continue your robotics journey.</p>
      </div>

      <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] border-b border-[var(--border-primary)] pb-2">My Active Courses</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-[var(--surface-secondary)] animate-pulse border border-[var(--border-primary)]"></div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border-primary)]">
          <div className="w-16 h-16 bg-[var(--surface-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <PlayCircle size={32} className="text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No active enrollments found</h3>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">You aren't currently enrolled in any active courses. Check out our upcoming workshops to get started!</p>
          <Link to={ROUTES.HOME} className="px-6 py-3 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-red-700 transition-colors inline-block">
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="group rounded-2xl overflow-hidden bg-[var(--surface-secondary)] border border-[var(--border-primary)] hover:border-[var(--color-brand)] transition-all shadow-lg flex flex-col h-full">
              <div className="aspect-video bg-[var(--bg-tertiary)] relative overflow-hidden">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                    <PlayCircle size={48} className="text-zinc-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <PlayCircle size={64} className="text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-2 flex-grow">{course.description}</p>
                
                <Link to={buildPath(ROUTES.PORTAL_COURSE, { id: course.id })} className="w-full py-2.5 bg-[var(--surface-tertiary)] hover:bg-[var(--color-brand)] text-[var(--text-primary)] hover:text-white text-center font-bold rounded-lg transition-colors border border-[var(--border-strong)] hover:border-[var(--color-brand)]">
                  Continue Learning
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
