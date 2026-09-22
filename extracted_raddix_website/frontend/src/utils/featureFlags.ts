import type { FeatureFlags } from '@/types';

/**
 * Read and parse VITE_FEATURE_* environment variables into a typed object.
 * Uses strict coercion: only the string "true" evaluates to boolean true.
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    hero3d: import.meta.env['VITE_FEATURE_3D_HERO'] === 'true',
    contactForm: import.meta.env['VITE_FEATURE_CONTACT_FORM'] === 'true',
  };
}
