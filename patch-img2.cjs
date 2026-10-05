const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', 'utf8');

const regex = /<img\s*src=\{workshop\.posterUrl\}\s*alt=\{workshop\.title\}\s*className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"\s*\/>/g;
const newStr = `<img 
                          src={workshop.posterUrl} 
                          alt={workshop.title} 
                          className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
                        />`;
code = code.replace(regex, newStr);

const regex2 = /<div className="relative h-56 w-full overflow-hidden bg-\[var\(--bg-tertiary\)\]">/g;
const newStr2 = `<div className="relative aspect-video w-full overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">`;
code = code.replace(regex2, newStr2);

fs.writeFileSync('frontend/src/features/home/components/WorkshopsSection.tsx', code);
