const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', 'utf8');

const targetStr = `className="w-full mt-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-xl font-bold text-[var(--text-primary)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-all flex items-center justify-center gap-2 group"
                >`;
const replaceStr = `className="w-full mt-6 py-3 bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-xl font-bold text-[var(--text-primary)] hover:bg-[var(--color-brand)] hover:text-white hover:border-[var(--color-brand)] transition-all flex items-center justify-center gap-2 group"
                  onClick={() => navigate(\`/portal/course/\${e.course_id}\`)}
                >`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', code);
