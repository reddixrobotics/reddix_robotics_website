const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

const importTarget = `import StudentDashboard from '@/features/portal/pages/StudentDashboard';`;
const importReplace = `import StudentDashboard from '@/features/portal/pages/StudentDashboard';
import CoursePlayer from '@/features/portal/pages/CoursePlayer';`;

code = code.replace(importTarget, importReplace);

const routeTarget = `<Route index element={<StudentDashboard />} />`;
const routeReplace = `<Route index element={<StudentDashboard />} />
          <Route path="course/:courseId" element={<CoursePlayer />} />`;

code = code.replace(routeTarget, routeReplace);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
