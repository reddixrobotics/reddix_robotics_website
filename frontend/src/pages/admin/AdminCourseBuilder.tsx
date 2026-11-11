import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/features/admin/services/apiService';
import { Plus, Video, FileText, Trash2, Edit2, Layers, Eye, FolderPlus, CheckCircle2, ChevronDown } from 'lucide-react';

export default function AdminCourseBuilder() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState('');
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Batch Management State
  const [customBatches, setCustomBatches] = useState<string[]>([]);
  const [activeBatch, setActiveBatch] = useState<string>('Batch 1');
  const [showNewBatchInput, setShowNewBatchInput] = useState(false);
  const [newBatchName, setNewBatchName] = useState('');

  // Forms State
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonData, setNewLessonData] = useState({ moduleId: '', title: '' });
  const [newMaterialData, setNewMaterialData] = useState({
    lessonId: '',
    title: '',
    type: 'VIDEO_YOUTUBE',
    batchName: '',
    file: null as File | null | string,
    isUploading: false
  });

  const [editingModule, setEditingModule] = useState<{ id: string, title: string, batchName?: string } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ id: string, title: string } | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<{ id: string, title: string, batchName?: string } | null>(null);

  // Load workshops on mount
  useEffect(() => {
    fetchWorkshops();
  }, []);

  // When workshop changes, fetch modules and load saved batches
  useEffect(() => {
    if (selectedWorkshop) {
      fetchModules();
      const saved = localStorage.getItem(`batches_${selectedWorkshop}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCustomBatches(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setModules([]);
    }
  }, [selectedWorkshop]);

  async function fetchWorkshops() {
    const { data } = await supabase.from('Workshop').select('id, title');
    if (data) {
      setWorkshops(data);
      if (data.length > 0) {
        setSelectedWorkshop(prev => prev || data[0].id);
      }
    }
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

  // Combine batches discovered from modules with custom batches created by user
  const availableBatches = useMemo(() => {
    const batchSet = new Set<string>(['Batch 1']);
    // Batches from custom state
    customBatches.forEach(b => {
      if (b && b !== 'ALL') batchSet.add(b.trim());
    });
    // Batches from existing modules
    modules.forEach(m => {
      if (m.batch_name && m.batch_name !== 'ALL') {
        batchSet.add(m.batch_name.trim());
      }
      m.Lesson?.forEach((l: any) => {
        l.LearningMaterial?.forEach((mat: any) => {
          if (mat.batch_name && mat.batch_name !== 'ALL') {
            batchSet.add(mat.batch_name.trim());
          }
        });
      });
    });
    return Array.from(batchSet).sort((a, b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [modules, customBatches]);

  // Persist custom batches to localStorage whenever availableBatches updates
  useEffect(() => {
    if (selectedWorkshop && availableBatches.length > 0) {
      localStorage.setItem(`batches_${selectedWorkshop}`, JSON.stringify(availableBatches));
    }
  }, [availableBatches, selectedWorkshop]);

  // Ensure activeBatch is valid
  useEffect(() => {
    if (activeBatch !== 'ALL' && !availableBatches.includes(activeBatch) && availableBatches.length > 0) {
      setActiveBatch(availableBatches[0]);
    }
  }, [availableBatches, activeBatch]);

  // Handle creating a brand new batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newBatchName.trim();
    if (!trimmed) return;

    if (!availableBatches.includes(trimmed)) {
      const updated = [...customBatches, trimmed];
      setCustomBatches(updated);
      if (selectedWorkshop) {
        localStorage.setItem(`batches_${selectedWorkshop}`, JSON.stringify(Array.from(new Set([...availableBatches, trimmed]))));
      }
    }
    setActiveBatch(trimmed);
    setNewBatchName('');
    setShowNewBatchInput(false);
  };

  // Handle deleting an empty batch
  const handleDeleteBatch = (batchNameToDelete: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const hasModules = modules.some(m => (m.batch_name || '').trim().toLowerCase() === batchNameToDelete.trim().toLowerCase());
    if (hasModules) {
      alert(`Cannot delete ${batchNameToDelete} because it contains existing modules.`);
      return;
    }
    if (!confirm(`Are you sure you want to delete empty batch "${batchNameToDelete}"?`)) return;

    const updated = customBatches.filter(b => b.trim().toLowerCase() !== batchNameToDelete.trim().toLowerCase());
    setCustomBatches(updated);
    if (selectedWorkshop) {
      const updatedAvailable = availableBatches.filter(b => b.trim().toLowerCase() !== batchNameToDelete.trim().toLowerCase());
      localStorage.setItem(`batches_${selectedWorkshop}`, JSON.stringify(updatedAvailable));
    }
    if (activeBatch.trim().toLowerCase() === batchNameToDelete.trim().toLowerCase()) {
      setActiveBatch('Batch 1');
    }
  };

  // Filter modules: show batch-specific modules if available, or all course modules so lessons can be populated
  const currentBatchModules = useMemo(() => {
    if (activeBatch === 'ALL') return modules;
    const target = activeBatch.trim().toLowerCase();
    const batchSpecific = modules.filter(m => (m.batch_name || '').trim().toLowerCase() === target);
    if (batchSpecific.length > 0) return batchSpecific;
    return modules;
  }, [modules, activeBatch]);

  // Check for legacy unassigned modules
  const unassignedModules = useMemo(() => {
    return modules.filter(m => !m.batch_name || m.batch_name === 'ALL');
  }, [modules]);

  // Quick fix: claim legacy unassigned modules into the active batch
  const handleClaimUnassigned = async () => {
    for (const m of unassignedModules) {
      await supabase.from('Module').update({ batch_name: activeBatch }).eq('id', m.id);
    }
    fetchModules();
  };

  // Add Module to the active batch
  async function handleAddModule(e: React.FormEvent) {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const targetBatch = activeBatch === 'ALL' ? 'Batch 1' : activeBatch;

    let res = await supabase.from('Module').insert({
      course_id: selectedWorkshop,
      title: newModuleTitle.trim(),
      batch_name: targetBatch,
      order_index: currentBatchModules.length
    });

    if (res.error && res.error.message?.includes('batch_name')) {
      res = await supabase.from('Module').insert({
        course_id: selectedWorkshop,
        title: newModuleTitle.trim(),
        order_index: currentBatchModules.length
      });
    }

    if (!res.error) {
      setNewModuleTitle('');
      fetchModules();
    }
  }

  // Add Lesson to module
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

  // Add Material to lesson
  async function handleAddMaterial(e: React.FormEvent, lessonId: string, currentLength: number) {
    e.preventDefault();
    if (!newMaterialData.title || !newMaterialData.file || newMaterialData.lessonId !== lessonId) return;
    
    setNewMaterialData(prev => ({ ...prev, isUploading: true }));
    try {
      const isFile = newMaterialData.type !== 'VIDEO_YOUTUBE';
      const publicUrl = isFile ? await uploadFile(newMaterialData.file as File) : String(newMaterialData.file).trim();
      const finalType = (newMaterialData.type === 'VIDEO_YOUTUBE' || newMaterialData.type === 'VIDEO_FILE') ? 'VIDEO' : newMaterialData.type;
      const chosenBatch = newMaterialData.batchName || (activeBatch === 'ALL' ? 'ALL' : activeBatch);

      let { error } = await supabase.from('LearningMaterial').insert({
        lesson_id: lessonId,
        title: newMaterialData.title.trim(),
        material_type: finalType,
        batch_name: chosenBatch,
        file_path: publicUrl,
        order_index: currentLength
      });

      if (error && error.message?.includes('batch_name')) {
        const res = await supabase.from('LearningMaterial').insert({
          lesson_id: lessonId,
          title: newMaterialData.title.trim(),
          material_type: finalType,
          file_path: publicUrl,
          order_index: currentLength
        });
        error = res.error;
      }
      
      if (!error) {
        setNewMaterialData({
          lessonId: '',
          title: '',
          type: 'VIDEO_YOUTUBE',
          batchName: '',
          file: null,
          isUploading: false
        });
        await fetchModules();
      } else {
        console.error('Insert error:', error);
        alert('Upload failed: ' + error.message);
        setNewMaterialData(prev => ({ ...prev, isUploading: false }));
      }
    } catch (err: any) {
      console.error(err);
      alert('Upload failed: ' + (err.message || 'Please check the file or link and try again.'));
      setNewMaterialData(prev => ({ ...prev, isUploading: false }));
    }
  }

  async function handleUpdate(table: string, id: string, title: string, batchName?: string) {
    if (!title.trim()) return;
    const updatePayload: any = { title };
    if ((table === 'LearningMaterial' || table === 'Module') && batchName !== undefined) {
      updatePayload.batch_name = batchName;
    }
    await supabase.from(table).update(updatePayload).eq('id', id);
    if (table === 'Module') setEditingModule(null);
    if (table === 'Lesson') setEditingLesson(null);
    if (table === 'LearningMaterial') setEditingMaterial(null);
    fetchModules();
  }

  async function handleDelete(table: string, id: string) {
    if (!confirm('Are you sure you want to delete this?')) return;
    await supabase.from(table).delete().eq('id', id);
    fetchModules();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-[var(--text-primary)]">Workshop Batch & Course Builder</h1>
        <p className="text-[var(--text-secondary)]">Manage courses organized by batches. Pick a batch from the dropdown to edit its dedicated modules.</p>
      </div>

      {/* Workshop and Batch Selectors in Two Clean Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Workshop Selector */}
        <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">1. Select Workshop</label>
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
          <p className="text-xs text-[var(--text-muted)] mt-2">
            Select the workshop whose syllabus you want to manage.
          </p>
        </div>

        {/* 2. Batch Selector Dropdown */}
        {selectedWorkshop && (
          <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-[var(--text-secondary)]">2. Select Batch Cohort</label>
                {!showNewBatchInput && (
                  <button
                    type="button"
                    onClick={() => setShowNewBatchInput(true)}
                    className="text-xs font-bold text-[var(--color-brand)] hover:underline flex items-center gap-1"
                  >
                    <FolderPlus size={14} /> + Create New Batch
                  </button>
                )}
              </div>

              {!showNewBatchInput ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select 
                      value={activeBatch} 
                      onChange={e => setActiveBatch(e.target.value)}
                      className="w-full p-4 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none font-bold appearance-none cursor-pointer"
                    >
                      {availableBatches.map(b => {
                        const count = modules.filter(m => (m.batch_name || '').trim().toLowerCase() === b.trim().toLowerCase()).length;
                        return (
                          <option key={b} value={b}>
                            📁 {b} — ({count} {count === 1 ? 'module' : 'modules'})
                          </option>
                        );
                      })}
                      <option value="ALL">🌐 All Batches (Full Overview)</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                  </div>

                  {/* Delete empty batch button */}
                  {activeBatch !== 'ALL' && activeBatch !== 'Batch 1' && currentBatchModules.length === 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteBatch(activeBatch)}
                      className="px-4 bg-[var(--surface-tertiary)] hover:bg-red-500/20 text-red-400 rounded-xl border border-[var(--border-strong)] transition-colors"
                      title={`Delete empty ${activeBatch}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleCreateBatch} className="flex gap-2 animate-in fade-in">
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newBatchName}
                    onChange={e => setNewBatchName(e.target.value)}
                    placeholder={`e.g. Batch ${availableBatches.length + 1}, Weekend`}
                    className="flex-1 p-3.5 rounded-xl bg-[var(--bg-primary)] border-2 border-[var(--color-brand)] text-[var(--text-primary)] font-bold text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-[var(--color-brand)] text-white text-xs font-bold rounded-xl hover:bg-red-700 whitespace-nowrap"
                  >
                    Save Batch
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewBatchInput(false); setNewBatchName(''); }}
                    className="px-3 py-3 bg-[var(--surface-tertiary)] text-[var(--text-secondary)] text-xs font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-2">
              <span>Current view: <strong className="text-[var(--text-primary)]">{activeBatch}</strong></span>
              <span className="text-cyan-400 font-semibold">{currentBatchModules.length} module(s) in this batch</span>
            </div>
          </div>
        )}
      </div>

      {selectedWorkshop && (
        <div className="space-y-6">
          {/* Migration helper for existing unassigned modules */}
          {unassignedModules.length > 0 && activeBatch !== 'ALL' && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between text-sm text-amber-300 shadow-sm">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-amber-400" />
                <span>Found {unassignedModules.length} module(s) created without batch assignment.</span>
              </div>
              <button
                type="button"
                onClick={handleClaimUnassigned}
                className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 text-xs"
              >
                Assign to {activeBatch}
              </button>
            </div>
          )}

          {/* Active Batch Banner */}
          <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-[var(--text-secondary)] shadow-sm">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-[var(--color-brand)]" />
              <span>Editing Cohort: <strong className="text-[var(--text-primary)] text-base">{activeBatch === 'ALL' ? 'All Batches (Curriculum Overview)' : activeBatch}</strong></span>
            </div>
            {activeBatch !== 'ALL' && (
              <span className="text-cyan-400 font-semibold flex items-center gap-1.5 text-xs">
                <CheckCircle2 size={14} /> Modules & videos below are isolated to {activeBatch}
              </span>
            )}
          </div>

          {/* MODULE LIST FOR THE SELECTED BATCH */}
          {loading ? (
            <div className="text-center p-8 text-[var(--text-muted)]">Loading batch modules...</div>
          ) : currentBatchModules.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--surface-secondary)] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--surface-tertiary)] flex items-center justify-center text-[var(--text-muted)] mx-auto border border-[var(--border-strong)]">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                No modules yet in {activeBatch}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                Every batch has its own independent modules and curriculum. Create your first module for <strong>{activeBatch}</strong> below:
              </p>
            </div>
          ) : (
            currentBatchModules.map((mod, i) => (
              <div key={mod.id} className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 bg-[var(--surface-tertiary)] flex justify-between items-center border-b border-[var(--border-strong)]">
                  {editingModule?.id === mod.id ? (
                    <div className="flex flex-wrap gap-2 flex-1 mr-4">
                      <input 
                        autoFocus 
                        value={editingModule.title} 
                        onChange={e => setEditingModule({ ...editingModule, title: e.target.value })} 
                        className="flex-1 p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" 
                      />
                      <select
                        value={editingModule.batchName || activeBatch}
                        onChange={e => setEditingModule({ ...editingModule, batchName: e.target.value })}
                        className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-xs font-bold"
                      >
                        {availableBatches.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                      <button onClick={() => handleUpdate('Module', mod.id, editingModule.title, editingModule.batchName)} className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700">Save</button>
                      <button onClick={() => setEditingModule(null)} className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded hover:bg-gray-600">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h2 className="font-bold text-lg text-[var(--text-primary)]">Module {i + 1}: {mod.title}</h2>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-[var(--bg-primary)] border border-cyan-500/30 text-cyan-400 inline-flex items-center gap-1">
                        <Layers size={10} />
                        {mod.batch_name || activeBatch}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEditingModule({ id: mod.id, title: mod.title, batchName: mod.batch_name || activeBatch })} className="p-2 text-[var(--text-secondary)] hover:text-blue-500" title="Edit Module"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete('Module', mod.id)} className="p-2 text-red-500/50 hover:text-red-500" title="Delete Module"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Lessons */}
                  {mod.Lesson?.map((lesson: any, li: number) => {
                    // In Admin builder: filter materials by activeBatch tab
                    const visibleMaterials = (lesson.LearningMaterial || []).filter((mat: any) => {
                      if (activeBatch === 'ALL') return true;
                      const matBatch = (mat.batch_name || '').trim().toLowerCase();
                      const target = activeBatch.trim().toLowerCase();
                      return matBatch === target || matBatch === 'all';
                    });

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
                            <button onClick={() => setEditingLesson({ id: lesson.id, title: lesson.title })} className="p-1.5 text-[var(--text-secondary)] hover:text-blue-500"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete('Lesson', lesson.id)} className="p-1.5 text-red-500/50 hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </div>

                        {/* Learning Materials List */}
                        <div className="space-y-2 pl-4 border-l-2 border-[var(--border-strong)]">
                          {visibleMaterials.length === 0 ? (
                            <div className="text-xs text-[var(--text-muted)] italic">No videos or materials in this lesson for {activeBatch === 'ALL' ? 'any batch' : activeBatch} yet.</div>
                          ) : (
                            visibleMaterials.map((mat: any) => (
                              <div key={mat.id} className="flex justify-between items-center p-2 rounded bg-[var(--surface-secondary)] text-sm">
                                <div className="flex items-center gap-2 flex-1">
                                  {mat.material_type === 'VIDEO' ? <Video size={16} className="text-red-500" /> : <FileText size={16} className="text-blue-500" />}
                                  {editingMaterial?.id === mat.id ? (
                                    <div className="flex gap-2 flex-1 flex-wrap">
                                      <input autoFocus value={editingMaterial.title} onChange={e => setEditingMaterial({ ...editingMaterial, title: e.target.value })} className="p-1 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded text-xs flex-1 min-w-[150px]" />
                                      <select
                                        value={editingMaterial.batchName || mat.batch_name || 'Batch 1'}
                                        onChange={e => setEditingMaterial({ ...editingMaterial, batchName: e.target.value })}
                                        className="p-1 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded text-xs font-bold text-cyan-400"
                                      >
                                        <option value="ALL">🌐 All Batches</option>
                                        <option value="Batch 1">📁 Batch 1</option>
                                        <option value="Batch 2">📁 Batch 2</option>
                                        <option value="Batch 3">📁 Batch 3</option>
                                        {customBatches.map(b => (
                                          <option key={b} value={b}>📁 {b}</option>
                                        ))}
                                      </select>
                                      <button onClick={() => handleUpdate('LearningMaterial', mat.id, editingMaterial.title, editingMaterial.batchName || mat.batch_name)} className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">Save</button>
                                      <button onClick={() => setEditingMaterial(null)} className="px-2 py-0.5 bg-gray-500 text-white text-xs font-bold rounded">Cancel</button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <a href={mat.file_path} target="_blank" rel="noreferrer" className="hover:underline font-medium text-[var(--text-primary)]">
                                        {mat.title}
                                      </a>
                                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                        {mat.batch_name || 'ALL'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setEditingMaterial({ id: mat.id, title: mat.title, batchName: mat.batch_name })} className="text-[var(--text-secondary)] hover:text-blue-500"><Edit2 size={12} /></button>
                                  <button onClick={() => handleDelete('LearningMaterial', mat.id)} className="text-red-500/50 hover:text-red-500"><Trash2 size={12} /></button>
                                </div>
                              </div>
                            ))
                          )}

                          {/* Add Material Form */}
                          {newMaterialData.lessonId === lesson.id ? (
                            <form onSubmit={(e) => handleAddMaterial(e, lesson.id, lesson.LearningMaterial?.length || 0)} className="space-y-3 bg-[var(--surface-tertiary)] p-3 rounded-lg border border-[var(--border-strong)] mt-2">
                              <input 
                                required 
                                type="text" 
                                placeholder="Recording / Material Title (e.g. Lecture 1 Live Recording)" 
                                value={newMaterialData.title} 
                                onChange={e => setNewMaterialData({...newMaterialData, title: e.target.value})} 
                                className="w-full p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" 
                              />
                              
                              <div className="flex flex-wrap gap-2">
                                <select 
                                  value={newMaterialData.type} 
                                  onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value, file: null})}
                                  className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none"
                                >
                                  <option value="VIDEO_YOUTUBE">Video Link (YouTube / Drive / MP4)</option>
                                  <option value="VIDEO_FILE">Upload Video File (.mp4)</option>
                                  <option value="DOCUMENT_PDF">PDF Document</option>
                                  <option value="DOCUMENT_PPT">Presentation (PPT)</option>
                                </select>

                                <select
                                  value={newMaterialData.batchName || (activeBatch === 'ALL' ? 'ALL' : activeBatch)}
                                  onChange={e => setNewMaterialData({ ...newMaterialData, batchName: e.target.value })}
                                  className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none font-bold text-cyan-400"
                                  title="Target Batch"
                                >
                                  <option value="ALL">🌐 All Batches (Common)</option>
                                  <option value="Batch 1">📁 Batch 1</option>
                                  <option value="Batch 2">📁 Batch 2</option>
                                  <option value="Batch 3">📁 Batch 3</option>
                                  {customBatches.map(b => (
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
                                    className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none flex-1 min-w-[200px]" 
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
                                <button type="button" onClick={() => setNewMaterialData({ lessonId: '', title: '', type: 'VIDEO_YOUTUBE', file: null, isUploading: false })} className="px-4 py-2 bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-sm font-bold rounded">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button 
                              onClick={() => setNewMaterialData({ 
                                ...newMaterialData, 
                                lessonId: lesson.id
                              })} 
                              className="text-xs font-bold text-[var(--color-brand)] hover:underline flex items-center gap-1 mt-2"
                            >
                              <Plus size={12} /> Add Video / Material to this Lesson
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

          {/* ADD MODULE FORM - DEDICATED TO THE ACTIVE BATCH */}
          <form onSubmit={handleAddModule} className="bg-[var(--surface-secondary)] border-2 border-[var(--border-strong)] p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-md">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
                Add New Module for <span className="text-[var(--color-brand)] font-black">{activeBatch}</span>:
              </label>
              <input 
                required 
                type="text" 
                placeholder={`e.g. Module ${currentBatchModules.length + 1}: Introduction (${activeBatch})`} 
                value={newModuleTitle} 
                onChange={e => setNewModuleTitle(e.target.value)} 
                className="w-full p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] font-medium outline-none focus:border-[var(--color-brand)]" 
              />
            </div>

            <button type="submit" className="w-full md:w-auto px-8 py-4 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 whitespace-nowrap self-end">
              <Plus size={20} /> Add Module to {activeBatch}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
