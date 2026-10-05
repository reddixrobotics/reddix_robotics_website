const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminLMS.tsx', 'utf8');

const targetStr = `<input type="text" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" />`;

const replacementStr = `<div className="flex gap-2">
                <input type="text" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-strong)] text-[var(--text-primary)] focus:border-[var(--color-brand)] outline-none" />
                <button type="button" onClick={() => setPassword(generatePassword())} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-lg hover:bg-[var(--surface-hover)] text-sm font-medium transition-colors" title="Generate New Password">
                  Regenerate
                </button>
              </div>`;

code = code.replace(targetStr, replacementStr);

fs.writeFileSync('frontend/src/pages/admin/AdminLMS.tsx', code);
