const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

const importTarget = `const AdminLMS = lazy(() => import('@/pages/admin/AdminLMS'));`;
const importReplace = `const AdminLMS = lazy(() => import('@/pages/admin/AdminLMS'));\nconst AdminCourseBuilder = lazy(() => import('@/pages/admin/AdminCourseBuilder'));`;
code = code.replace(importTarget, importReplace);

const routeTarget = `{ path: 'lms', element: withSuspense(AdminLMS) },`;
const routeReplace = `{ path: 'lms', element: withSuspense(AdminLMS) },\n          { path: 'course-builder', element: withSuspense(AdminCourseBuilder) },`;
code = code.replace(routeTarget, routeReplace);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
