const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', 'utf8');

const regex = /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">/g;

const replacement = `<div className={\`grid gap-8 mx-auto \${
          workshops.length === 1 ? 'grid-cols-1 max-w-md' :
          workshops.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl'
        }\`}>`;

code = code.replace(regex, replacement);

fs.writeFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', code);
