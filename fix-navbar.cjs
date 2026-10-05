const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/layout/Navbar.tsx', 'utf8');

const errorBlock = `                </Link>\r\n              )}\r\n              <ThemeToggle />`;
const fixedBlock = `                </Link>\r\n                </>\r\n              )}\r\n              <ThemeToggle />`;

code = code.replace(/                <\/Link>\r?\n              \)\}\r?\n              <ThemeToggle \/>/g, "                </Link>\n                </>\n              )}\n              <ThemeToggle />");

fs.writeFileSync('frontend/src/components/layout/Navbar.tsx', code);
