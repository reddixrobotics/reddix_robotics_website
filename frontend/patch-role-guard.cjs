const fs = require('fs');
let code = fs.readFileSync('src/routes/RoleGuard.tsx', 'utf8');

code = code.replace(
  `return <Navigate to={ROUTES.PROFILE} replace />;`,
  `return <Navigate to={ROUTES.PORTAL} replace />;`
);

fs.writeFileSync('src/routes/RoleGuard.tsx', code);
