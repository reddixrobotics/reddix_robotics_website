const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

code = code.replace(/element: <PortalLayout \/>/, 'element: withSuspense(PortalLayout)');
code = code.replace(/element: <StudentDashboard \/>/, 'element: withSuspense(StudentDashboard)');

fs.writeFileSync('frontend/src/routes/index.tsx', code);
