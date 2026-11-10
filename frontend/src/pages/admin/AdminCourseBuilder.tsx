import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/features/admin/services/apiService';
import { Plus, Video, FileText, ChevronDown, ChevronRight, Upload, Trash2, Edit2, Layers, Filter, Eye } from 'lucide-react';

export default function AdminCourseBuilder() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeBatchFilter, setActiveBatchFilter] = useState('ALL');

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

  // Extract all distinct batches present across learning materials
  const distinctBatches = useMemo(() => {
    const batches = new Set<string>(['Batch 1', 'Batch 2', 'Batch 3']);
    modules.forEach(m => {
      m.Lesson?.forEach((l: any) => {
        l.LearningMaterial?.forEach((mat: any) => {
          if (mat.batch_name && mat.batch_name !== 'ALL') {
            batches.add(mat.batch_name);
          }
        });
      });
    });
    return Array.from(batches).sort();
  }, [modules]);

  // Statistics per batch
  const batchStats = useMemo(() => {
    const stats: Record<string, { videos: number, docs: number }> = {
      ALL: { videos: 0, docs: 0 }
    };
    distinctBatches.forEach(b => {
      stats[b] = { videos: 0, docs: 0 };
    });

    modules.forEach(m => {
      m.Lesson?.forEach((l: any) => {
        l.LearningMaterial?.forEach((mat: any) => {
          const b = mat.batch_name || 'ALL';
          const isVideo = mat.material_type === 'VIDEO';
          if (!stats[b]) stats[b] = { videos: 0, docs: 0 };
          if (isVideo) stats[b].videos++;
          else stats[b].docs++;
        });
      });
    });
    return stats;
  }, [modules, distinctBatches]);

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
      
      const targetBatch = newMaterialData.batchName?.trim() || (activeBatchFilter !== 'ALL' ? activeBatchFilter : 'ALL');

      const { error } = await supabase.from('LearningMaterial').insert({
        lesson_id: lessonId,
        title: newMaterialData.title,
        material_type: finalType,
        batch_name: targetBatch,
        file_path: publicUrl,
        order_index: currentLength
      });
      
      if (!error) {
        setNewMaterialData({
          lessonId: '',
          title: '',
          type: 'VIDEO_YOUTUBE',
          batchName: activeBatchFilter !== 'ALL' ? activeBatchFilter : 'ALL',
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Batch-Wise Course Content Builder</h1>
          <p className="text-[var(--text-secondary)]">Manage learning materials, lectures, and live recordings organized by batch.</p>
        </div>
      </div>

      {/* Workshop Selector */}
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
          {/* BATCH-WISE LEARNING DATA TABS */}
          <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-strong)] pb-4">
              <div className="flex items-center gap-2">
                <Layers className="text-[var(--color-brand)]" size={20} />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Batch Learning View</h2>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                Switch batches to view or upload recordings for that specific cohort.
              </span>
            </div>

            {/* Batch Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveBatchFilter('ALL')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeBatchFilter === 'ALL'
                    ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-brand/20'
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-strong)] hover:bg-[var(--surface-hover)]'
                }`}
              >
                🌐 All Batches (Full Overview)
              </button>

              {distinctBatches.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActiveBatchFilter(b)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeBatchFilter === b
                      ? 'bg-[var(--color-brand)] text-white shadow-lg shadow-brand/20'
                      : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-strong)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <Layers size={14} />
                  {b}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeBatchFilter === b ? 'bg-white/20 text-white' : 'bg-[var(--surface-tertiary)] text-[var(--text-muted)]'
                  }`}>
                    {batchStats[b]?.videos || 0} vids
                  </span>
                </button>
              ))}
            </div>

            {/* Current Active Batch Banner */}
            <div className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-strong)] text-xs flex items-center justify-between text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-[var(--color-brand)]" />
                <span>
                  Currently editing: <strong className="text-[var(--text-primary)]">{activeBatchFilter === 'ALL' ? 'All Batches (Full Curriculum)' : `${activeBatchFilter} Cohort`}</strong>
                </span>
              </div>
              {activeBatchFilter !== 'ALL' && (
                <span className="text-cyan-400 font-semibold">
                  New materials uploaded will default to {activeBatchFilter}
                </span>
              )}
            </div>
          </div>

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
                  {mod.Lesson?.map((lesson: any, li: number) => {
                    // Filter materials according to activeBatchFilter
                    const visibleMaterials = lesson.LearningMaterial?.filter((mat: any) => {
                      if (activeBatchFilter === 'ALL') return true;
                      if (!mat.batch_name || mat.batch_name === 'ALL') return true;
                      return mat.batch_name.toLowerCase() === activeBatchFilter.toLowerCase();
                    }) || [];

                    return (
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

                        {/* Batch-Filtered Materials List */}
                        <div className="space-y-2 pl-4 border-l-2 border-[var(--border-strong)] mb-4">
                          {visibleMaterials.length === 0 ? (
                            <p className="text-xs text-[var(--text-muted)] italic py-1">
                              No learning materials for {activeBatchFilter === 'ALL' ? 'this lesson' : activeBatchFilter} yet.
                            </p>
                          ) : (
                            visibleMaterials.map((mat: any) => (
                              <div key={mat.id} className="flex justify-between items-center bg-[var(--surface-secondary)] p-3 rounded-lg border border-[var(--border-primary)]">
                                {editingMaterial?.id === mat.id ? (
                                  <div className="flex flex-col sm:flex-row gap-2 flex-1 mr-4">
                                    <input autoFocus value={editingMaterial.title} onChange={e => setEditingMaterial({ ...editingMaterial, title: e.target.value })} className="flex-1 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                                    <select 
                                      value={editingMaterial.batchName || 'ALL'} 
                                      onChange={e => setEditingMaterial({ ...editingMaterial, batchName: e.target.value })}
                                      className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs"
                                    >
                                      <option value="ALL">All Batches (Common)</option>
                                      {distinctBatches.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                      ))}
                                    </select>
                                    <button onClick={() => handleUpdate('LearningMaterial', mat.id, editingMaterial.title, editingMaterial.batchName)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700">Save</button>
                                    <button onClick={() => setEditingMaterial(null)} className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600">Cancel</button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3 flex-wrap">
                                    {mat.material_type === 'VIDEO' ? <Video size={16} className="text-[var(--color-brand)]" /> : <FileText size={16} className="text-blue-500" />}
                                    <span className="text-sm font-medium text-[var(--text-primary)]">{mat.title}</span>
                                    
                                    {/* Batch Badge */}
                                    {mat.batch_name && mat.batch_name !== 'ALL' ? (
                                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold inline-flex items-center gap-1">
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
                            ))
                          )}

                          {/* Add Material Form */}
                          {newMaterialData.lessonId === lesson.id ? (
                            <form onSubmit={(e) => handleAddMaterial(e, lesson.id, lesson.LearningMaterial?.length || 0)} className="bg-[var(--surface-tertiary)] p-4 rounded-lg mt-2 border border-[var(--border-strong)] space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <input 
                                  required 
                                  type="text" 
                                  placeholder="Material Title (e.g. Day 1 Live Recording)" 
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

                                {/* Batch Target Assignment */}
                                <select 
                                  value={newMaterialData.batchName} 
                                  onChange={e => setNewMaterialData({...newMaterialData, batchName: e.target.value})}
                                  className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none font-bold"
                                >
                                  <option value="ALL">🌐 All Batches (Common)</option>
                                  {distinctBatches.map(b => (
                                    <option key={b} value={b}>📁 {b}</option>
                                  ))}
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
                                <button type="button" onClick={() => setNewMaterialData({ lessonId: '', title: '', type: 'VIDEO_YOUTUBE', batchName: activeBatchFilter !== 'ALL' ? activeBatchFilter : 'ALL', file: null, isUploading: false })} className="px-4 py-2 bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-sm font-bold rounded">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button 
                              onClick={() => setNewMaterialData({ 
                                ...newMaterialData, 
                                lessonId: lesson.id,
                                batchName: activeBatchFilter !== 'ALL' ? activeBatchFilter : 'ALL'
                              })} 
                              className="text-xs font-bold text-[var(--color-brand)] hover:underline flex items-center gap-1 mt-2"
                            >
                              <Plus size={12} /> Add Video / Material {activeBatchFilter !== 'ALL' ? `for ${activeBatchFilter}` : ''}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

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
