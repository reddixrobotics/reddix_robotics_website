const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/layout/Navbar.tsx', 'utf8');

// Replace strict userRole === 'USER' with (!userRole || userRole === 'USER')
code = code.replace(/userRole === 'USER'/g, "(!userRole || userRole === 'USER')");

fs.writeFileSync('frontend/src/components/layout/Navbar.tsx', code);
