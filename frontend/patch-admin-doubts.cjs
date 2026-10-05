const fs = require('fs');

let routesCode = fs.readFileSync('src/routes/index.tsx', 'utf8');
routesCode = routesCode.replace(
  `const AdminMessages = lazy(() => import('@/pages/admin/AdminMessages'));`,
  `const AdminMessages = lazy(() => import('@/pages/admin/AdminMessages'));\nconst AdminDoubts = lazy(() => import('@/pages/admin/AdminDoubts'));`
);
routesCode = routesCode.replace(
  `{ path: 'messages', element: withSuspense(AdminMessages) },`,
  `{ path: 'messages', element: withSuspense(AdminMessages) },\n          { path: 'doubts', element: withSuspense(AdminDoubts) },`
);
fs.writeFileSync('src/routes/index.tsx', routesCode);

let sidebarCode = fs.readFileSync('src/features/admin/components/AdminSidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  `{ path: ROUTES.ADMIN_MESSAGES, label: 'Messages', icon: <MessageSquare size={18} /> },`,
  `{ path: ROUTES.ADMIN_MESSAGES, label: 'Messages', icon: <MessageSquare size={18} /> },\n    { path: '/admin/doubts', label: 'Student Q&A', icon: <MessageSquare size={18} /> },`
);
fs.writeFileSync('src/features/admin/components/AdminSidebar.tsx', sidebarCode);
