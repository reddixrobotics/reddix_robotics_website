import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/features/admin/services/apiService';
import { Plus, Video, FileText, ChevronDown, ChevronRight, Upload, Trash2, Edit2, Layers } from 'lucide-react';

export default function AdminCourseBuilder() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Forms State
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonData, setNewLessonData] = useState({ moduleId: '', title: '' });
  const [newMaterialData, setNewMaterialData] = useState({
    lessonId: '',
    title: '',
    type: 'VIDEO_YOUTUBE',
    batchName: 'ALL',
    file: null as File | null | string,
    isUploading: false
  });

  const [editingModule, setEditingModule] = useState<{ id: string, title: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ id: string, title: string } | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<{ id: string, title: string, batchName?: string } | null>(null);

  async function handleUpdate(table: string, id: string, title: string, batchName?: string) {
    if (!title.trim()) return;
    const updatePayload: any = { title };
    if (table === 'LearningMaterial' && batchName !== undefined) {
      updatePayload.batch_name = batchName || 'ALL';
    }
    await supabase.from(table).update(updatePayload).eq('id', id);
    if (table === 'Module') setEditingModule(null);
    if (table === 'Lesson') setEditingLesson(null);
    if (table === 'LearningMaterial') setEditingMaterial(null);
    fetchModules();
  }

  useEffect(() => {
    fetchWorkshops();
  }, []);

  useEffect(() => {
    if (selectedWorkshop) fetchModules();
    else setModules([]);
  }, [selectedWorkshop]);

  async function fetchWorkshops() {
    const { data } = await supabase.from('Workshop').select('id, title');
    if (data) setWorkshops(data);
  }

  async function fetchModules() {
    setLoading(true);
    const { data } = await supabase
      .from('Module')
      .select('*, Lesson(*, LearningMaterial(*))')
      .eq('course_id', selectedWorkshop)
      .order('order_index');
      
    if (data) {
      // Sort nested items
      const sorted = data.map(m => ({
        ...m,
        Lesson: m.Lesson?.sort((a: any, b: any) => a.order_index - b.order_index).map((l: any) => ({
          ...l,
          LearningMaterial: l.LearningMaterial?.sort((a: any, b: any) => a.order_index - b.order_index) || []
        })) || []
      }));
      setModules(sorted);
    }
    setLoading(false);
  }

  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    if (!newModuleTitle) return;
    const { error } = await supabase.from('Module').insert({
      course_id: selectedWorkshop,
      title: newModuleTitle,
      order_index: modules.length
    });
    if (!error) {
      setNewModuleTitle('');
      fetchModules();
    }
  }

  async function handleAddLesson(e: React.FormEvent, moduleId: string, currentLength: number) {
    e.preventDefault();
    if (!newLessonData.title || newLessonData.moduleId !== moduleId) return;
    const { error } = await supabase.from('Lesson').insert({
      module_id: moduleId,
      title: newLessonData.title,
      order_index: currentLength
    });
    if (!error) {
      setNewLessonData({ moduleId: '', title: '' });
      fetchModules();
    }
  }

  async function handleAddMaterial(e: React.FormEvent, lessonId: string, currentLength: number) {
    e.preventDefault();
    if (!newMaterialData.title || !newMaterialData.file || newMaterialData.lessonId !== lessonId) return;
    
    setNewMaterialData(prev => ({ ...prev, isUploading: true }));
    try {
      const publicUrl = newMaterialData.type === 'VIDEO_YOUTUBE' ? (newMaterialData.file as any) : await uploadFile(newMaterialData.file as File);
      const finalType = newMaterialData.type === 'VIDEO_YOUTUBE' ? 'VIDEO' : newMaterialData.type;
      
      const { error } = await supabase.from('LearningMaterial').insert({
        lesson_id: lessonId,
        title: newMaterialData.title,
        material_type: finalType,
        batch_name: newMaterialData.batchName?.trim() || 'ALL',
        file_path: publicUrl,
        order_index: currentLength
      });
      
      if (!error) {
        setNewMaterialData({
          lessonId: '',
          title: '',
          type: 'VIDEO_YOUTUBE',
          batchName: 'ALL',
          file: null,
          isUploading: false
        });
        fetchModules();
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Try again.');
      setNewMaterialData(prev => ({ ...prev, isUploading: false }));
    }
  }

  async function handleDelete(table: string, id: string) {
    if (!confirm('Are you sure you want to delete this?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchModules();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Course Content Builder</h1>
          <p className="text-[var(--text-secondary)]">Upload modules, lessons, and batch-wise recordings.</p>
        </div>
      </div>

      <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6">
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Select Workshop to Edit</label>
        <select 
          value={selectedWorkshop} 
          onChange={e => setSelectedWorkshop(e.target.value)}
          className="w-full p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none font-bold"
        >
          <option value="">-- Choose a Workshop --</option>
          {workshops.map(w => (
            <option key={w.id} value={w.id}>{w.title}</option>
          ))}
        </select>
      </div>

      {selectedWorkshop && (
        <div className="space-y-6">
          {/* Module List */}
          {loading ? (
            <div className="text-center p-8 text-[var(--text-muted)]">Loading content...</div>
          ) : modules.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-[var(--border-strong)] rounded-2xl text-[var(--text-muted)] bg-[var(--surface-secondary)]">
              No modules yet. Create your first module below!
            </div>
          ) : (
            modules.map((mod, i) => (
              <div key={mod.id} className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl overflow-hidden">
                <div className="p-4 bg-[var(--surface-tertiary)] flex justify-between items-center border-b border-[var(--border-strong)]">
                  {editingModule?.id === mod.id ? (
                    <div className="flex gap-2 flex-1 mr-4">
                      <input autoFocus value={editingModule.title} onChange={e => setEditingModule({ ...editingModule, title: e.target.value })} className="flex-1 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                      <button onClick={() => handleUpdate('Module', mod.id, editingModule.title)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700">Save</button>
                      <button onClick={() => setEditingModule(null)} className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600">Cancel</button>
                    </div>
                  ) : (
                    <h2 className="font-bold text-lg text-[var(--text-primary)]">Module {i + 1}: {mod.title}</h2>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingModule({ id: mod.id, title: mod.title })} className="p-2 text-[var(--text-secondary)] hover:text-blue-500"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete('Module', mod.id)} className="p-2 text-red-500/50 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Lessons */}
                  {mod.Lesson?.map((lesson: any, li: number) => (
                    <div key={lesson.id} className="bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        {editingLesson?.id === lesson.id ? (
                          <div className="flex gap-2 flex-1 mr-4">
                            <input autoFocus value={editingLesson.title} onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })} className="flex-1 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                            <button onClick={() => handleUpdate('Lesson', lesson.id, editingLesson.title)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700">Save</button>
                            <button onClick={() => setEditingLesson(null)} className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600">Cancel</button>
                          </div>
                        ) : (
                          <h3 className="font-bold text-[var(--text-primary)]">Lesson {li + 1}: {lesson.title}</h3>
                        )}
                        <div className="flex items-center gap-2">
                          <button onClick={() => setEditingLesson({ id: lesson.id, title: lesson.title })} className="text-[var(--text-secondary)] hover:text-blue-500"><Edit2 size={14} /></button>
                          <button onClick={() => handleDelete('Lesson', lesson.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>

                      {/* Materials List */}
                      <div className="space-y-2 pl-4 border-l-2 border-[var(--border-strong)] mb-4">
                        {lesson.LearningMaterial?.map((mat: any) => (
                          <div key={mat.id} className="flex justify-between items-center bg-[var(--surface-secondary)] p-3 rounded-lg border border-[var(--border-primary)]">
                            {editingMaterial?.id === mat.id ? (
                              <div className="flex flex-col sm:flex-row gap-2 flex-1 mr-4">
                                <input autoFocus value={editingMaterial.title} onChange={e => setEditingMaterial({ ...editingMaterial, title: e.target.value })} className="flex-1 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                                <select 
                                  value={editingMaterial.batchName || 'ALL'} 
                                  onChange={e => setEditingMaterial({ ...editingMaterial, batchName: e.target.value })}
                                  className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs"
                                >
                                  <option value="ALL">All Batches</option>
                                  <option value="Batch 1">Batch 1</option>
                                  <option value="Batch 2">Batch 2</option>
                                  <option value="Batch 3">Batch 3</option>
                                </select>
                                <button onClick={() => handleUpdate('LearningMaterial', mat.id, editingMaterial.title, editingMaterial.batchName)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700">Save</button>
                                <button onClick={() => setEditingMaterial(null)} className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 flex-wrap">
                                {mat.material_type === 'VIDEO' ? <Video size={16} className="text-[var(--color-brand)]" /> : <FileText size={16} className="text-blue-500" />}
                                <span className="text-sm font-medium text-[var(--text-primary)]">{mat.title}</span>
                                
                                {/* Batch Tag Badge for Admin */}
                                {mat.batch_name && mat.batch_name !== 'ALL' ? (
                                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold inline-flex items-center gap-1">
                                    <Layers size={10} />
                                    {mat.batch_name}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs font-semibold">
                                    All Batches
                                  </span>
                                )}
                              </div>
                            )}
                            <div className="flex items-center gap-3">
                              <button onClick={() => setEditingMaterial({ id: mat.id, title: mat.title, batchName: mat.batch_name || 'ALL' })} className="text-[var(--text-secondary)] hover:text-blue-500"><Edit2 size={14} /></button>
                              <button onClick={() => handleDelete('LearningMaterial', mat.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}

                        {/* Add Material Form */}
                        {newMaterialData.lessonId === lesson.id ? (
                          <form onSubmit={(e) => handleAddMaterial(e, lesson.id, lesson.LearningMaterial?.length || 0)} className="bg-[var(--surface-tertiary)] p-4 rounded-lg mt-2 border border-[var(--border-strong)] space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <input 
                                required 
                                type="text" 
                                placeholder="Material Title (e.g. Day 1 Recording)" 
                                value={newMaterialData.title} 
                                onChange={e => setNewMaterialData({...newMaterialData, title: e.target.value})} 
                                className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" 
                              />
                              
                              <select 
                                value={newMaterialData.type} 
                                onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value, file: null})} 
                                className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none"
                              >
                                <option value="VIDEO_YOUTUBE">YouTube Link (Unlisted/Safe)</option>
                                <option value="VIDEO">Upload MP4 Video (Direct)</option>
                                <option value="PDF">Document (PDF / PowerPoint)</option>
                              </select>

                              {/* Batch Assignment Selector */}
                              <select 
                                value={newMaterialData.batchName} 
                                onChange={e => setNewMaterialData({...newMaterialData, batchName: e.target.value})}
                                className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none font-medium"
                              >
                                <option value="ALL">🌐 All Batches (Common)</option>
                                <option value="Batch 1">📁 Batch 1 Only</option>
                                <option value="Batch 2">📁 Batch 2 Only</option>
                                <option value="Batch 3">📁 Batch 3 Only</option>
                              </select>

                              {newMaterialData.type === 'VIDEO_YOUTUBE' ? (
                                <input 
                                  required 
                                  type="text" 
                                  placeholder="Paste YouTube Link..." 
                                  value={newMaterialData.file as any || ''} 
                                  onChange={e => setNewMaterialData({...newMaterialData, file: e.target.value as any})} 
                                  className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" 
                                />
                              ) : (
                                <input 
                                  required 
                                  type="file" 
                                  onChange={e => setNewMaterialData({...newMaterialData, file: e.target.files?.[0] || null})} 
                                  className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-[var(--color-brand)] file:text-white hover:file:bg-red-700" 
                                />
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <button type="submit" disabled={newMaterialData.isUploading} className="px-4 py-2 bg-[var(--color-brand)] text-white text-sm font-bold rounded hover:bg-red-700 disabled:opacity-50">
                                {newMaterialData.isUploading ? 'Uploading...' : 'Save Material'}
                              </button>
                              <button type="button" onClick={() => setNewMaterialData({ lessonId: '', title: '', type: 'VIDEO_YOUTUBE', batchName: 'ALL', file: null, isUploading: false })} className="px-4 py-2 bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-sm font-bold rounded">
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setNewMaterialData({ ...newMaterialData, lessonId: lesson.id })} className="text-xs font-bold text-[var(--color-brand)] hover:underline flex items-center gap-1 mt-2">
                            <Plus size={12} /> Add Video / Material
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add Lesson Form */}
                  {newLessonData.moduleId === mod.id ? (
                    <form onSubmit={(e) => handleAddLesson(e, mod.id, mod.Lesson?.length || 0)} className="flex gap-2 mt-4">
                      <input autoFocus required type="text" placeholder="Lesson Title..." value={newLessonData.title} onChange={e => setNewLessonData({ ...newLessonData, title: e.target.value })} className="flex-1 p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                      <button type="submit" className="px-4 py-2 bg-[var(--surface-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] text-sm font-bold rounded-lg hover:bg-[var(--surface-hover)]">Save</button>
                      <button type="button" onClick={() => setNewLessonData({ moduleId: '', title: '' })} className="px-4 py-2 text-[var(--text-muted)] text-sm">Cancel</button>
                    </form>
                  ) : (
                    <button onClick={() => setNewLessonData({ moduleId: mod.id, title: '' })} className="w-full py-3 mt-2 border border-dashed border-[var(--border-strong)] text-[var(--text-secondary)] rounded-xl text-sm font-bold hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-center gap-2">
                      <Plus size={16} /> Add Lesson
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Add Module Form */}
          <form onSubmit={handleAddModule} className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] p-6 rounded-2xl flex gap-4">
            <input required type="text" placeholder="New Module Title (e.g. Week 1: Fundamentals)" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="flex-1 p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] outline-none" />
            <button type="submit" className="px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-red-700 flex items-center gap-2">
              <Plus size={20} /> Add Module
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
