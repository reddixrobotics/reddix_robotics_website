const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

const regex = /\{workshop\.status === 'COMING_SOON' \? \([\s\S]*?\)\s*:\s*\([\s\S]*?\}\)/g;
const newStr = `{workshop.status === 'COMING_SOON' ? (
                            <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                              <Calendar size={16} className="text-[var(--color-brand)]" /> Coming Soon {workshop.date ? \`- \${new Date(workshop.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', year: 'numeric'})}\` : ''} ({workshop.duration})
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} /> {workshop.date ? new Date(workshop.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Date TBD'} ({workshop.duration})
                            </div>
                          )}`;

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', code);
