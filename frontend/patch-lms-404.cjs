const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf8');

const routeTarget = `{ path: 'account', element: withSuspense(PortalAccount) },`;
const routeReplace = `{ path: 'account', element: withSuspense(PortalAccount) },\n          { path: '*', element: <div className="p-10 text-center"><h2 className="text-2xl font-bold text-[var(--text-primary)]">LMS Page Not Found</h2></div> },`;
code = code.replace(routeTarget, routeReplace);

fs.writeFileSync('src/routes/index.tsx', code);
