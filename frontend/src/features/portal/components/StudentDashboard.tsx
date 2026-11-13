import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES, buildPath } from '@/routes/routePaths';

export default function StudentDashboard() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEnrollments() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Fetch catalog of workshops first
        const { data: allWorkshops } = await supabase
          .from('Workshop')
          .select('id, title, description, posterUrl');
        const defaultWorkshop = (allWorkshops && allWorkshops.length > 0) ? allWorkshops[0] : null;

        // 2. Fetch user's enrollments (trying user_id, fallback to userId)
        let userEnrollments: any[] = [];
        
        const { data: e1, error: err1 } = await supabase
          .from('Enrollment')
          .select('id, status, course_id, batch_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (!err1 && e1 && e1.length > 0) {
          userEnrollments = e1;
        } else {
          const { data: e2, error: err2 } = await supabase
            .from('Enrollment')
            .select('id, status, course_id, batch_name')
            .eq('userId', user.id);
          if (!err2 && e2 && e2.length > 0) {
            userEnrollments = e2;
          }
        }

        // 3. Fallback to lms_student_details view if direct queries returned nothing
        if (userEnrollments.length === 0 && user.email) {
          try {
            const { data: vData } = await supabase
              .from('lms_student_details')
              .select('*')
              .ilike('student_email', user.email);

            if (vData && vData.length > 0) {
              userEnrollments = vData.map((v: any) => ({
                id: v.enrollment_id,
                course_id: v.workshop_id || v.course_id,
                batch_name: v.batch_name || 'Batch 1',
                status: v.status || 'ACTIVE'
              }));
            }
          } catch {
            // ignore view error
          }
        }

        // 4. If user is tagged as STUDENT or has an unlinked enrollment, ensure default workshop is attached
        const isStudentRole = 
          user.app_metadata?.role === 'STUDENT' || 
          user.app_metadata?.is_student === true ||
          user.user_metadata?.is_student === true ||
          user.user_metadata?.role === 'STUDENT';

        if (userEnrollments.length === 0 && isStudentRole && defaultWorkshop) {
          userEnrollments = [{
            id: 'default-student-enrollment',
            course_id: defaultWorkshop.id,
            batch_name: 'Batch 1',
            status: 'ACTIVE'
          }];
        }

        // 5. Build accessible courses list (deduplicate by course id, keeping most recent batch)
        const seenCourseIds = new Set<string>();
        const activeCourses: any[] = [];

        for (const enr of userEnrollments) {
          const matchedWorkshop = allWorkshops?.find((w: any) => w.id === enr.course_id) || defaultWorkshop || {
            id: enr.course_id || 'default-course',
            title: 'ROS 2 & Robotics Curriculum',
            description: 'Comprehensive curriculum with video recordings and PDF notes.',
            posterUrl: ''
          };

          const cid = enr.course_id || matchedWorkshop.id;
          if (!seenCourseIds.has(cid)) {
            seenCourseIds.add(cid);
            activeCourses.push({
              ...matchedWorkshop,
              course_id: cid,
              batch_name: enr.batch_name || 'Batch 1'
            });
          }
        }

        setCourses(activeCourses);
      } catch (err: any) {
        console.error('Failed to load enrollments:', err);
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
                {course.posterUrl ? (
                  <img src={course.posterUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    📁 {course.batch_name || 'Batch 1'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-2 flex-grow">{course.description}</p>
                
                <Link 
                  to={`${buildPath(ROUTES.PORTAL_COURSE, { id: course.id })}?batch=${encodeURIComponent(course.batch_name || 'Batch 1')}`} 
                  state={{ batch: course.batch_name || 'Batch 1' }}
                  className="w-full py-2.5 bg-[var(--surface-tertiary)] hover:bg-[var(--color-brand)] text-[var(--text-primary)] hover:text-white text-center font-bold rounded-lg transition-colors border border-[var(--border-strong)] hover:border-[var(--color-brand)]"
                >
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
