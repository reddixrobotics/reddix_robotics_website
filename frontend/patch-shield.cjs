const fs = require('fs');
let code = fs.readFileSync('src/features/portal/components/SecureDocumentViewer.tsx', 'utf8');

const targetStr = `<div className="absolute top-0 right-0 w-64 h-20 bg-transparent z-40"></div>`;
const replaceStr = `<div className="absolute top-0 right-0 w-64 h-20 bg-transparent z-40"></div>
          {/* Invisible shield over the bottom bar to block Full Screen / Download buttons */}
          <div className="absolute bottom-0 left-0 w-full h-16 bg-transparent z-40"></div>
          {/* Shield right edge scrollbar area just in case there are popouts there */}
          <div className="absolute bottom-16 right-0 w-16 h-32 bg-transparent z-40"></div>`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/features/portal/components/SecureDocumentViewer.tsx', code);
