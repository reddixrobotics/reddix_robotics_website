const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminLMS.tsx', 'utf8');

// Fix text-white on inputs
code = code.replace(/text-white focus:border-/g, 'text-[var(--text-primary)] focus:border-');

// Fix h1 and h2 text colors that were hardcoded to text-white
code = code.replace(/text-3xl font-black text-white/g, 'text-3xl font-black text-[var(--text-primary)]');
code = code.replace(/text-xl font-bold text-white/g, 'text-xl font-bold text-[var(--text-primary)]');

fs.writeFileSync('frontend/src/pages/admin/AdminLMS.tsx', code);
