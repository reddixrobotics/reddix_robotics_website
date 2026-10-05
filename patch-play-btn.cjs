const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/SecureVideoPlayer.tsx', 'utf8');

code = code.replace(`{!playing && isReady && (`, `{!playing && (`);

fs.writeFileSync('frontend/src/features/portal/components/SecureVideoPlayer.tsx', code);
