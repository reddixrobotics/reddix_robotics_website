/**
 * WorkshopNavbar — ROS 2 Industry Immersion
 * Mirrors the company site navbar exactly:
 * - Same logo, same frosted glass, same spring drawer
 * - Adds FAQ section and IntersectionObserver active highlighting
 */
import { useState, useEffect, useRef, useCallback, forwardRef, memo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfOHo7D9BNF0ZeL7CAQTIMxhq_XQyWgo6oczNFk3QNXi5ifxQ/viewform?usp=header';

const NAV_SECTIONS = [
  { label: 'Program', id: 'program' },
  { label: 'Kushi Robot', id: 'kushi-robot' },
  { label: 'Curriculum', id: 'curriculum' },
  { label: 'Experience', id: 'experience' },
  { label: 'FAQ', id: 'faq' },
];

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

// Animation variants (same as company Navbar.tsx)
const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring' as const, damping: 28, stiffness: 260 } },
  exit: { x: '100%', transition: { type: 'tween' as const, duration: 0.25, ease: [0.4, 0, 0.6, 1] } },
};
const drawerNavVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.1 } },
};
const drawerItemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } },
};
const iconVariants = {
  initial: { rotate: -45, scale: 0.6, opacity: 0 },
  animate: { rotate: 0, scale: 1, opacity: 1, transition: { duration: 0.15 } },
  exit: { rotate: 45, scale: 0.6, opacity: 0, transition: { duration: 0.12 } },
};

function WorkshopLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Reddix Robotics — return to home"
      className="flex items-center gap-2.5 rounded-sm select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2"
    >
      <img
        src="/reddix_logo_new.png"
        alt="Reddix Robotics Logo"
        className="h-12 w-auto object-contain transition-transform duration-150 group-hover:scale-95"
      />
    </Link>
  );
}

function NavSectionLink({
  label, id, activeId, onScroll,
}: { label: string; id: string; activeId: string; onScroll: (id: string) => void }) {
  const isActive = activeId === id;
  return (
    <button
      onClick={() => onScroll(id)}
      className={cn(
        'relative px-3 py-1.5 text-[0.8125rem] font-medium rounded transition-colors duration-200',
        'after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:rounded-full after:transition-all after:duration-200',
        isActive
          ? 'text-[var(--color-brand)] after:bg-[var(--color-brand)] after:opacity-100'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] after:bg-[var(--color-brand)] after:opacity-0 hover:after:opacity-30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]',
      )}
    >
      {label}
    </button>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  shouldReduceMotion: boolean;
  onScroll: (id: string) => void;
  activeId: string;
}

const MobileDrawer = memo(function MobileDrawer({ open, onClose, shouldReduceMotion, onScroll, activeId }: MobileDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = drawerRef.current;
    if (!panel) return;
    const FOCUSABLE = 'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])';
    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const raf = requestAnimationFrame(() => closeRef.current?.focus());
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (!focusable.length) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); cancelAnimationFrame(raf); };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = parseInt(document.body.style.top || '0') * -1;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [open]);

  const reducedOverlay = shouldReduceMotion ? {} : overlayVariants;
  const reducedDrawer = shouldReduceMotion ? {} : drawerVariants;
  const reducedNav = shouldReduceMotion ? {} : drawerNavVariants;
  const reducedItem = shouldReduceMotion ? {} : drawerItemVariants;

  const handleLink = (id: string) => { onScroll(id); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="overlay" aria-hidden="true" initial="hidden" animate="visible" exit="hidden" variants={reducedOverlay} transition={{ duration: 0.2 }} onClick={onClose} className="fixed inset-0 z-[48] bg-[var(--bg-overlay)] cursor-pointer" />
          <motion.div key="drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label="Workshop navigation" initial="hidden" animate="visible" exit="exit" variants={reducedDrawer}
            className="fixed right-0 top-0 z-[49] h-[100dvh] w-full max-w-[20rem] sm:max-w-[22rem] flex flex-col bg-[var(--surface-card)] border-l border-[var(--border-primary)] shadow-xl overflow-y-auto overflow-x-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)] sticky top-0 z-10 bg-[var(--surface-card)]">
              <WorkshopLogo onClick={onClose} />
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close navigation menu" className="btn btn-ghost btn-icon btn-md focus-ring ml-2 shrink-0"><X size={22} aria-hidden="true" /></button>
            </div>
            {/* Badge */}
            <div className="px-5 pt-4 pb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand)] text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
                ROS 2 Industry Immersion
              </span>
            </div>
            {/* Nav */}
            <motion.nav aria-label="Workshop sections" initial="hidden" animate="visible" variants={reducedNav} className="flex flex-col px-3 pt-2 pb-2">
              <p className="text-[0.7rem] font-semibold tracking-widest text-[var(--text-tertiary)] uppercase px-3 mb-2">Sections</p>
              {NAV_SECTIONS.map((item) => (
                <motion.div key={item.id} variants={reducedItem}>
                  <button onClick={() => handleLink(item.id)}
                    className={cn('flex items-center justify-between w-full px-3 py-3 rounded-lg text-[0.9375rem] font-medium transition-colors duration-150 min-h-[44px]',
                      activeId === item.id ? 'text-[var(--color-brand)] bg-[var(--color-brand-subtle)]' : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]')}>
                    {item.label}
                    <ChevronRight size={16} className="text-[var(--text-tertiary)]" />
                  </button>
                </motion.div>
              ))}
            </motion.nav>
            <div className="mx-5 my-2 h-px bg-[var(--border-subtle)]" aria-hidden="true" />
            {/* CTA */}
            <div className="px-5 pt-4 pb-6 mt-auto flex flex-col gap-3">
              <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" onClick={onClose}
                className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-sm tracking-wide shadow-lg transition-all duration-200 active:scale-[0.98]">
                Apply Now <ChevronRight size={16} />
              </a>
              <Link to="/" onClick={onClose} className="text-center text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2">← Back to Reddix Robotics</Link>
            </div>
            <div className="px-5 pb-5 pt-2"><p className="text-[0.72rem] text-center text-[var(--text-muted)]">Reddix Robotics © {new Date().getFullYear()}</p></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

function HamburgerButtonInner({ open, onClick, shouldReduceMotion }: { open: boolean; onClick: () => void; shouldReduceMotion: boolean }, ref: React.Ref<HTMLButtonElement>) {
  return (
    <button ref={ref} type="button" onClick={onClick} aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open}
      className="btn btn-ghost btn-icon btn-md focus-ring md:hidden relative overflow-hidden min-w-[44px] min-h-[44px]">
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span key="close" aria-hidden="true" initial={shouldReduceMotion ? false : iconVariants.initial} animate={shouldReduceMotion ? {} : iconVariants.animate} exit={shouldReduceMotion ? {} : iconVariants.exit} className="flex items-center justify-center"><X size={22} /></motion.span>
        ) : (
          <motion.span key="menu" aria-hidden="true" initial={shouldReduceMotion ? false : iconVariants.initial} animate={shouldReduceMotion ? {} : iconVariants.animate} exit={shouldReduceMotion ? {} : iconVariants.exit} className="flex items-center justify-center"><Menu size={22} /></motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
const HamburgerButton = forwardRef<HTMLButtonElement, { open: boolean; onClick: () => void; shouldReduceMotion: boolean }>(HamburgerButtonInner);
HamburgerButton.displayName = 'HamburgerButton';

export function WorkshopNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const shouldReduceMotion = useReducedMotion() ?? false;
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navHeight = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => hamburgerRef.current?.focus(), 50);
  }, []);

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 'var(--header-height)',
        backgroundColor: scrolled ? 'var(--bg-primary)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid var(--border-primary)' : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        transition: 'background-color 300ms cubic-bezier(0.16,1,0.3,1), backdrop-filter 300ms cubic-bezier(0.16,1,0.3,1), border-color 300ms cubic-bezier(0.16,1,0.3,1), box-shadow 300ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div className="container-content flex h-full items-center justify-between gap-4 px-6 max-w-7xl mx-auto">
          <WorkshopLogo />
          {/* Desktop badge */}
          <div className="hidden lg:flex items-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-brand-subtle)] text-[var(--color-brand)] text-[0.7rem] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
              ROS 2 Industry Immersion
            </span>
          </div>
          {/* Desktop nav */}
          <nav aria-label="Workshop sections" className="hidden items-center gap-0.5 md:flex">
            {NAV_SECTIONS.map((item) => (
              <NavSectionLink key={item.id} label={item.label} id={item.id} activeId={activeId} onScroll={scrollToSection} />
            ))}
          </nav>
          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link to="/" className="text-[0.8125rem] font-medium px-3 py-1.5 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-200">← Home</Link>
            <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-semibold text-sm shadow-md transition-all duration-200 active:scale-[0.97]">
              Apply Now <ChevronRight size={15} />
            </a>
          </div>
          {/* Mobile */}
          <div className="flex items-center gap-1 md:hidden">
            <HamburgerButton ref={hamburgerRef} open={drawerOpen} onClick={() => setDrawerOpen((p) => !p)} shouldReduceMotion={shouldReduceMotion} />
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} shouldReduceMotion={shouldReduceMotion} onScroll={scrollToSection} activeId={activeId} />
    </>
  );
}
