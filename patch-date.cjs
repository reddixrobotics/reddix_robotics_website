const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

const regex = /<div className="space-y-2 mb-6 text-body-sm text-\[var\(--text-tertiary\)\]">\s*<div className="flex items-center gap-2"><Calendar size=\{16\} \/> \{new\s*Date\(workshop\.date\)\.toLocaleDateString\('en-IN', \{month: 'short', day: 'numeric', year: 'numeric'\}\)\} \(\{workshop\.duration\}\)<\/div>/g;

const newStr = `<div className="space-y-2 mb-6 text-body-sm text-[var(--text-tertiary)]">
                          {workshop.status === 'COMING_SOON' ? (
                            <div className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                              <Calendar size={16} className="text-[var(--color-brand)]" /> Coming Soon ({workshop.duration})
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} /> {new Date(workshop.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric', year: 'numeric'})} ({workshop.duration})
                            </div>
                          )}`;

code = code.replace(regex, newStr);
fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', code);
