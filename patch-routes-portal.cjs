const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

const importStr = `const PortalLayout = lazy(() => import('@/features/portal/components/PortalLayout'));\nconst StudentDashboard = lazy(() => import('@/features/portal/components/StudentDashboard'));\n\nconst AdminOverview =`;
code = code.replace(/const AdminOverview =/, importStr);

const portalRoute = `    {
      path: ROUTES.PORTAL,
      element: <RoleGuard allowedRoles={['USER']} />,
      children: [
        {
          element: withSuspense(PortalLayout),
          children: [
            { index: true, element: withSuspense(StudentDashboard) },
          ],
        }
      ]
    },
    {
      path: ROUTES.ADMIN,`;

code = code.replace(/    \{\s*path: ROUTES\.ADMIN,/, portalRoute);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
