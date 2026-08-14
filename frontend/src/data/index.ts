import type { NavItem } from '@/types';
import { ROUTES } from '@/routes/routePaths';

// ─── Primary navigation (desktop + mobile drawer) ─────────────────────────────

export const NAV_LINKS: NavItem[] = [
  { label: 'Home',     href: ROUTES.HOME },
  { label: 'About',    href: ROUTES.ABOUT },
  { label: 'Careers',  href: ROUTES.CAREERS },
  { label: 'Products', href: ROUTES.PRODUCTS },
  { label: 'Contact',  href: ROUTES.CONTACT },
];

// ─── Auth actions ─────────────────────────────────────────────────────────────

export const AUTH_LINKS = {
  login:  { label: 'Login',   href: ROUTES.LOGIN },
  signup: { label: 'Sign Up', href: ROUTES.SIGNUP },
} as const;

// ─── Footer link groups ───────────────────────────────────────────────────────

export const FOOTER_LINKS: Array<{ title: string; links: NavItem[] }> = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: ROUTES.ABOUT },
      { label: 'Careers',  href: ROUTES.CAREERS },
      { label: 'Blog',     href: ROUTES.BLOG },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Products',  href: ROUTES.PRODUCTS },
      { label: 'Services',  href: ROUTES.SERVICES },
      { label: 'Projects',  href: ROUTES.PROJECTS },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Contact',   href: ROUTES.CONTACT },
      { label: 'LinkedIn',  href: 'https://linkedin.com', external: true },
      { label: 'GitHub',    href: 'https://github.com',   external: true },
    ],
  },
];

// ─── Brand constants ──────────────────────────────────────────────────────────

export const BRAND_NAME     = 'Reddix Robotics';
export const BRAND_TAGLINE  = 'Pioneering Autonomous Intelligence';
export const BRAND_EMAIL    = 'hello@reddixrobotics.com';
