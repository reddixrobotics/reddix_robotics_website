const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/admin/services/apiService.ts', 'utf8');

code = code.replace(/status: item\.status \|\| 'PUBLISHED',\s*capacity: 50,\s*status: 'PUBLISHED',/g, "status: item.status || 'PUBLISHED',\n        capacity: 50,");

fs.writeFileSync('frontend/src/features/admin/services/apiService.ts', code);
