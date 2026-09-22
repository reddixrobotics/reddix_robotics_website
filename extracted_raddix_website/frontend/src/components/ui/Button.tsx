import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';

// ─── Variant / Size maps ──────────────────────────────────────────────────────

const variantClass = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  outline:   'btn-outline',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
} as const;

const sizeClass = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClass;
  size?: keyof typeof sizeClass;
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  /** Stretches the button to full container width. */
  fullWidth?: boolean;
  /** Square icon-only button (removes horizontal padding). */
  iconOnly?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      iconOnly = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'btn',
          variantClass[variant],
          sizeClass[size],
          iconOnly && 'btn-icon',
          fullWidth && 'btn-full',
          className,
        )}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="block h-4 w-4 animate-spinner rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
