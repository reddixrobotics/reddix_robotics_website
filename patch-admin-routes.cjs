const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

const importStr = `const AdminAdmins = lazy(() => import('@/pages/admin/AdminAdmins'));\nconst AdminLMS = lazy(() => import('@/pages/admin/AdminLMS'));`;
code = code.replace(/const AdminAdmins = lazy\(\(\) => import\('@\/pages\/admin\/AdminAdmins'\)\);/, importStr);

const routeStr = `{ path: 'users', element: withSuspense(AdminUsers) },\n            { path: 'lms', element: withSuspense(AdminLMS) },`;
code = code.replace(/\{ path: 'users', element: withSuspense\(AdminUsers\) \},/, routeStr);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
