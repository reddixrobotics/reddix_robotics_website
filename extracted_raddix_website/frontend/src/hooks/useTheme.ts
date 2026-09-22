import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '@/context/ThemeContext';

/**
 * Access the theme context from any component.
 *
 * @example
 * const { theme, toggleTheme, isDark } = useTheme();
 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>.');
  }
  return ctx;
}
