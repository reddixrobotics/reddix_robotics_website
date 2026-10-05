const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', 'utf8');

code = code.replace(/course\.thumbnail_url/g, "course.posterUrl");

fs.writeFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', code);
