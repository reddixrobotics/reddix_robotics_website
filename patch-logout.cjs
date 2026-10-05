const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/PortalLayout.tsx', 'utf8');

code = code.replace(`const { user, signOut, loading } = useAuth();`, `const { user, logout, loading } = useAuth();`);
code = code.replace(`onClick={signOut}`, `onClick={logout}`);

fs.writeFileSync('frontend/src/features/portal/components/PortalLayout.tsx', code);
