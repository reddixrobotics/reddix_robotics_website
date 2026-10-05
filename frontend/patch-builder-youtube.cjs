const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminCourseBuilder.tsx', 'utf8');

const targetForm = `<form onSubmit={(e) => handleAddMaterial(e, lesson.id, lesson.LearningMaterial?.length || 0)} className="bg-[var(--surface-tertiary)] p-4 rounded-lg mt-2 border border-[var(--border-strong)]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <input required type="text" placeholder="Material Title (e.g. Recording 1)" value={newMaterialData.title} onChange={e => setNewMaterialData({...newMaterialData, title: e.target.value})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                              <select value={newMaterialData.type} onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none">
                                <option value="VIDEO">Video (MP4)</option>
                                <option value="PDF">Document (PDF)</option>
                              </select>
                              <input required type="file" onChange={e => setNewMaterialData({...newMaterialData, file: e.target.files?.[0] || null})} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-brand)] file:text-white hover:file:bg-red-700" />
                            </div>`;

const replaceForm = `<form onSubmit={(e) => handleAddMaterial(e, lesson.id, lesson.LearningMaterial?.length || 0)} className="bg-[var(--surface-tertiary)] p-4 rounded-lg mt-2 border border-[var(--border-strong)]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <input required type="text" placeholder="Material Title (e.g. Recording 1)" value={newMaterialData.title} onChange={e => setNewMaterialData({...newMaterialData, title: e.target.value})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                              <select value={newMaterialData.type} onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none">
                                <option value="VIDEO">YouTube Video</option>
                                <option value="PDF">Document (PDF)</option>
                              </select>
                              {newMaterialData.type === 'VIDEO' ? (
                                <input required type="text" placeholder="Paste YouTube Link here..." value={newMaterialData.file as any || ''} onChange={e => setNewMaterialData({...newMaterialData, file: e.target.value as any})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                              ) : (
                                <input required type="file" onChange={e => setNewMaterialData({...newMaterialData, file: e.target.files?.[0] || null})} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-brand)] file:text-white hover:file:bg-red-700" />
                              )}
                            </div>`;

code = code.replace(targetForm, replaceForm);

const targetUpload = `const publicUrl = await uploadFile(newMaterialData.file);`;
const replaceUpload = `const publicUrl = newMaterialData.type === 'VIDEO' ? (newMaterialData.file as any) : await uploadFile(newMaterialData.file as File);`;
code = code.replace(targetUpload, replaceUpload);

fs.writeFileSync('src/pages/admin/AdminCourseBuilder.tsx', code);
