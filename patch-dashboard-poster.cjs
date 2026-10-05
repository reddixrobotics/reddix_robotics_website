const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', 'utf8');

code = code.replace(`image_url`, `posterUrl`);
code = code.replace(`src={c.image_url}`, `src={c.posterUrl}`);

fs.writeFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', code);
