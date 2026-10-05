const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/admin/components/forms/WorkshopForm.tsx', 'utf8');

code = code.replace(
  /<ImageCropperModal/g,
  '<ImageCropperModal isOpen={true}'
);

fs.writeFileSync('frontend/src/features/admin/components/forms/WorkshopForm.tsx', code);
