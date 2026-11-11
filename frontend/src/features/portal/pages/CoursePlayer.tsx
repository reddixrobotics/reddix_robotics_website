import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BookOpen, Video, FileText, ChevronLeft, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import SecureVideoPlayer from '../components/SecureVideoPlayer';
import SecureDocumentViewer from '../components/SecureDocumentViewer';
import DoubtsPanel from '../components/DoubtsPanel';

export default function CoursePlayer() {
  const params = useParams();
  const activeCourseId = params.courseId || params.id;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [studentBatch, setStudentBatch] = useState<string>('Batch 1');
  
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
    // Disable right click and keyboard shortcuts on the secure player
    const handleContextMenu = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'c', 'x'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCourseId]);

  async function fetchCourseData() {
    setLoading(true);

    // 1. Fetch Student's Enrollment to identify their assigned batch
    let currentBatch = 'Batch 1';
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      let resolvedBatch = '';
      const userEmail = (user.email || '').trim().toLowerCase();

      // Priority 1: Call SECURITY DEFINER RPC get_lms_student_details (bypasses RLS)
      try {
        const { data: rpcData } = await supabase.rpc('get_lms_student_details');
        if (rpcData && rpcData.length > 0) {
          const studentEntry = rpcData.find((r: any) => 
            (r.student_email || '').trim().toLowerCase() === userEmail
          );
          if (studentEntry?.batch_name) {
            resolvedBatch = studentEntry.batch_name.trim();
          }
        }
      } catch (err) {
        console.error('RPC get_lms_student_details error:', err);
      }

      // Priority 2: Direct user_id enrollment lookup
      if (!resolvedBatch) {
        try {
          const { data: enrs1 } = await supabase
            .from('Enrollment')
            .select('batch_name, course_id, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (enrs1 && enrs1.length > 0) {
            const match = activeCourseId 
              ? enrs1.find((e: any) => e.course_id === activeCourseId && e.batch_name)
              : null;
            const chosen = match || enrs1.find((e: any) => e.batch_name) || enrs1[0];
            if (chosen?.batch_name) resolvedBatch = chosen.batch_name.trim();
          }
        } catch {
          // ignore
        }
      }

      // Priority 3: Try camelCase userId fallback
      if (!resolvedBatch) {
        try {
          const { data: enrs2 } = await supabase
            .from('Enrollment')
            .select('batch_name, course_id')
            .eq('userId', user.id);

          if (enrs2 && enrs2.length > 0) {
            const match = activeCourseId 
              ? enrs2.find((e: any) => e.course_id === activeCourseId && e.batch_name)
              : null;
            const chosen = match || enrs2.find((e: any) => e.batch_name) || enrs2[0];
            if (chosen?.batch_name) resolvedBatch = chosen.batch_name.trim();
          }
        } catch {
          // ignore
        }
      }

      // Priority 4: Metadata fallback
      if (!resolvedBatch) {
        const metaBatch = user.user_metadata?.batch_name || user.app_metadata?.batch_name;
        if (metaBatch) resolvedBatch = String(metaBatch).trim();
      }

      if (resolvedBatch) {
        currentBatch = resolvedBatch;
      }
      setStudentBatch(currentBatch);
    }

    // 2. Fetch Course Information
    if (activeCourseId) {
      const { data: cData } = await supabase.from('Workshop').select('*').eq('id', activeCourseId).maybeSingle();
      if (cData) setCourse(cData);
    }

    // If no course loaded yet, grab default workshop
    if (!course) {
      const { data: fallbackWorkshops } = await supabase.from('Workshop').select('*').limit(1);
      if (fallbackWorkshops && fallbackWorkshops.length > 0) {
        setCourse(fallbackWorkshops[0]);
      }
    }

    // 3. Fetch Modules & Lessons with embedded LearningMaterials
    const studentBatchNorm = currentBatch.trim().toLowerCase();
    let mData: any[] | null = null;

    if (activeCourseId) {
      const { data } = await supabase
        .from('Module')
        .select('*, Lesson(*, LearningMaterial(*))')
        .eq('course_id', activeCourseId)
        .order('order_index');
      if (data && data.length > 0) {
        mData = data;
      }
    }

    // Also fetch general/all modules
    const { data: generalModules } = await supabase
      .from('Module')
      .select('*, Lesson(*, LearningMaterial(*))')
      .order('order_index');

    if (generalModules && generalModules.length > 0) {
      if (!mData || mData.length === 0) {
        mData = generalModules;
      } else {
        // If current course mData does not have modules for this student's batch, but generalModules does:
        const hasBatchInCourse = mData.some((m: any) => (m.batch_name || '').trim().toLowerCase() === studentBatchNorm);
        const hasBatchInGeneral = generalModules.some((m: any) => (m.batch_name || '').trim().toLowerCase() === studentBatchNorm);
        if (!hasBatchInCourse && hasBatchInGeneral) {
          const batchSpecific = generalModules.filter((m: any) => (m.batch_name || '').trim().toLowerCase() === studentBatchNorm);
          mData = [...batchSpecific, ...mData];
        }
      }
    }

    if (mData) {
      const isBatch1 = studentBatchNorm === 'batch 1';

      // Check if there are modules specifically created/tagged for this student's batch
      const hasBatchSpecificModules = mData.some((m: any) => {
        const b = (m.batch_name || '').trim().toLowerCase();
        return b === studentBatchNorm;
      });

      // Filter modules:
      // If batch-specific modules exist for this batch (e.g. Batch 2), strictly show those (+ ALL).
      // Otherwise, show standard course curriculum modules (Batch 1 / ALL) so curriculum structure is visible.
      const filteredModules = mData.filter((m: any) => {
        const mBatch = (m.batch_name || '').trim().toLowerCase();
        if (hasBatchSpecificModules) {
          return mBatch === studentBatchNorm || mBatch === 'all';
        }
        return !mBatch || mBatch === 'all' || mBatch === 'batch 1' || mBatch === studentBatchNorm;
      });

      // Sort lessons in each module
      const sortedModules = filteredModules.map((m: any) => ({
        ...m,
        Lesson: (m.Lesson || []).sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      }));

      setModules(sortedModules);

      if (sortedModules.length > 0) {
        setExpandedModules(new Set([sortedModules[0].id]));
        // Auto-select first lesson if available in this student's batch
        if (sortedModules[0].Lesson && sortedModules[0].Lesson.length > 0) {
          handleLessonSelect(sortedModules[0].Lesson[0], currentBatch);
        } else {
          setActiveLesson(null);
          setMaterials([]);
          setActiveMaterial(null);
        }
      } else {
        setExpandedModules(new Set());
        setActiveLesson(null);
        setMaterials([]);
        setActiveMaterial(null);
      }
    }
    setLoading(false);
  }

  const toggleModule = (modId: string) => {
    const newSet = new Set(expandedModules);
    if (newSet.has(modId)) newSet.delete(modId);
    else newSet.add(modId);
    setExpandedModules(newSet);
  };

  const handleLessonSelect = async (lesson: any, batchOverride?: string) => {
    setActiveLesson(lesson);
    setActiveMaterial(null);
    setMaterials([]);

    const activeBatch = (batchOverride || studentBatch).trim().toLowerCase();
    const isBatch1 = activeBatch === 'batch 1';

    // Materials can come directly from the embedded query or fallback query
    let rawMaterials = lesson.LearningMaterial || [];
    if (!rawMaterials || rawMaterials.length === 0) {
      const { data: dbMats } = await supabase
        .from('LearningMaterial')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('order_index');
      if (dbMats) rawMaterials = dbMats;
    }

    // Filter materials according to student's batch:
    // STRICT BATCH ISOLATION:
    // - Batch 2 students ONLY see materials tagged for Batch 2 or ALL (Common).
    //   They MUST NEVER see Batch 1 recordings or Batch 1 PDFs!
    // - Batch 1 students ONLY see materials tagged for Batch 1 or ALL (Common).
    //   They MUST NEVER see Batch 2 recordings or Batch 2 PDFs!
    const accessibleMaterials = rawMaterials.filter((mat: any) => {
      const matBatch = (mat.batch_name || '').trim().toLowerCase();

      // 1. Common / Shared materials (tagged 'ALL' or 'Common') are visible across all batches
      if (matBatch === 'all' || matBatch === 'common') {
        return true;
      }

      // 2. If student is in Batch 1:
      if (isBatch1) {
        return matBatch === 'batch 1' || matBatch === '' || !mat.batch_name;
      }

      // 3. If student is in Batch 2 or any other batch cohort:
      // Strictly match their assigned batch! Batch 1 materials are NEVER shown.
      return matBatch === activeBatch;
    });

    // Enforce display order: Video -> PPT -> PDF
    const getRank = (mat: any) => {
      const str = ((mat.title || '') + ' ' + (mat.material_type || '')).toLowerCase();
      if (str.includes('video') || mat.material_type === 'VIDEO') return 1;
      if (str.includes('ppt') || mat.material_type === 'PPT') return 2;
      if (str.includes('pdf') || mat.material_type === 'PDF') return 3;
      return 4;
    };
    
    accessibleMaterials.sort((a: any, b: any) => getRank(a) - getRank(b));

    setMaterials(accessibleMaterials);
    if (accessibleMaterials.length > 0) {
      setActiveMaterial(accessibleMaterials[0]); // Auto-display first material
    }
  };

  if (loading) return <div className="p-12 text-center text-[var(--text-secondary)]">Loading secure portal...</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[var(--bg-primary)] overflow-hidden select-none">
      
      {/* Sidebar: Modules & Lessons */}
      <div className="w-80 border-r border-[var(--border-strong)] bg-[var(--surface-secondary)] flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-[var(--border-strong)]">
          <Link to="/portal" className="text-sm font-bold text-[var(--color-brand)] flex items-center gap-2 hover:underline mb-4">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h2 className="font-black text-xl text-[var(--text-primary)] leading-tight">
            {course?.title || 'Robotics & ROS 2 Curriculum'}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {modules.length === 0 ? (
            <div className="p-6 text-center text-[var(--text-secondary)]">
              <BookOpen size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-[var(--text-primary)]">No content released yet</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Your class recordings and materials will appear here once published by your instructor.
              </p>
            </div>
          ) : (
            modules.map((mod, i) => (
              <div key={mod.id} className="border-b border-[var(--border-primary)]">
                <button 
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-4 flex justify-between items-center bg-[var(--bg-primary)] hover:bg-[var(--surface-hover)] transition-colors text-left"
                >
                  <span className="font-bold text-sm text-[var(--text-primary)]">
                    Module {i + 1}: {mod.title}
                  </span>
                  {expandedModules.has(mod.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                
                {expandedModules.has(mod.id) && (
                  <div className="bg-[var(--surface-secondary)]">
                    {mod.Lesson?.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonSelect(lesson)}
                        className={`w-full text-left p-3 pl-8 flex items-center gap-3 transition-colors ${
                          activeLesson?.id === lesson.id 
                            ? 'bg-[var(--color-brand)]/10 border-l-4 border-[var(--color-brand)]' 
                            : 'border-l-4 border-transparent hover:bg-[var(--bg-primary)]'
                        }`}
                      >
                        <Video size={16} className={activeLesson?.id === lesson.id ? 'text-[var(--color-brand)]' : 'text-[var(--text-muted)]'} />
                        <span className={`text-sm ${activeLesson?.id === lesson.id ? 'font-bold text-[var(--color-brand)]' : 'text-[var(--text-secondary)]'}`}>
                          {lesson.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Stage */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        {activeLesson ? (
          <div className="max-w-5xl mx-auto space-y-8">
            
            <h1 className="text-3xl font-black text-[var(--text-primary)]">{activeLesson.title}</h1>

            {/* Material Tabs */}
            {materials.length > 0 ? (
              <>
                <div className="flex gap-2 border-b border-[var(--border-strong)] pb-2 flex-wrap">
                  {materials.map(mat => (
                    <button
                      key={mat.id}
                      onClick={() => setActiveMaterial(mat)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${
                        activeMaterial?.id === mat.id 
                          ? 'bg-[var(--color-brand)] text-white' 
                          : 'bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-strong)]'
                      }`}
                    >
                      {mat.material_type === 'VIDEO' ? <Video size={16} /> : <FileText size={16} />}
                      {mat.title}
                    </button>
                  ))}
                </div>

                {/* Secure Material Viewer */}
                <div className="mt-4">
                  {activeMaterial && (
                    activeMaterial.material_type === 'VIDEO' ? (
                      <SecureVideoPlayer url={activeMaterial.file_path} title={activeMaterial.title} />
                    ) : (
                      <SecureDocumentViewer url={activeMaterial.file_path} type={activeMaterial.material_type} title={activeMaterial.title} />
                    )
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface-secondary)] text-[var(--text-muted)] flex flex-col items-center">
                <Lock size={48} className="mb-4 text-[var(--border-strong)]" />
                <p className="font-bold text-lg">No content released yet for this lesson.</p>
                <p className="text-sm mt-1">Recordings and class notes for your cohort will appear here once uploaded by your instructor.</p>
              </div>
            )}

            {/* Doubts Section */}
            <DoubtsPanel lessonId={activeLesson.id} />

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[var(--text-secondary)]">
            <BookOpen size={64} className="mb-4 opacity-20 text-[var(--color-brand)]" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Select a lesson to begin</h3>
            <p className="text-sm max-w-sm mt-2 text-[var(--text-secondary)]">
              Choose a module and lesson from the left sidebar to access your class recordings and materials.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
