const fs = require('fs');
let code = fs.readFileSync('frontend/src/routes/index.tsx', 'utf8');

code = code.replace(
  `{ path: 'course/:courseId', element: withSuspense(CoursePlayer) }`,
  `{ path: 'courses/:courseId', element: withSuspense(CoursePlayer) }`
);

fs.writeFileSync('frontend/src/routes/index.tsx', code);
