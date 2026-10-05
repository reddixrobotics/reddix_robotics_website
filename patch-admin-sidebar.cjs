const fs = require('fs');
let code = fs.readFileSync('frontend/src/layouts/AdminSidebar.tsx', 'utf8');

const targetStr = `{ name: 'LMS Portal', href: '/admin/lms', icon: BookOpen },`;
const replaceStr = `{ name: 'LMS Provisioning', href: '/admin/lms', icon: BookOpen },
  { name: 'Course Builder', href: '/admin/course-builder', icon: BookOpen },`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('frontend/src/layouts/AdminSidebar.tsx', code);
