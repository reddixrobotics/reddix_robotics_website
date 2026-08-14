import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks';
import { cn } from '@/utils';

export interface ThemeToggleProps {
  /** Additional classes on the button. */
  className?: string;
  /** Show the label next to the icon. */
  showLabel?: boolean;
}

/**
 * Theme toggle button.
 * Reads and updates theme from ThemeContext (localStorage-persisted).
 */
export default function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className={cn(
        'btn btn-ghost btn-sm focus-ring',
        'gap-1.5 rounded-md px-2',
        className,
      )}
    >
      {isDark ? (
        <Sun
          size={18}
          aria-hidden="true"
          className="text-[var(--text-tertiary)] transition-colors group-hover:text-[var(--text-primary)]"
        />
      ) : (
        <Moon
          size={18}
          aria-hidden="true"
          className="text-[var(--text-tertiary)] transition-colors group-hover:text-[var(--text-primary)]"
        />
      )}
      {showLabel && (
        <span className="text-[0.8125rem] font-medium text-[var(--text-secondary)]">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
