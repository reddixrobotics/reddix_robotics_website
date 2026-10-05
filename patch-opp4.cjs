const fs = require('fs');
let opp = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

opp = opp.replace(
  /<Card key=\{workshop\.id\} className="p-0 overflow-hidden border-\[var\(--border-strong\)\] flex flex-col">/g,
  '<Card key={workshop.id} className="border-[var(--border-strong)] hover:border-[var(--color-brand)] transition-colors p-3 rounded-xl flex flex-col">'
);

fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', opp);
