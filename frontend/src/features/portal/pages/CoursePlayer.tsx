import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { BookOpen, Video, FileText, ChevronLeft, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import SecureVideoPlayer from '../components/SecureVideoPlayer';
import SecureDocumentViewer from '../components/SecureDocumentViewer';
import DoubtsPanel from '../components/DoubtsPanel';

export default function CoursePlayer() {
  const { courseId } = useParams();
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
  }, [courseId]);

  async function fetchCourseData() {
    setLoading(true);

    // 1. Fetch Student's Enrollment to identify their assigned batch
    let currentBatch = 'Batch 1';
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: enrollment } = await supabase
        .from('Enrollment')
        .select('batch_name')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .in('status', ['ACTIVE', 'active'])
        .maybeSingle();

      if (enrollment?.batch_name) {
        currentBatch = enrollment.batch_name.trim();
        setStudentBatch(currentBatch);
      }
    }

    // 2. Fetch Course Information
    const { data: cData } = await supabase.from('Workshop').select('*').eq('id', courseId).single();
    if (cData) setCourse(cData);

    // 3. Fetch Modules & Lessons
    const { data: mData } = await supabase
      .from('Module')
      .select('*, Lesson(*)')
      .eq('course_id', courseId)
      .order('order_index');

    if (mData) {
      const studentBatchNorm = currentBatch.trim().toLowerCase();
      // STRICT BATCH ISOLATION:
      // Only include modules whose batch_name matches the student's assigned batch.
      // Other batch modules and recordings are completely hidden and unopenable.
      const filteredModules = mData.filter((m: any) => {
        const mBatch = (m.batch_name || '').trim().toLowerCase();
        return mBatch === studentBatchNorm;
      });

      setModules(filteredModules);

      if (filteredModules.length > 0) {
        setExpandedModules(new Set([filteredModules[0].id]));
        // Auto-select first lesson if available in this student's batch
        if (filteredModules[0].Lesson && filteredModules[0].Lesson.length > 0) {
          handleLessonSelect(filteredModules[0].Lesson[0], currentBatch, filteredModules);
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

  const handleLessonSelect = async (lesson: any, batchOverride?: string, allowedModules?: any[]) => {
    const validModules = allowedModules || modules;
    // Security check: verify this lesson belongs to an authorized module for this student's batch
    const belongsToBatch = validModules.some((m: any) => m.id === lesson.module_id);
    if (!belongsToBatch && validModules.length > 0) {
      console.warn("Access denied: Lesson does not belong to student's assigned batch");
      return;
    }

    setActiveLesson(lesson);
    setActiveMaterial(null);
    setMaterials([]);

    const targetBatch = (batchOverride || studentBatch).trim().toLowerCase();

    // Fetch Materials for this lesson
    const { data: matData } = await supabase
      .from('LearningMaterial')
      .select('*')
      .eq('lesson_id', lesson.id)
      .order('order_index');

    if (matData && matData.length > 0) {
      // STRICT RECORDING ISOLATION:
      // Only show materials uploaded specifically for this student's batch.
      // Do not show or open any other batch's recordings.
      const accessibleMaterials = matData.filter((mat: any) => {
        const matBatch = (mat.batch_name || '').trim().toLowerCase();
        return matBatch === targetBatch;
      });

      // Enforce specific order: Video -> PPT -> PDF regardless of database order
      const getRank = (mat: any) => {
        const str = (mat.title + ' ' + mat.material_type).toLowerCase();
        if (str.includes('video')) return 1;
        if (str.includes('ppt')) return 2;
        if (str.includes('pdf')) return 3;
        return 4;
      };
      
      accessibleMaterials.sort((a, b) => getRank(a) - getRank(b));

      setMaterials(accessibleMaterials);
      if (accessibleMaterials.length > 0) {
        setActiveMaterial(accessibleMaterials[0]); // Auto-select first material
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-[var(--text-secondary)]">Loading secure portal...</div>;
  if (!course) return <div className="p-12 text-center text-red-500">Course not found or unauthorized.</div>;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[var(--bg-primary)] overflow-hidden select-none">
      
      {/* Sidebar: Modules & Lessons */}
      <div className="w-80 border-r border-[var(--border-strong)] bg-[var(--surface-secondary)] flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-[var(--border-strong)]">
          <Link to="/portal" className="text-sm font-bold text-[var(--color-brand)] flex items-center gap-2 hover:underline mb-4">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h2 className="font-black text-xl text-[var(--text-primary)] leading-tight">{course.title}</h2>
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
                <p>Recordings and class notes will appear here once uploaded by your instructor.</p>
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
