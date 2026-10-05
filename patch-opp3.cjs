const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', 'utf8');

code = code.replace(/setWorkshops\(workshopsRes\.data\?\.length \? workshopsRes\.data : \[[\s\S]*?\]\);/, "setWorkshops(workshopsRes.data || []);");

fs.writeFileSync('frontend/src/features/careers/components/OpportunitiesSection.tsx', code);
