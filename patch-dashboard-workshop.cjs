const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', 'utf8');

const targetSelect = `.select(\`
            id,
            status,
            course_id,
            Course (
              id,
              title,
              description,
              thumbnail_url
            )
          \`)`;

code = code.replace(
  `.select(\`
            id,
            status,
            Course (
              id,
              title,
              description,
              thumbnail_url
            )
          \`)`,
  `.select(\`
            id,
            status,
            course_id,
            Workshop (
              id,
              title,
              description,
              image_url
            )
          \`)`
);

code = code.replace(`const enrolledCourses = enrollments?.map((e: any) => e.Course) || [];`, `const enrolledCourses = enrollments?.map((e: any) => ({ ...e.Workshop, course_id: e.course_id })) || [];`);
code = code.replace(`c.thumbnail_url`, `c.image_url`);
code = code.replace(`src={c.thumbnail_url}`, `src={c.image_url}`);

fs.writeFileSync('frontend/src/features/portal/components/StudentDashboard.tsx', code);
