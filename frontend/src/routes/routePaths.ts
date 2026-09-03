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
  WORKSHOP_ROS2_IMMERSION: '/workshops/ros2-industry-immersion',
  WORKSHOP_ROS2_IMMERSION_APPLY: '/workshops/ros2-industry-immersion/apply',
  WORKSHOP_ROS2_IMMERSION_SUCCESS: '/workshops/ros2-industry-immersion/application-success',
  BLOG: '/blog',
  BLOG_POST: '/blog/:slug',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  PROFILE: '/profile',
  APPLICATIONS: '/profile/applications',
  ORDERS: '/orders',
  PAYMENT: '/payment',
  ADMIN: '/admin',
  ADMIN_COMPANY: '/admin/company',
  ADMIN_EMPLOYEES: '/admin/employees',
  ADMIN_JOURNEYS: '/admin/journeys',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_FEATURED_PROJECTS: '/admin/featured-projects',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_INTERNSHIPS: '/admin/internships',
  ADMIN_WORKSHOPS: '/admin/workshops',
  ADMIN_WORKSHOP_MEDIA: '/admin/workshop-media',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_USERS: '/admin/users',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_SETTINGS: '/admin/settings',
  DESIGN_SYSTEM: '/design-system',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_CONDITIONS: '/terms-conditions',
  SHIPPING_POLICY: '/shipping-policy',
  CANCELLATION_REFUND: '/cancellation-refund',
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
