import { type HTMLAttributes } from 'react';
import { cn } from '@/utils';

// ─── Section ──────────────────────────────────────────────────────────────────

interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'article' | 'main';
  /** Wraps children in a container-content max-width div. */
  container?: boolean;
  /** Use compact vertical spacing. */
  compact?: boolean;
}

export function Section({
  as: Tag = 'section',
  container = true,
  compact = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(compact ? 'section-sm' : 'section', className)}
      {...props}
    >
      {container ? <div className="container-content">{children}</div> : children}
    </Tag>
  );
}

// ─── SectionHeading ───────────────────────────────────────────────────────────

interface SectionHeadingProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
  /** Max width for the description text (Tailwind class). */
  descriptionMaxWidth?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  descriptionMaxWidth = 'max-w-2xl',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {eyebrow && <p className="text-eyebrow mb-3">{eyebrow}</p>}

      <h2 className="text-display-sm">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'text-body-lg mt-4',
            align === 'center' && `mx-auto ${descriptionMaxWidth}`,
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Full-width page-level hero header used at the top of interior pages.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'border-b border-[var(--border-primary)] bg-[var(--bg-secondary)] pt-[calc(var(--header-height)+1.5rem)] pb-10 md:pb-12',
        className,
      )}
    >
      <div className="container-content">
        {eyebrow && <p className="text-eyebrow mb-4">{eyebrow}</p>}
        <h1 className="text-display-md">{title}</h1>
        {description && (
          <p className="text-body-lg mt-4 max-w-prose">{description}</p>
        )}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </header>
  );
}
