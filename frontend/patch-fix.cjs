const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminCourseBuilder.tsx', 'utf8');

// The reason the previous replace failed was due to exact string matching on line breaks.
// Let's use robust regex to fix the select block and the input block.

code = code.replace(
  /<select value=\{newMaterialData\.type\}.*?<\/select>/s,
  `<select value={newMaterialData.type} onChange={e => setNewMaterialData({...newMaterialData, type: e.target.value, file: null})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none">
    <option value="VIDEO_YOUTUBE">YouTube Link</option>
    <option value="VIDEO">Upload MP4 Video (Direct)</option>
    <option value="PDF">Document (PDF / PowerPoint)</option>
  </select>`
);

code = code.replace(
  /\{newMaterialData\.type === 'VIDEO'.*?: \(/s,
  `{newMaterialData.type === 'VIDEO_YOUTUBE' ? (
    <input required type="text" placeholder="Paste YouTube Link here..." value={newMaterialData.file as any || ''} onChange={e => setNewMaterialData({...newMaterialData, file: e.target.value as any})} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--border-strong)] text-sm outline-none" />
  ) : (`
);

// Fix the default state in useState to be 'VIDEO_YOUTUBE' or 'VIDEO'
code = code.replace(
  `type: 'VIDEO', file: null as File | null, isUploading: false });`,
  `type: 'VIDEO_YOUTUBE', file: null as File | null | string, isUploading: false });`
);
code = code.replace(
  `type: 'VIDEO', file: null, isUploading: false }`,
  `type: 'VIDEO_YOUTUBE', file: null, isUploading: false }`
);

fs.writeFileSync('src/pages/admin/AdminCourseBuilder.tsx', code);
