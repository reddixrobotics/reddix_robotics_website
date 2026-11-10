import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/features/admin/services/apiService';
import { Plus, Video, FileText, Trash2, Edit2, Layers, Eye, FolderPlus, CheckCircle2, ChevronRight, X, ChevronDown } from 'lucide-react';

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
      // Natural sort for Batch 1, Batch 2, Batch 10
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
  const handleDeleteBatch = (batchNameToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Filter modules: EACH BATCH HAS ITS OWN MODULES
  const currentBatchModules = useMemo(() => {
    if (activeBatch === 'ALL') return modules;
    const target = activeBatch.trim().toLowerCase();
    return modules.filter(m => (m.batch_name || '').trim().toLowerCase() === target);
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
      const publicUrl = newMaterialData.type === 'VIDEO_YOUTUBE' ? (newMaterialData.file as any) : await uploadFile(newMaterialData.file as File);
      const finalType = newMaterialData.type === 'VIDEO_YOUTUBE' ? 'VIDEO' : newMaterialData.type;
      const targetBatch = activeBatch === 'ALL' ? 'Batch 1' : activeBatch;

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
        <p className="text-[var(--text-secondary)]">Create dedicated batches for workshops. Each batch has its own independent modules, lessons, and recordings.</p>
      </div>

      {/* Workshop Selector */}
      <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6">
        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Select Workshop</label>
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
          {/* BATCH SELECTOR & MANAGEMENT SECTION */}
          <div className="bg-[var(--surface-secondary)] border border-[var(--border-strong)] rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-strong)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--surface-tertiary)] flex items-center justify-center text-[var(--color-brand)] border border-[var(--border-strong)]">
                  <Layers size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[var(--text-primary)]">Batches</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface-tertiary)] text-[var(--text-muted)] font-bold border border-[var(--border-strong)]">
                      {availableBatches.length} total
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Select a cohort below to view its independent curriculum, or create a new batch.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Dropdown Jump & + Create New Batch */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Fast Dropdown Jump for when there are 10+ batches */}
                <div className="relative">
                  <select
                    value={activeBatch}
                    onChange={e => setActiveBatch(e.target.value)}
                    className="appearance-none bg-[var(--bg-primary)] border border-[var(--border-strong)] hover:border-[var(--color-brand)] text-[var(--text-primary)] px-3.5 py-2.5 pr-8 rounded-xl text-xs font-bold outline-none cursor-pointer transition-colors shadow-sm"
                    title="Jump directly to any batch"
                  >
                    <option value="ALL">🌐 All Batches (Overview)</option>
                    {availableBatches.map(b => {
                      const count = modules.filter(m => (m.batch_name || '').trim().toLowerCase() === b.trim().toLowerCase()).length;
                      return (
                        <option key={b} value={b}>
                          📁 {b} ({count} {count === 1 ? 'module' : 'modules'})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
                </div>

                {!showNewBatchInput && (
                  <button
                    type="button"
                    onClick={() => setShowNewBatchInput(true)}
                    className="px-4 py-2.5 bg-[var(--color-brand)] text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-md shadow-brand/20 whitespace-nowrap"
                  >
                    <FolderPlus size={15} />
                    + New Batch
                  </button>
                )}
              </div>
            </div>

            {/* Inline New Batch Creator */}
            {showNewBatchInput && (
              <form onSubmit={handleCreateBatch} className="p-4 bg-[var(--bg-primary)] border-2 border-[var(--color-brand)] rounded-xl flex flex-col sm:flex-row gap-3 items-center animate-in fade-in">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-[var(--color-brand)] mb-1">Enter New Batch Name:</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    value={newBatchName}
                    onChange={e => setNewBatchName(e.target.value)}
                    placeholder={`e.g. Batch ${availableBatches.length + 1}, Weekend Cohort, Nov 2026`}
                    className="w-full p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-strong)] text-[var(--text-primary)] font-bold text-sm outline-none"
                  />
                </div>
                <div className="flex gap-2 self-end sm:self-auto w-full sm:w-auto">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-[var(--color-brand)] text-white text-xs font-bold rounded-lg hover:bg-red-700"
                  >
                    Create Batch
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewBatchInput(false); setNewBatchName(''); }}
                    className="px-4 py-2.5 bg-[var(--surface-secondary)] text-[var(--text-secondary)] text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* HORIZONTAL SCROLLABLE BATCH PILLS - NEVER BREAKS OR OVERFLOWS MESSILY */}
            <div className="relative">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth flex-nowrap">
                {availableBatches.map(b => {
                  const count = modules.filter(m => (m.batch_name || '').trim().toLowerCase() === b.trim().toLowerCase()).length;
                  const isSelected = activeBatch === b;

                  return (
                    <div
                      key={b}
                      onClick={() => setActiveBatch(b)}
                      className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer whitespace-nowrap flex-shrink-0 select-none ${
                        isSelected
                          ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)] shadow-md shadow-brand/20'
                          : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <Layers size={14} className={isSelected ? 'text-white' : 'text-[var(--color-brand)]'} />
                      <span>{b}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[var(--surface-tertiary)] text-[var(--text-muted)]'
                      }`}>
                        {count} {count === 1 ? 'mod' : 'mods'}
                      </span>

                      {/* Delete empty batch button (only if 0 modules and not Batch 1) */}
                      {count === 0 && b !== 'Batch 1' && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteBatch(b, e)}
                          title={`Delete empty ${b}`}
                          className={`ml-1 p-0.5 rounded hover:bg-black/20 ${isSelected ? 'text-white/80 hover:text-white' : 'text-[var(--text-muted)] hover:text-red-400'}`}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* All Batches Overview Tab */}
                <button
                  type="button"
                  onClick={() => setActiveBatch('ALL')}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap flex-shrink-0 ${
                    activeBatch === 'ALL'
                      ? 'bg-zinc-800 text-white border-zinc-600'
                      : 'bg-[var(--bg-primary)] text-[var(--text-muted)] border-[var(--border-strong)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  🌐 All Batches (Overview)
                </button>
              </div>
            </div>

            {/* Active Batch Header Banner */}
            <div className="p-3 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-strong)] text-xs flex items-center justify-between text-[var(--text-secondary)]">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-[var(--color-brand)]" />
                <span>
                  Active Cohort: <strong className="text-[var(--text-primary)] font-bold">{activeBatch === 'ALL' ? 'All Batches (Curriculum Overview)' : activeBatch}</strong>
                </span>
              </div>
              {activeBatch !== 'ALL' && (
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Showing only modules belonging to {activeBatch}
                </span>
              )}
            </div>

            {/* Migration helper for existing unassigned modules */}
            {unassignedModules.length > 0 && activeBatch !== 'ALL' && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs text-amber-300">
                <span>
                  Found {unassignedModules.length} module(s) created without batch assignment.
                </span>
                <button
                  type="button"
                  onClick={handleClaimUnassigned}
                  className="px-3 py-1 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400"
                >
                  Assign to {activeBatch}
                </button>
              </div>
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
                    const visibleMaterials = lesson.LearningMaterial || [];

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
                            <div className="text-xs text-[var(--text-muted)] italic">No videos or materials in this lesson yet.</div>
                          ) : (
                            visibleMaterials.map((mat: any) => (
                              <div key={mat.id} className="flex justify-between items-center p-2 rounded bg-[var(--surface-secondary)] text-sm">
                                <div className="flex items-center gap-2 flex-1">
                                  {mat.material_type === 'VIDEO' ? <Video size={16} className="text-red-500" /> : <FileText size={16} className="text-blue-500" />}
                                  {editingMaterial?.id === mat.id ? (
                                    <div className="flex gap-2 flex-1">
                                      <input autoFocus value={editingMaterial.title} onChange={e => setEditingMaterial({ ...editingMaterial, title: e.target.value })} className="p-1 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded text-xs flex-1" />
                                      <button onClick={() => handleUpdate('LearningMaterial', mat.id, editingMaterial.title, mat.batch_name)} className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">Save</button>
                                      <button onClick={() => setEditingMaterial(null)} className="px-2 py-0.5 bg-gray-500 text-white text-xs font-bold rounded">Cancel</button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <a href={mat.file_path} target="_blank" rel="noreferrer" className="hover:underline font-medium text-[var(--text-primary)]">
                                        {mat.title}
                                      </a>
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
                                  onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value})}
                                  className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none"
                                >
                                  <option value="VIDEO_YOUTUBE">YouTube Video</option>
                                  <option value="DOCUMENT_PDF">PDF Document</option>
                                  <option value="DOCUMENT_PPT">Presentation (PPT)</option>
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
