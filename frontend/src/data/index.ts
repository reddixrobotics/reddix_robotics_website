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
      { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/reddix-robotics/', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/reddixrobotics?igsi=NW43ZWR3eTZnY2J1&utm_source=qr', external: true },
      { label: 'YouTube',   href: 'https://youtube.com/@reddix_robotics?si=lhQdRPZjoQBJ-IfJ', external: true },
    ],
  },
];

// ─── Brand constants ──────────────────────────────────────────────────────────

export const BRAND_NAME     = 'Reddix Robotics';
export const BRAND_TAGLINE  = 'Pioneering Autonomous Intelligence';
export const BRAND_EMAIL    = 'reddixrobotics@gmail.com';
export const BRAND_PHONE    = '7036780248';
