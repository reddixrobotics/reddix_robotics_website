import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

// ─── Padding sizes ────────────────────────────────────────────────────────────

const paddingClass = {
  none: '',
  sm:   'card-sm',
  md:   '',          // default card padding (1.5rem)
  lg:   'card-lg',
  xl:   'card-xl',
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Elevates the card with a subtle shadow. */
  raised?: boolean;
  /** Adds hover state — useful for clickable cards. */
  interactive?: boolean;
  /** Adds a 2px brand-colored top border. */
  accentBorder?: boolean;
  /** Brand-tinted subtle background. */
  branded?: boolean;
  padding?: keyof typeof paddingClass;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      raised = false,
      interactive = false,
      accentBorder = false,
      branded = false,
      padding = 'md',
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        'card',
        paddingClass[padding],
        raised && 'card-raised',
        interactive && 'card-interactive',
        accentBorder && 'card-accent-border',
        branded && 'card-brand',
        className,
      )}
      {...(interactive && !props.role ? { role: 'button', tabIndex: 0 } : {})}
      {...props}
    >
      {children}
    </div>
  ),
);

Card.displayName = 'Card';

export default Card;
