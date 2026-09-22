import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { BRAND_NAME, BRAND_TAGLINE, BRAND_EMAIL, BRAND_PHONE } from '@/data';
import { cn } from '@/utils';
import { Mail, MapPin, Phone, Linkedin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        'border-t border-[var(--border-primary)]',
        'bg-[var(--bg-secondary)] text-[var(--text-secondary)]',
      )}
    >
      <div className="container-content py-12 md:py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* ─── Company ───────────────────────────────────────────────────────── */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--color-brand)] text-sm font-bold text-white">
                R
              </span>
              <span className="font-display text-lg font-bold text-[var(--text-primary)] tracking-tight">
                {BRAND_NAME}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[var(--text-muted)] max-w-xs">
              Building innovative robotic systems, automation solutions and intelligent technologies for the future. {BRAND_TAGLINE}
            </p>
          </div>

          {/* ─── Quick Links ───────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: ROUTES.HOME },
                { label: 'About', href: ROUTES.ABOUT },
                { label: 'Careers', href: ROUTES.CAREERS },
                { label: 'Products', href: ROUTES.PRODUCTS },
                { label: 'Projects', href: ROUTES.PROJECTS || '/projects' },
                { label: 'Workshops', href: '/workshops' },
                { label: 'Contact', href: ROUTES.CONTACT },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className={cn(
                      'text-sm hover:text-[var(--color-brand)]',
                      'transition-colors duration-200 ease-in-out',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] rounded-sm'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Contact ───────────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href={`mailto:${BRAND_EMAIL}`} 
                  className="flex items-start gap-3 group text-sm hover:text-[var(--color-brand)] transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 mt-0.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--color-brand)] transition-colors" />
                  <span>{BRAND_EMAIL}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`tel:+91${BRAND_PHONE}`} 
                  className="flex items-start gap-3 group text-sm hover:text-[var(--color-brand)] transition-colors duration-200"
                >
                  <Phone className="w-5 h-5 mt-0.5 shrink-0 text-[var(--text-muted)] group-hover:text-[var(--color-brand)] transition-colors" />
                  <span>+91 {BRAND_PHONE}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-[var(--text-muted)]" />
                <span>
                  5th floor, Type I, APIIC, 6-B,<br />
                  Prashanth Nagar, IDA Kukatpally,<br />
                  Hyderabad, Telangana 500072
                </span>
              </li>
            </ul>
          </div>

          {/* ─── Social ────────────────────────────────────────────────────────── */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-5 uppercase tracking-wider">
              Social
            </h3>
            <div className="flex gap-4">
              <a
                href="https://www.linkedin.com/company/reddix-robotics/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[var(--text-muted)] hover:text-[var(--color-brand)] hover:-translate-y-1 transition-all duration-300"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/reddixrobotics?igsi=NW43ZWR3eTZnY2J1&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[var(--text-muted)] hover:text-[var(--color-brand)] hover:-translate-y-1 transition-all duration-300"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com/@reddix_robotics?si=lhQdRPZjoQBJ-IfJ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-[var(--text-muted)] hover:text-[var(--color-brand)] hover:-translate-y-1 transition-all duration-300"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* ─── Bottom Section (Legal & Copyright) ────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-[var(--text-muted)]">
              © {year} {BRAND_NAME}. All rights reserved.
            </p>
            <p className="text-xs text-[var(--text-muted)] opacity-70">
              3D Model based on "Animated humanoid robot" by pinguinoconpulgares (CC-BY-4.0).
            </p>
          </div>
          <div className="flex gap-6">
            <Link 
              to="/privacy-policy" 
              className="text-sm text-[var(--text-muted)] hover:text-[var(--color-brand)] transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              to="/terms-conditions" 
              className="text-sm text-[var(--text-muted)] hover:text-[var(--color-brand)] transition-colors duration-200"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
