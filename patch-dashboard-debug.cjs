const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', 'utf8');

code = code.replace(
  `console.error('Failed to load enrollments:', err);`,
  `console.error('Failed to load enrollments:', err);\n        alert('Error loading enrollments: ' + err.message);`
);

code = code.replace(
  `const enrolledCourses = enrollments?.map((e: any) => ({ ...e.Workshop, course_id: e.course_id })) || [];`,
  `console.log("Raw Enrollments from DB:", enrollments);\n        const enrolledCourses = enrollments?.filter((e: any) => e.Workshop).map((e: any) => ({ ...e.Workshop, course_id: e.course_id })) || [];`
);

fs.writeFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', code);
