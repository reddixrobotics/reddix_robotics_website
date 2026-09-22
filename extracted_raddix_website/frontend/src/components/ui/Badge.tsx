import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

// ─── Variants ─────────────────────────────────────────────────────────────────

const variantClass = {
  neutral: 'badge-neutral',
  brand:   'badge-brand',
  success: 'badge-success',
  warning: 'badge-warning',
  error:   'badge-error',
  info:    'badge-info',
  solid:   'badge-solid-brand',
} as const;

const sizeClass = {
  sm: 'badge-sm',
  md: '',
  lg: 'badge-lg',
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantClass;
  size?: keyof typeof sizeClass;
  /** Adds a coloured dot before the text. */
  dot?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', dot = false, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'badge',
        variantClass[variant],
        sizeClass[size],
        dot && 'badge-dot',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  ),
);

Badge.displayName = 'Badge';

export default Badge;
