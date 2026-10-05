const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', 'utf8');

// 1. Remove the floating badge logic from the image wrapper entirely
const badgeRegex = /\{workshop\.status === 'COMING_SOON' \? \([\s\S]*?<\/div>\s*\)\}/g;
code = code.replace(badgeRegex, '');

// 2. Add the date info into the content block alongside clock and map pin
const contentRegex = /<div className="flex items-center text-xs text-\[var\(--text-secondary\)\] font-medium">\s*<Clock/;
const dateInfo = `{workshop.status === 'COMING_SOON' ? (
                          <div className="flex items-center text-xs text-[var(--text-primary)] font-medium mb-1">
                            <Calendar size={15} className="mr-2.5 text-[var(--color-brand)] shrink-0" />
                            <span className="truncate">Coming Soon {workshop.date ? \`- \${new Date(workshop.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}\` : ''}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium mb-1">
                            <Calendar size={15} className="mr-2.5 text-[var(--color-brand)] shrink-0" />
                            <span className="truncate">{workshop.date ? new Date(workshop.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Date TBA'}</span>
                          </div>
                        )}
                        <div className="flex items-center text-xs text-[var(--text-secondary)] font-medium">
                          <Clock`;

code = code.replace(contentRegex, dateInfo);

fs.writeFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', code);
