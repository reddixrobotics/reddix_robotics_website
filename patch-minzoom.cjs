const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/admin/components/ui/ImageCropperModal.tsx', 'utf8');

code = code.replace(
  /<Cropper\s+image=\{localImageSrc\}/g,
  '<Cropper\n          image={localImageSrc}\n          minZoom={0.1}'
);

fs.writeFileSync('frontend/src/features/admin/components/ui/ImageCropperModal.tsx', code);
