import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
  useId,
} from 'react';
import { cn } from '@/utils';

// ─── InputField ────────────────────────────────────────────────────────────────

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Icon displayed on the left side of the input. */
  iconLeft?: ReactNode;
  /** Icon or element displayed on the right side of the input. */
  iconRight?: ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
  required?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      hint,
      error,
      iconLeft,
      iconRight,
      inputSize = 'md',
      required = false,
      className,
      id: externalId,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const id = externalId ?? autoId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    const sizeClass = {
      sm: 'input-sm',
      md: '',
      lg: 'input-lg',
    }[inputSize];

    return (
      <div className="input-wrapper">
        {label && (
          <label
            htmlFor={id}
            className={cn('input-label', required && 'input-label-required')}
          >
            {label}
          </label>
        )}

        <div className={cn(iconLeft ?? iconRight ? 'input-group' : '')}>
          {iconLeft && (
            <span className="input-icon-left">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={id}
            required={required}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null]
                .filter(Boolean)
                .join(' ') || undefined
            }
            aria-invalid={error ? 'true' : undefined}
            className={cn(
              'input',
              sizeClass,
              error && 'input-error',
              iconLeft && 'input-has-icon-left',
              iconRight && 'input-has-icon-right',
              className,
            )}
            {...props}
          />

          {iconRight && (
            <span className="input-icon-right">
              {iconRight}
            </span>
          )}
        </div>

        {error && (
          <p id={errorId} className="input-error-msg" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="input-hint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

InputField.displayName = 'InputField';

// ─── TextareaField ─────────────────────────────────────────────────────────────

export interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    { label, hint, error, required = false, className, id: externalId, ...props },
    ref,
  ) => {
    const autoId = useId();
    const id = externalId ?? autoId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    return (
      <div className="input-wrapper">
        {label && (
          <label
            htmlFor={id}
            className={cn('input-label', required && 'input-label-required')}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          required={required}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={error ? 'true' : undefined}
          className={cn('input textarea', error && 'input-error', className)}
          {...props}
        />

        {error && (
          <p id={errorId} className="input-error-msg" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="input-hint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

TextareaField.displayName = 'TextareaField';

// ─── SelectField ───────────────────────────────────────────────────────────────

export interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, hint, error, required = false, className, id: externalId, ...props },
    ref,
  ) => {
    const autoId = useId();
    const id = externalId ?? autoId;
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;

    return (
      <div className="input-wrapper">
        {label && (
          <label
            htmlFor={id}
            className={cn('input-label', required && 'input-label-required')}
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          required={required}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          aria-invalid={error ? 'true' : undefined}
          className={cn('input select', error && 'input-error', className)}
          {...props}
        />

        {error && (
          <p id={errorId} className="input-error-msg" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="input-hint">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = 'SelectField';
