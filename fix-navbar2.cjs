const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/layout/Navbar.tsx', 'utf8');

const target = `                  <User size={20} />
                </Link>
              )}
              <ThemeToggle />`;
              
const replacement = `                  <User size={20} />
                </Link>
                </>
              )}
              <ThemeToggle />`;

code = code.replace(target, replacement);

// Fallback in case of line endings
const target2 = `                  <User size={20} />\r\n                </Link>\r\n              )}\r\n              <ThemeToggle />`;
code = code.replace(target2, replacement);

const target3 = `                  <User size={20} />\n                </Link>\n              )}\n              <ThemeToggle />`;
code = code.replace(target3, replacement);

fs.writeFileSync('frontend/src/components/layout/Navbar.tsx', code);
