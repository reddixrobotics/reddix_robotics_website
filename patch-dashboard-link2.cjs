const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', 'utf8');

code = code.replace(`import { Link } from 'react-router-dom';`, `import { Link, useNavigate } from 'react-router-dom';`);
code = code.replace(`const { user } = useAuth();`, `const { user } = useAuth();\n  const navigate = useNavigate();`);

fs.writeFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', code);
