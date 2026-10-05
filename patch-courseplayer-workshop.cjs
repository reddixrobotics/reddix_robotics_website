const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/pages/CoursePlayer.tsx', 'utf8');

code = code.replace(`supabase.from('Course')`, `supabase.from('Workshop')`);
code = code.replace(`eq('course_id', courseId)`, `eq('course_id', courseId)`); // Wait, module still uses course_id column, just points to workshop

fs.writeFileSync('frontend/src/features/portal/pages/CoursePlayer.tsx', code);
