const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

const importStatement = `const DashboardApplications = lazy(() => import('@/pages/dashboard/DashboardApplications'));\nconst PortalLayout = lazy(() => import('@/features/portal/components/PortalLayout'));\nconst StudentDashboard = lazy(() => import('@/features/portal/components/StudentDashboard'));`;

code = code.replace(/const DashboardApplications = lazy\(\(\) => import\('@\/pages\/dashboard\/DashboardApplications'\)\);/, importStatement);

const routeStatement = `        {
          path: ROUTES.PORTAL,
          element: withSuspense(PortalLayout),
          children: [
            { index: true, element: withSuspense(StudentDashboard) },
            // Course viewer will go here later
          ],
        },`;

code = code.replace(/<Route element=\{<RootLayout \/>\}>/, `<Route element={<RootLayout />}>\n${routeStatement}`);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
