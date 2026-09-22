import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // ThemeProvider adds/removes .dark on <html>

  theme: {
    extend: {
      // ── Tomato Red brand palette (hardcoded for full JIT + opacity support) ──
      colors: {
        red: {
          50:  '#FFF5F4',
          100: '#FFE8E6',
          200: '#FFD0CC',
          300: '#FFAEA7',
          400: '#FF7A6E',
          500: '#E8372A', // Primary tomato red — WCAG AA on white
          600: '#C42D22',
          700: '#A0231A',
          800: '#7D1C15',
          900: '#5C1410',
          950: '#3D0B09',
        },

        // ── Semantic design tokens (driven by CSS variables for theme switching) ──
        brand: {
          DEFAULT: 'var(--color-brand)',
          hover:   'var(--color-brand-hover)',
          active:  'var(--color-brand-active)',
          subtle:  'var(--color-brand-subtle)',
          muted:   'var(--color-brand-muted)',
          text:    'var(--text-brand)',
        },

        surface: {
          DEFAULT:   'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary:  'var(--bg-tertiary)',
          card:      'var(--surface-card)',
          overlay:   'var(--bg-overlay)',
        },

        border: {
          DEFAULT:  'var(--border-primary)',
          strong:   'var(--border-strong)',
          subtle:   'var(--border-subtle)',
        },

        content: {
          DEFAULT:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary:  'var(--text-tertiary)',
          muted:     'var(--text-muted)',
          inverse:   'var(--text-inverse)',
          brand:     'var(--text-brand)',
          onBrand:   'var(--text-on-brand)',
        },

        status: {
          success:        'var(--color-success)',
          'success-bg':   'var(--color-success-bg)',
          warning:        'var(--color-warning)',
          'warning-bg':   'var(--color-warning-bg)',
          error:          'var(--color-error)',
          'error-bg':     'var(--color-error-bg)',
          info:           'var(--color-info)',
          'info-bg':      'var(--color-info-bg)',
        },
      },

      // ── Typography ──────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'ui-sans-serif', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        // Display scale
        'display-xl': ['5rem',   { lineHeight: '1.0',  letterSpacing: '-0.03em',  fontWeight: '700' }],
        'display-lg': ['3.75rem',{ lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['3rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em',  fontWeight: '700' }],
        'display-sm': ['2.25rem',{ lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '700' }],
        // Heading scale
        'heading-xl': ['1.75rem',{ lineHeight: '1.25', letterSpacing: '-0.01em',  fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3',  letterSpacing: '-0.008em', fontWeight: '600' }],
        'heading-md': ['1.25rem',{ lineHeight: '1.35', letterSpacing: '-0.005em', fontWeight: '600' }],
        'heading-sm': ['1.125rem',{ lineHeight: '1.4', letterSpacing: '0',        fontWeight: '600' }],
        // Body scale
        'body-lg':    ['1.125rem',{ lineHeight: '1.7', letterSpacing: '0' }],
        'body-md':    ['1rem',   { lineHeight: '1.65', letterSpacing: '0' }],
        'body-sm':    ['0.875rem',{ lineHeight: '1.6', letterSpacing: '0' }],
        // Utility
        'caption':    ['0.75rem',{ lineHeight: '1.5', letterSpacing: '0.01em' }],
        'label':      ['0.6875rem',{ lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '600' }],
      },

      // ── Spacing ─────────────────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      // ── Border radius ────────────────────────────────────────────────────────
      borderRadius: {
        'xs':  '0.125rem',   // 2px — sharp detail elements
        'sm':  '0.25rem',    // 4px — badges, tags
        DEFAULT: '0.375rem', // 6px — inputs, small cards
        'md':  '0.5rem',     // 8px — buttons
        'lg':  '0.75rem',    // 12px — cards
        'xl':  '1rem',       // 16px — modals, panels
        '2xl': '1.25rem',    // 20px
        '3xl': '1.5rem',     // 24px
      },

      // ── Shadows (CSS-variable-driven for theme) ───────────────────────────────
      boxShadow: {
        'xs':    'var(--shadow-xs)',
        'sm':    'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        'md':    'var(--shadow-md)',
        'lg':    'var(--shadow-lg)',
        'xl':    'var(--shadow-xl)',
        'brand': 'var(--shadow-brand)',
        'inner-brand': 'inset 0 0 0 1px var(--color-brand)',
        'none': 'none',
      },

      // ── Motion ──────────────────────────────────────────────────────────────
      transitionDuration: {
        DEFAULT: '150ms',
        fast:    '100ms',
        base:    '150ms',
        slow:    '250ms',
        slower:  '350ms',
      },

      transitionTimingFunction: {
        DEFAULT:   'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out':  'cubic-bezier(0.45, 0, 0.55, 1)',
        'spring':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      // ── Screens ─────────────────────────────────────────────────────────────
      screens: {
        xs:   '480px',
        sm:   '640px',
        md:   '768px',
        lg:   '1024px',
        xl:   '1280px',
        '2xl':'1440px',
      },

      // ── Max-width ───────────────────────────────────────────────────────────
      maxWidth: {
        'prose-sm': '55ch',
        'prose':    '65ch',
        'prose-lg': '75ch',
        'content':  '1200px',
        'wide':     '1400px',
      },

      // ── Z-index ──────────────────────────────────────────────────────────────
      zIndex: {
        'base':    '0',
        'raised':  '10',
        'overlay': '20',
        'modal':   '50',
        'toast':   '60',
        'tooltip': '70',
      },

      // ── Animation ────────────────────────────────────────────────────────────
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'modal-in': 'modalIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
        'spinner':  'spin 700ms linear infinite',
      },

      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'scale(0.97) translateY(8px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },

  plugins: [],
};

export default config;
