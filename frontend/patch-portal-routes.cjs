const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

const importTarget = `const CoursePlayer = lazy(() => import('@/features/portal/pages/CoursePlayer'));`;
const importReplace = `const CoursePlayer = lazy(() => import('@/features/portal/pages/CoursePlayer'));\nconst PortalAccount = lazy(() => import('@/features/portal/pages/PortalAccount'));`;
code = code.replace(importTarget, importReplace);

const routeTarget = `{ path: 'courses/:courseId', element: withSuspense(CoursePlayer) },`;
const routeReplace = `{ path: 'courses/:courseId', element: withSuspense(CoursePlayer) },\n          { path: 'account', element: withSuspense(PortalAccount) },`;
code = code.replace(routeTarget, routeReplace);

fs.writeFileSync('src/routes/index.tsx', code);
