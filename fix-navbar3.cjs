const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/layout/Navbar.tsx', 'utf8');

const fixRegex = /<User size=\{20\} \/>\s*<\/Link>\s*\)\}\s*<ThemeToggle \/>/;
const fixed = `<User size={20} />\n              </Link>\n              </>\n            )}\n            <ThemeToggle />`;

code = code.replace(fixRegex, fixed);
fs.writeFileSync('frontend/src/components/layout/Navbar.tsx', code);
