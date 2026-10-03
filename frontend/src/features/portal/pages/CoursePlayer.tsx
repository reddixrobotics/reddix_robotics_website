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
  
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
    // Disable right click and shortcuts on the entire page
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
    // Fetch Course
    const { data: cData } = await supabase.from('Course').select('*').eq('id', courseId).single();
    if (cData) setCourse(cData);

    // Fetch Modules & Lessons
    const { data: mData } = await supabase.from('Module').select('*, Lesson(*)').eq('course_id', courseId).order('order_index');
    if (mData) {
      setModules(mData);
      if (mData.length > 0) setExpandedModules(new Set([mData[0].id]));
      
      // Auto-select first lesson
      if (mData.length > 0 && mData[0].Lesson && mData[0].Lesson.length > 0) {
        handleLessonSelect(mData[0].Lesson[0]);
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

  const handleLessonSelect = async (lesson: any) => {
    setActiveLesson(lesson);
    setActiveMaterial(null);
    setMaterials([]);

    // Fetch Materials for this lesson
    const { data: matData } = await supabase.from('LearningMaterial').select('*').eq('lesson_id', lesson.id).order('order_index');
    if (matData && matData.length > 0) {
      setMaterials(matData);
      setActiveMaterial(matData[0]); // Auto-select first material (e.g. the Video)
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
          {modules.map((mod, i) => (
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
          ))}
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
                <div className="flex gap-2 border-b border-[var(--border-strong)] pb-2">
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
                  {activeMaterial.material_type === 'VIDEO' ? (
                    <SecureVideoPlayer url={activeMaterial.file_path} title={activeMaterial.title} />
                  ) : (
                    <SecureDocumentViewer url={activeMaterial.file_path} type={activeMaterial.material_type} title={activeMaterial.title} />
                  )}
                </div>
              </>
            ) : (
              <div className="p-12 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface-secondary)] text-[var(--text-muted)] flex flex-col items-center">
                <Lock size={48} className="mb-4 text-[var(--border-strong)]" />
                <p className="font-bold text-lg">No content uploaded yet.</p>
                <p>The instructor has not uploaded videos or notes for this lesson.</p>
              </div>
            )}

            {/* Doubts Section */}
            <DoubtsPanel lessonId={activeLesson.id} />

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)]">
            <BookOpen size={64} className="mb-4 opacity-20" />
            <p className="text-xl font-bold">Select a lesson from the sidebar to begin.</p>
          </div>
        )}
      </div>

    </div>
  );
}
