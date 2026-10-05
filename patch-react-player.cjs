const fs = require('fs');
let code = fs.readFileSync('frontend/src/features/portal/components/SecureVideoPlayer.tsx', 'utf8');

code = code.replace(`import ReactPlayer from 'react-player/youtube';`, `import ReactPlayer from 'react-player';`);

fs.writeFileSync('frontend/src/features/portal/components/SecureVideoPlayer.tsx', code);
