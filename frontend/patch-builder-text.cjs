const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/AdminCourseBuilder.tsx', 'utf8');

code = code.replace(
  `<option value="PDF">Document (PDF)</option>`,
  `<option value="PDF">Document (PDF / PowerPoint)</option>`
);

fs.writeFileSync('src/pages/admin/AdminCourseBuilder.tsx', code);
