const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminLMS.tsx', 'utf8');

code = code.replace(`await supabase.from('Course').select('*');`, `await supabase.from('Workshop').select('*');`);
code = code.replace(`Assign Course (Optional)`, `Assign Workshop (Optional)`);
code = code.replace(`<th>Course Enrolled</th>`, `<th>Workshop Enrolled</th>`);

fs.writeFileSync('frontend/src/pages/admin/AdminLMS.tsx', code);
