const fs = require('fs');

// Revert OpportunitiesSection.tsx
let opp = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');
opp = opp.replace(/className="w-full aspect-video bg-\[var\(--bg-tertiary\)\] flex items-center justify-center p-2"/g, 'className="w-full aspect-video bg-[var(--bg-tertiary)] overflow-hidden"');
opp = opp.replace(/className="w-full h-full object-contain rounded-sm"/g, 'className="w-full h-full object-cover"');
fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', opp);

// Revert WorkshopsSection.tsx
let home = fs.readFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', 'utf8');
home = home.replace(/className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"/g, 'className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"');
fs.writeFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', home);
