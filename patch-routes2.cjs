const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

const target1 = `const StudentDashboard = lazy(() => import('@/features/portal/components/StudentDashboard'));`;
const replacement1 = `const StudentDashboard = lazy(() => import('@/features/portal/components/StudentDashboard'));\nconst CoursePlayer = lazy(() => import('@/features/portal/pages/CoursePlayer'));`;

code = code.replace(target1, replacement1);

const target2 = `{ index: true, element: withSuspense(StudentDashboard) },`;
const replacement2 = `{ index: true, element: withSuspense(StudentDashboard) },\n          { path: 'course/:courseId', element: withSuspense(CoursePlayer) },`;

code = code.replace(target2, replacement2);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
