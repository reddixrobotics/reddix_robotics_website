const fs = require('fs');
let code = fs.readFileSync('src/features/portal/components/SecureVideoPlayer.tsx', 'utf8');

// I will add a tiny debug log on the screen so I can literally see the URL and the type
code = code.replace(
  `{user?.email || 'Reddix Robotics'}`,
  `{user?.email || 'Reddix Robotics'} {url}`
);

fs.writeFileSync('src/features/portal/components/SecureVideoPlayer.tsx', code);
