const fs = require('fs');

// OpportunitiesSection.tsx
let opp = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

// 1. Modify Card opening tag and image wrapper
opp = opp.replace(
  /<Card className="flex flex-col h-full w-full overflow-hidden border-\[var\(--border-strong\)\] hover:border-\[var\(--color-brand\)\] hover:shadow-xl transition-all duration-300 group bg-\[var\(--bg-secondary\)\]">/g, 
  '<Card className="flex flex-col h-full w-full border-[var(--border-strong)] hover:border-[var(--color-brand)] hover:shadow-xl transition-all duration-300 group bg-[var(--bg-secondary)] p-3 rounded-xl">'
);

// 2. Add rounded corners to the image container
opp = opp.replace(
  /<div className="w-full aspect-video bg-\[var\(--bg-tertiary\)\] overflow-hidden">/g,
  '<div className="relative w-full aspect-video bg-[var(--bg-tertiary)] overflow-hidden rounded-lg">'
);

// 3. Adjust text padding
opp = opp.replace(
  /<div className="flex flex-col flex-grow p-6">/g,
  '<div className="flex flex-col flex-grow pt-4 px-1 pb-2">'
);

fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', opp);

// WorkshopsSection.tsx
let home = fs.readFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', 'utf8');

home = home.replace(
  /<Card className="flex flex-col h-full w-full overflow-hidden border-\[var\(--border-strong\)\] hover:border-\[var\(--color-brand\)\] hover:shadow-xl transition-all duration-300 group bg-\[var\(--bg-secondary\)\]">/g,
  '<Card className="flex flex-col h-full w-full border-[var(--border-strong)] hover:border-[var(--color-brand)] hover:shadow-xl transition-all duration-300 group bg-[var(--bg-secondary)] p-3 rounded-xl">'
);

home = home.replace(
  /<div className="relative h-56 w-full overflow-hidden bg-\[var\(--bg-tertiary\)\]">/g,
  '<div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-tertiary)] rounded-lg">'
);
home = home.replace(
  /<div className="relative aspect-video w-full overflow-hidden bg-\[var\(--bg-tertiary\)\] flex items-center justify-center">/g,
  '<div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-tertiary)] rounded-lg">'
);

home = home.replace(
  /<div className="flex flex-col flex-grow p-6">/g,
  '<div className="flex flex-col flex-grow pt-4 px-1 pb-2">'
);

fs.writeFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', home);
