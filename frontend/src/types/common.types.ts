// ============================================================
// Common / shared UI-layer types
// ============================================================

/** Utility: make specified keys required on a type. */
export type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Utility: deep-partial. */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Async state machine. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

/** Navigation item used in Header/Footer/Sidebar. */
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  external?: boolean;
}

/** Feature flag shape (read from import.meta.env). */
export interface FeatureFlags {
  hero3d: boolean;
  contactForm: boolean;
}
