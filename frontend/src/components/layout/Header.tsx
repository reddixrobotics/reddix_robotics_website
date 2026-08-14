import { useState, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useScrolled } from '@/hooks';
import { NAV_LINKS, BRAND_NAME } from '@/data';
import { ThemeToggle } from '@/components/ui';
import { cn } from '@/utils';

export default function Header() {
  const scrolled = useScrolled(60);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);

  return (
    <>
      {/* Skip-to-content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-modal transition-all duration-[250ms]',
          scrolled
            ? 'border-b border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm'
            : 'bg-transparent',
        )}
        style={{ height: 'var(--header-height)' }}
      >
        <div className="container-content flex h-full items-center justify-between gap-6">

          {/* ── Logo ──────────────────────────────────────── */}
          <Link
            to="/"
            className="focus-ring flex items-center gap-2 rounded-sm"
            aria-label={`${BRAND_NAME} — home`}
          >
            {/* Brand mark */}
            <span
              className="flex h-7 w-7 items-center justify-center rounded bg-[var(--color-brand)] text-sm font-bold text-white"
              aria-hidden="true"
            >
              R
            </span>
            <span
              className={cn(
                'font-display text-[1.0625rem] font-bold tracking-tight',
                'text-[var(--text-primary)]',
              )}
            >
              {BRAND_NAME}
            </span>
          </Link>

          {/* ── Desktop navigation ────────────────────────── */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-0.5 md:flex"
          >
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded px-3 py-1.5 text-[0.8125rem] font-medium',
                    'transition-colors duration-[var(--duration-base)]',
                    'focus-ring',
                    isActive
                      ? 'text-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop actions ───────────────────────────── */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link
              to="/contact"
              className="btn btn-primary btn-sm"
            >
              Get in Touch
            </Link>
          </div>

          {/* ── Mobile controls ───────────────────────────── */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-icon focus-ring"
              onClick={toggleMobile}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* ── Mobile navigation drawer ──────────────────── */}
        {mobileOpen && (
          <div
            id="mobile-nav"
            className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-lg md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <nav className="container-content flex flex-col gap-0.5 py-3">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    cn(
                      'rounded px-3 py-2.5 text-sm font-medium',
                      'transition-colors duration-[var(--duration-base)]',
                      isActive
                        ? 'text-[var(--color-brand)] bg-[var(--color-brand-subtle)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                onClick={closeMobile}
                className="btn btn-primary btn-md mt-2 w-full text-center"
              >
                Get in Touch
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
