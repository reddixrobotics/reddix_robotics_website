/**
 * Navbar — Reddix Robotics
 *
 * Desktop:  Logo | Nav links | Login button | Theme toggle
 * Mobile:   Logo | Theme toggle | Hamburger → animated right-side drawer
 *
 * Features:
 * - Sticky, transparent over hero → solid/frosted after scroll
 * - Framer Motion drawer with staggered nav items
 * - Full a11y: focus trap, Escape key, scroll lock, aria-* attributes
 * - Touch-friendly tap targets (≥ 44 × 44 px)
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  memo,
} from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { useScrolled, useTheme } from '@/hooks';
import { NAV_LINKS, AUTH_LINKS, BRAND_NAME } from '@/data';
import { ROUTES } from '@/routes/routePaths';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/utils';


// ─── Animation variants ───────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, damping: 28, stiffness: 260 },
  },
  exit: {
    x: '100%',
    transition: { type: 'tween' as const, duration: 0.25, ease: [0.4, 0, 0.6, 1] },
  },
};

// Stagger container for drawer nav items
const drawerNavVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.12 },
  },
};

const drawerItemVariants = {
  hidden: { x: 18, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
};

// Hamburger icon swap
const iconVariants = {
  initial: { rotate: -45, scale: 0.6, opacity: 0 },
  animate: { rotate: 0, scale: 1, opacity: 1, transition: { duration: 0.15 } },
  exit: { rotate: 45, scale: 0.6, opacity: 0, transition: { duration: 0.12 } },
};

// ─── Brand logo ───────────────────────────────────────────────────────────────

function NavLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label={`${BRAND_NAME} — return to home`}
      className={cn(
        'focus-ring flex items-center gap-2.5 rounded-sm select-none',
        'group',
      )}
    >
      <img src="/logo.png" alt="Reddix Robotics Logo" className="h-12 w-auto object-contain transition-transform duration-150 group-hover:scale-95" />
    </Link>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────

function DesktopNavLink({
  href,
  label,
  end = false,
}: {
  href: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={href}
      end={end}
      className={({ isActive }) =>
        cn(
          'relative px-3 py-1.5 text-[0.8125rem] font-medium',
          'rounded transition-colors duration-[var(--duration-base)]',
          'focus-ring',
          // Underline indicator
          'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px]',
          'after:rounded-full after:transition-all after:duration-200',
          isActive
            ? [
                'text-[var(--color-brand)]',
                'after:bg-[var(--color-brand)] after:opacity-100',
              ]
            : [
                'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                'hover:bg-[var(--bg-tertiary)]',
                'after:bg-[var(--color-brand)] after:opacity-0 hover:after:opacity-30',
              ],
        )
      }
    >
      {label}
    </NavLink>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  shouldReduceMotion: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  logout: () => void;
}

const MobileDrawer = memo(function MobileDrawer({ 
  open, 
  onClose, 
  shouldReduceMotion, 
  isAuthenticated, 
  userRole, 
  logout 
}: MobileDrawerProps) {
  const drawerRef  = useRef<HTMLDivElement>(null);
  const closeRef   = useRef<HTMLButtonElement>(null);

  // ── Focus trap + Escape key ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const panel = drawerRef.current;
    if (!panel) return;

    const FOCUSABLE = [
      'a[href]:not([tabindex="-1"])',
      'button:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const getFocusable = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));

    // Move focus into the drawer
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last  = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(raf);
    };
  }, [open, onClose]);

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top      = `-${scrollY}px`;
      document.body.style.width    = '100%';
    } else {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
    };
  }, [open]);

  const reducedOverlay  = shouldReduceMotion ? {} : overlayVariants;
  const reducedDrawer   = shouldReduceMotion ? {} : drawerVariants;
  const reducedNav      = shouldReduceMotion ? {} : drawerNavVariants;
  const reducedItem     = shouldReduceMotion ? {} : drawerItemVariants;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* ── Overlay ─────────────────────────────────────────── */}
          <motion.div
            key="overlay"
            aria-hidden="true"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={reducedOverlay}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className={cn(
              'fixed inset-0 z-[48]',
              'bg-[var(--bg-overlay)]',
              'cursor-pointer',
            )}
          />

          {/* ── Drawer panel ────────────────────────────────────── */}
          <motion.div
            key="drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={reducedDrawer}
            className={cn(
              'fixed right-0 top-0 z-[49] h-[100dvh]',
              'w-full max-w-[20rem] sm:max-w-[22rem]',
              'flex flex-col',
              'bg-[var(--surface-card)]',
              'border-l border-[var(--border-primary)]',
              'shadow-xl',
              'overflow-y-auto overflow-x-hidden',
            )}
          >
            {/* ── Drawer header ──────────────────────────────────── */}
            <div
              className={cn(
                'flex items-center justify-between',
                'px-5 py-4',
                'border-b border-[var(--border-subtle)]',
                'sticky top-0 z-10 bg-[var(--surface-card)]',
              )}
            >
              <NavLogo onClick={onClose} />

              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className={cn(
                  'btn btn-ghost btn-icon btn-md focus-ring',
                  'ml-2 shrink-0',
                )}
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            {/* ── Nav links ──────────────────────────────────────── */}
            <motion.nav
              aria-label="Mobile navigation"
              initial="hidden"
              animate="visible"
              variants={reducedNav}
              className="flex flex-col px-3 pt-4 pb-2"
            >
              <p className="text-label px-3 mb-2">Navigation</p>

              {NAV_LINKS.map((item) => (
                <motion.div key={item.href} variants={reducedItem}>
                  <NavLink
                    to={item.href}
                    end={item.href === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center w-full px-3 py-3',
                        'rounded-lg text-[0.9375rem] font-medium',
                        'transition-colors duration-[var(--duration-base)]',
                        'focus-ring',
                        'min-h-[44px]', // touch target
                        isActive
                          ? 'text-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>

            {/* ── Separator ──────────────────────────────────────── */}
            <div className="mx-6 my-1 separator" aria-hidden="true" />

            {/* ── Drawer footer — Login/CTA ──────────────────────── */}
            <div className="mt-8 flex flex-col gap-3 px-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to={userRole === 'USER' ? ROUTES.DASHBOARD : ROUTES.ADMIN}
                    className="btn btn-ghost w-full justify-center"
                    onClick={onClose}
                  >
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); onClose(); }}
                    className="btn btn-primary w-full justify-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={AUTH_LINKS.login.href}
                    className="btn btn-ghost w-full justify-center"
                    onClick={onClose}
                  >
                    Login
                  </Link>
                  <Link
                    to={AUTH_LINKS.signup.href}
                    className="btn btn-primary w-full justify-center shadow-lg shadow-brand/20"
                    onClick={onClose}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* ── Theme toggle row ────────────────────────────────── */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={reducedNav}
              className="px-3 py-3 mt-auto"
            >
              <motion.div variants={reducedItem}>
                <div
                  className={cn(
                    'flex items-center justify-between',
                    'px-3 py-2.5 rounded-lg',
                    'bg-[var(--bg-tertiary)]',
                  )}
                >
                  <span className="text-[0.875rem] font-medium text-[var(--text-secondary)]">
                    Appearance
                  </span>
                  <ThemeToggle showLabel />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Bottom spacer (for safe area) ───────────────────── */}
            <div className="px-5 pb-6 pt-2">
              <p className="text-caption text-center text-[var(--text-muted)]">
                Reddix Robotics © {new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// ─── Hamburger button ─────────────────────────────────────────────────────────

function HamburgerButtonInner(
  {
    open,
    onClick,
    shouldReduceMotion,
  }: {
    open: boolean;
    onClick: () => void;
    shouldReduceMotion: boolean;
  },
  ref: React.Ref<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={open}
      aria-controls="mobile-drawer"
      className={cn(
        'btn btn-ghost btn-icon btn-md focus-ring md:hidden',
        'relative overflow-hidden',
        'min-w-[44px] min-h-[44px]', // touch target
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span
            key="close"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : iconVariants.initial}
            animate={shouldReduceMotion ? {} : iconVariants.animate}
            exit={shouldReduceMotion ? {} : iconVariants.exit}
            className="flex items-center justify-center"
          >
            <X size={22} />
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            aria-hidden="true"
            initial={shouldReduceMotion ? false : iconVariants.initial}
            animate={shouldReduceMotion ? {} : iconVariants.animate}
            exit={shouldReduceMotion ? {} : iconVariants.exit}
            className="flex items-center justify-center"
          >
            <Menu size={22} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}


const HamburgerButton = forwardRef<
  HTMLButtonElement,
  { open: boolean; onClick: () => void; shouldReduceMotion: boolean }
>(HamburgerButtonInner);

HamburgerButton.displayName = 'HamburgerButton';

// ─── Main Navbar ─────────────────────────────────────────────────────────────


export default function Navbar() {
  const scrolled            = useScrolled(60);
  const { isDark }          = useTheme();
  const shouldReduceMotion  = useReducedMotion() ?? false;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hamburgerRef        = useRef<HTMLButtonElement>(null);
  
  const { isAuthenticated, userRole, logout } = useAuth();

  // Return focus to hamburger after close
  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    // Small delay to allow exit animation to start before focus shift
    setTimeout(() => hamburgerRef.current?.focus(), 50);
  }, []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);

  const handleHamburgerClick = useCallback(() => {
    if (drawerOpen) closeDrawer();
    else openDrawer();
  }, [drawerOpen, closeDrawer, openDrawer]);

  // Close drawer on route change (window popstate)
  useEffect(() => {
    const handleRouteChange = () => setDrawerOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // ── Scroll-based navbar appearance ───────────────────────────────────────

  const bgScrolled    = isDark ? 'rgba(13, 13, 12, 0.92)' : 'rgba(255, 255, 255, 0.92)';
  const bgTransparent = 'transparent';

  return (
    <>
      {/* Skip-to-content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 'var(--header-height)',
          backgroundColor: scrolled ? bgScrolled : bgTransparent,
          backdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
          borderBottom: scrolled
            ? '1px solid var(--border-primary)'
            : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
          transition: [
            'background-color 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            'backdrop-filter 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            '-webkit-backdrop-filter 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            'border-color 300ms cubic-bezier(0.16, 1, 0.3, 1)',
            'box-shadow 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          ].join(', '),
        }}
      >
        <div className="container-content flex h-full items-center justify-between gap-4">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <NavLogo />

          {/* ── Desktop navigation links ─────────────────────────── */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-0.5 md:flex"
          >
            {NAV_LINKS.map((item) => (
              <DesktopNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                end={item.href === '/'}
              />
            ))}
          </nav>

          {/* ── Desktop right actions ─────────────────────────────── */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link
                  to={userRole === 'USER' ? ROUTES.DASHBOARD : ROUTES.ADMIN}
                  className={cn(
                    'btn btn-ghost btn-sm focus-ring',
                    'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  )}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-primary btn-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={AUTH_LINKS.login.href}
                  className={cn(
                    'btn btn-ghost btn-sm focus-ring',
                    'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                  )}
                >
                  Login
                </Link>
                <Link
                  to={AUTH_LINKS.signup.href}
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile controls ───────────────────────────────────── */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <HamburgerButton
              ref={hamburgerRef}
              open={drawerOpen}
              onClick={handleHamburgerClick}
              shouldReduceMotion={shouldReduceMotion}
            />
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────── */}
      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        shouldReduceMotion={shouldReduceMotion}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        logout={logout}
      />
    </>
  );
}
