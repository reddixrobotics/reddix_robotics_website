const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

code = code.replace(
  /const navLinks = useMemo\(\(\) => \{[\s\S]*?return NAV_LINKS;\n  \}, \[userRole\]\);/m,
  'const navLinks = NAV_LINKS;'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', code);
console.log("Patched navLinks successfully");
