const fs = require('fs');
let code = fs.readFileSync('src/features/auth/components/LoginForm.tsx', 'utf8');

code = code.replace(
  /navigate\(ROUTES\.PROFILE\);/g,
  'navigate(ROUTES.PORTAL);'
);

fs.writeFileSync('src/features/auth/components/LoginForm.tsx', code);
