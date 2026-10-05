const fs = require('fs');

let sidebarCode = fs.readFileSync('src/layouts/AdminSidebar.tsx', 'utf8');
sidebarCode = sidebarCode.replace(
  `{ path: ROUTES.ADMIN_MESSAGES, label: 'Messages', icon: <MessageSquare size={18} /> },`,
  `{ path: ROUTES.ADMIN_MESSAGES, label: 'Messages', icon: <MessageSquare size={18} /> },\n    { path: '/admin/doubts', label: 'Student Q&A', icon: <MessageSquare size={18} /> },`
);
fs.writeFileSync('src/layouts/AdminSidebar.tsx', sidebarCode);
