/**
 * Route path constants — single source of truth for all route strings.
 * Import these everywhere instead of hard-coding path strings.
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  CHECKOUT_PAYMENT: '/checkout/payment',
  ORDER_SUCCESS: '/order-success/:orderId',
  SERVICES: '/services',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  PARTNERS: '/partners',
  CONTACT: '/contact',
  CAREERS: '/careers',
  CAREERS_JOB_APPLY: '/careers/jobs/:id/apply',
  CAREERS_INTERNSHIP_APPLY: '/careers/internships/:id/apply',
  CAREERS_WORKSHOP_REGISTER: '/careers/workshops/:id/register',
  CAREERS_GENERAL_APPLY: '/careers/general-apply',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  ORDERS: '/orders',
  PAYMENT: '/payment',
  ADMIN: '/admin',
  ADMIN_COMPANY: '/admin/company',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_JOURNEYS: '/admin/journeys',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_FEATURED_PROJECTS: '/admin/featured-projects',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_INTERNSHIPS: '/admin/internships',
  ADMIN_WORKSHOPS: '/admin/workshops',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_CONTRACTORS: '/admin/contractors',
  ADMIN_USERS: '/admin/users',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_SETTINGS: '/admin/settings',
  DESIGN_SYSTEM: '/design-system',
  NOT_FOUND: '*',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Build a concrete URL from a parameterised route.
 * @example buildPath(ROUTES.PRODUCT_DETAIL, { id: 'rover-x1' }) → '/products/rover-x1'
 */
export function buildPath(
  route: string,
  params: Record<string, string> = {},
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    route,
  );
}
