import { useState, useEffect, useRef } from 'react';

/**
 * Tracks whether the user has scrolled past a threshold (default 80px).
 * Useful for triggering header style changes on scroll.
 */
export function useScrolled(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > threshold);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}
