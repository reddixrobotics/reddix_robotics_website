const fs = require('fs');
let code = fs.readFileSync('src/features/portal/components/PortalLayout.tsx', 'utf8');

// Replace LMS logo pointing to Home -> Point to Portal
code = code.replace(
  `<Link to={ROUTES.HOME} className="flex items-center gap-2">`,
  `<Link to={ROUTES.PORTAL} className="flex items-center gap-2">`
);

// Replace Account linking to Public Profile -> Point to Portal Account
code = code.replace(
  `<Link to={ROUTES.PROFILE} className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] font-medium transition-all whitespace-nowrap">`,
  `<Link to="/portal/account" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--surface-tertiary)] hover:text-[var(--text-primary)] font-medium transition-all whitespace-nowrap">`
);

fs.writeFileSync('src/features/portal/components/PortalLayout.tsx', code);
