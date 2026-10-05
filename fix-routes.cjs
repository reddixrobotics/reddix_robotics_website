const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

// Fix duplicates
code = code.replace(/const PortalLayout = lazy\(\(\) => import\('@\/features\/portal\/components\/PortalLayout'\)\);\nconst StudentDashboard = lazy\(\(\) => import\('@\/features\/portal\/components\/StudentDashboard'\)\);\n/g, '');
code = code.replace(/const AdminOverview =/, "const PortalLayout = lazy(() => import('@/features/portal/components/PortalLayout'));\nconst StudentDashboard = lazy(() => import('@/features/portal/components/StudentDashboard'));\n\nconst AdminOverview =");

// Fix Route Insertion
const portalRoute = `  {
    path: ROUTES.PORTAL,
    element: <RoleGuard allowedRoles={['USER']} />,
    children: [
      {
        element: <PortalLayout />,
        children: [
          { index: true, element: <StudentDashboard /> },
        ],
      }
    ]
  },
  {
    path: ROUTES.ADMIN,`;

code = code.replace(/  \{\n    path: ROUTES\.ADMIN,/g, portalRoute);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
