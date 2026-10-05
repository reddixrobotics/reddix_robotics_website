const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminCourseBuilder.tsx', 'utf8');

const targetDropdown = `<select value={newMaterialData.type} onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none">
                                  <option value="VIDEO">YouTube Video</option>
                                  <option value="PDF">Document (PDF / PowerPoint)</option>
                                </select>`;
const replaceDropdown = `<select value={newMaterialData.type} onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none">
                                  <option value="VIDEO_YOUTUBE">YouTube Link</option>
                                  <option value="VIDEO">Upload MP4 Video (Direct)</option>
                                  <option value="PDF">Document (PDF / PowerPoint)</option>
                                </select>`;
code = code.replace(targetDropdown, replaceDropdown);

const targetInput = `{newMaterialData.type === 'VIDEO' ? (
                                  <input required type="text" placeholder="Paste YouTube Link here..." value={newMaterialData.file as any || ''} onChange={e => setNewMaterialData({...newMaterialData, file: e.target.value as any})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                                ) : (
                                  <input required type="file" onChange={e => setNewMaterialData({...newMaterialData, file: e.target.files?.[0] || null})} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-brand)] file:text-white hover:file:bg-red-700" />
                                )}`;
const replaceInput = `{newMaterialData.type === 'VIDEO_YOUTUBE' ? (
                                  <input required type="text" placeholder="Paste YouTube Link here..." value={newMaterialData.file as any || ''} onChange={e => setNewMaterialData({...newMaterialData, file: e.target.value as any})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
                                ) : (
                                  <input required type="file" onChange={e => setNewMaterialData({...newMaterialData, file: e.target.files?.[0] || null})} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[var(--color-brand)] file:text-white hover:file:bg-red-700" />
                                )}`;
code = code.replace(targetInput, replaceInput);

const targetUpload = `const publicUrl = newMaterialData.type === 'VIDEO' ? (newMaterialData.file as any) : await uploadFile(newMaterialData.file as File);`;
const replaceUpload = `const publicUrl = newMaterialData.type === 'VIDEO_YOUTUBE' ? (newMaterialData.file as any) : await uploadFile(newMaterialData.file as File);
        const finalType = newMaterialData.type === 'VIDEO_YOUTUBE' ? 'VIDEO' : newMaterialData.type;`;
code = code.replace(targetUpload, replaceUpload);

const targetInsert = `material_type: newMaterialData.type,`;
const replaceInsert = `material_type: finalType,`;
code = code.replace(targetInsert, replaceInsert);

fs.writeFileSync('src/pages/admin/AdminCourseBuilder.tsx', code);
