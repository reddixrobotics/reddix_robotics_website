const fs = require('fs');

// 1. Remove from Navbar
let navbar = fs.readFileSync('frontend/src/components/layout/Navbar.tsx', 'utf8');
navbar = navbar.replace(/<Link[^>]*to=\{ROUTES\.SIGNUP\}[^>]*>[\s\S]*?<\/Link>/g, '');
fs.writeFileSync('frontend/src/components/layout/Navbar.tsx', navbar);

// 2. Remove from LoginForm
let login = fs.readFileSync('frontend/src/features/auth/components/LoginForm.tsx', 'utf8');
login = login.replace(/<p className="text-center text-sm text-\[var\(--text-secondary\)\] mt-6">[\s\S]*?<\/p>/, '');
fs.writeFileSync('frontend/src/features/auth/components/LoginForm.tsx', login);

// 3. Redirect /signup in routes
let routes = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');
routes = routes.replace(/\{ path: ROUTES\.SIGNUP,       element: withSuspense\(SignupPage\) \},/, "{ path: ROUTES.SIGNUP,       element: <Navigate to={ROUTES.LOGIN} replace /> },");
routes = `import { Navigate } from 'react-router-dom';\n` + routes;
fs.writeFileSync('frontend/src/routes/index.tsx', routes);

