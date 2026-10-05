const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/layout/Navbar.tsx', 'utf8');

// Add "My Courses" to desktop
const desktopActionsRegex = /<div className="hidden items-center gap-2 md:flex">\s*\{isAuthenticated && userRole === 'USER' && \(\s*<div className="flex items-center gap-1 mr-2">/;
const desktopReplacement = `<div className="hidden items-center gap-2 md:flex">
            {isAuthenticated && userRole === 'USER' && (
              <div className="flex items-center gap-1 mr-2">
                <Link to={ROUTES.PORTAL} className="flex items-center gap-2 px-3 py-1.5 mr-2 bg-[var(--color-brand)]/10 text-[var(--color-brand)] font-bold rounded-full hover:bg-[var(--color-brand)] hover:text-white transition-all text-sm">
                  My Courses
                </Link>`;

code = code.replace(desktopActionsRegex, desktopReplacement);

// Add "My Courses" to mobile
const mobileActionsRegex = /<div className="flex items-center gap-1 md:hidden">\s*\{isAuthenticated && userRole === 'USER' && \(\s*<Link\s*to=\{ROUTES\.PROFILE\}/;
const mobileReplacement = `<div className="flex items-center gap-1 md:hidden">
            {isAuthenticated && userRole === 'USER' && (
              <>
                <Link to={ROUTES.PORTAL} className="p-1 text-[var(--color-brand)] mr-1" aria-label="My Courses">
                  <span className="text-[10px] font-bold uppercase border border-[var(--color-brand)] px-2 py-0.5 rounded-full">Courses</span>
                </Link>
                <Link
                  to={ROUTES.PROFILE}`;

code = code.replace(mobileActionsRegex, mobileReplacement);

fs.writeFileSync('frontend/src/components/layout/Navbar.tsx', code);
