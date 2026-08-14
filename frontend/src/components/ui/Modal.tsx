import {
  type ReactNode,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ModalProps {
  /** Controls visibility. */
  open: boolean;
  /** Called when the user closes the modal (overlay click or Escape). */
  onClose: () => void;
  /** Modal panel content. */
  children: ReactNode;
  /** Size variant. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Hides the built-in close button. */
  hideCloseButton?: boolean;
  /** Additional class on the panel. */
  className?: string;
  /** Accessible label (required for a11y when no visible title). */
  'aria-label'?: string;
  /** ID of an element that labels the modal. */
  'aria-labelledby'?: string;
}

export interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

// ─── Size map ─────────────────────────────────────────────────────────────────

const sizeClass = {
  sm: 'modal-sm',
  md: '',
  lg: 'modal-lg',
  xl: 'modal-xl',
} as const;

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  hideCloseButton = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Focus trap & Escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last  = focusable[focusable.length - 1]!;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Move focus into the modal
    const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn('modal-panel', sizeClass[size], className)}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={cn(
              'btn btn-ghost btn-icon btn-sm',
              'absolute right-4 top-4',
            )}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}

// ─── ModalHeader ──────────────────────────────────────────────────────────────

export function ModalHeader({ title, description, onClose }: ModalHeaderProps) {
  return (
    <div className="modal-header">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-md pr-8">{title}</h2>
        {description && <p className="text-body-sm">{description}</p>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="btn btn-ghost btn-icon btn-sm flex-shrink-0"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// ─── ModalBody ────────────────────────────────────────────────────────────────

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn('modal-body', className)}>{children}</div>;
}

// ─── ModalFooter ──────────────────────────────────────────────────────────────

export function ModalFooter({ children, className }: ModalFooterProps) {
  return <div className={cn('modal-footer', className)}>{children}</div>;
}
