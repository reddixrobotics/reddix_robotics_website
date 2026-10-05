const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/admin/AdminCourseBuilder.tsx', 'utf8');

code = code.replace(
  `supabase.from('Workshop').select('id, title').order('created_at', { ascending: false })`,
  `supabase.from('Workshop').select('id, title')`
);

fs.writeFileSync('frontend/src/pages/admin/AdminCourseBuilder.tsx', code);
