import { useState, useEffect } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from './routePaths';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import apiClient from '@/services/apiClient';
import { fetchAdminSession } from '@/services/authSession';
import UserGuard from './UserGuard';

// ─── Page loading fallback ────────────────────────────────────────────────────

function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div
        className="h-8 w-8 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)]"
        role="status"
        aria-label="Loading page"
      />
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ─── Admin Guard ─────────────────────────────────────────────────────────────

function AdminGuard() {
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchAdminSession()
      .then((res) => {
        if (!active) return;
        if (res.data.authenticated && res.data.authStatus) {
          setAuthStatus(res.data.authStatus);
        } else {
          setAuthStatus(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setAuthStatus(null);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (authStatus !== 'AUTHENTICATED') {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <AdminLayout />;
}

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

const HomePage     = lazy(() => import('@/pages/HomePage'));
const AboutPage    = lazy(() => import('@/pages/AboutPage'));
const CareersPage  = lazy(() => import('@/pages/CareersPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const PaymentPage = lazy(() => import('@/pages/PaymentPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const PartnersPage = lazy(() => import('@/pages/PartnersPage'));
const ContactPage  = lazy(() => import('@/pages/ContactPage'));
const BlogPage     = lazy(() => import('@/pages/BlogPage'));
const LoginPage    = lazy(() => import('@/pages/LoginPage'));
const SignupPage   = lazy(() => import('@/pages/SignupPage'));
const JobApplicationPage = lazy(() => import('@/pages/JobApplicationPage'));
const InternshipApplicationPage = lazy(() => import('@/pages/InternshipApplicationPage'));
const WorkshopRegistrationPage = lazy(() => import('@/pages/WorkshopRegistrationPage'));
const GeneralApplicationPage = lazy(() => import('@/pages/GeneralApplicationPage'));

// Dashboard Pages
const DashboardOverview = lazy(() => import('@/pages/dashboard/DashboardOverview'));
const DashboardProfile = lazy(() => import('@/pages/dashboard/DashboardProfile'));
const DashboardOrders = lazy(() => import('@/pages/dashboard/DashboardOrders'));
const DashboardPayments = lazy(() => import('@/pages/dashboard/DashboardPayments'));
const DashboardApplications = lazy(() => import('@/pages/dashboard/DashboardApplications'));
const DashboardSettings = lazy(() => import('@/pages/dashboard/DashboardSettings'));

// Admin Pages
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminEmployees = lazy(() => import('@/pages/admin/AdminEmployees'));
const AdminProjects = lazy(() => import('@/pages/admin/AdminProjects'));
const AdminWorkshops = lazy(() => import('@/pages/admin/AdminWorkshops'));
const AdminJobs = lazy(() => import('@/pages/admin/AdminJobs'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminCompany = lazy(() => import('@/pages/admin/AdminCompany'));
const AdminPlaceholderPage = lazy(() => import('@/pages/admin/AdminPlaceholderPage'));

const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    children: [
      { index: true,               element: withSuspense(HomePage) },
      { path: ROUTES.ABOUT,        element: withSuspense(AboutPage) },
      { path: ROUTES.CAREERS,      element: withSuspense(CareersPage) },
      { path: ROUTES.CAREERS_JOB_APPLY, element: withSuspense(JobApplicationPage) },
      { path: ROUTES.CAREERS_INTERNSHIP_APPLY, element: withSuspense(InternshipApplicationPage) },
      { path: ROUTES.CAREERS_WORKSHOP_REGISTER, element: withSuspense(WorkshopRegistrationPage) },
      { path: ROUTES.CAREERS_GENERAL_APPLY, element: withSuspense(GeneralApplicationPage) },
      { path: ROUTES.PRODUCTS,     element: withSuspense(ProductsPage) },
      { path: ROUTES.PRODUCT_DETAILS, element: withSuspense(ProductDetailsPage) },
      { path: ROUTES.CART,         element: withSuspense(CartPage) },
      { path: ROUTES.CHECKOUT,     element: withSuspense(CheckoutPage) },
      { path: ROUTES.CHECKOUT_PAYMENT, element: withSuspense(PaymentPage) },
      { path: ROUTES.ORDER_SUCCESS, element: withSuspense(OrderSuccessPage) },
      { path: ROUTES.SERVICES,     element: withSuspense(ServicesPage) },
      { path: ROUTES.PROJECTS,     element: withSuspense(ProjectsPage) },
      { path: ROUTES.PARTNERS,     element: withSuspense(PartnersPage) },
      { path: ROUTES.CONTACT,      element: withSuspense(ContactPage) },
      { path: ROUTES.BLOG,         element: withSuspense(BlogPage) },
      { path: ROUTES.LOGIN,        element: withSuspense(LoginPage) },
      { path: ROUTES.SIGNUP,       element: withSuspense(SignupPage) },
      { path: ROUTES.DESIGN_SYSTEM, element: withSuspense(DesignSystemPage) },
    ],
  },
  {
    path: ROUTES.DASHBOARD,
    element: <UserGuard />,
    children: [
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          { index: true, element: withSuspense(DashboardOverview) },
          { path: 'profile', element: withSuspense(DashboardProfile) },
          { path: 'orders', element: withSuspense(DashboardOrders) },
          { path: 'payments', element: withSuspense(DashboardPayments) },
          { path: 'applications', element: withSuspense(DashboardApplications) },
          { path: 'settings', element: withSuspense(DashboardSettings) },
        ],
      }
    ],
  },
  {
    path: ROUTES.ADMIN,
    element: <AdminGuard />,
    children: [
      { index: true, element: withSuspense(AdminOverview) },
      { path: 'products', element: withSuspense(AdminProducts) },
      { path: 'employees', element: withSuspense(AdminEmployees) },
      { path: 'projects', element: withSuspense(AdminProjects) },
      { path: 'workshops', element: withSuspense(AdminWorkshops) },
      { path: 'jobs', element: withSuspense(AdminJobs) },
      // Other routes fallback to placeholder for now (categories, internships, etc.)
      { path: 'company', element: withSuspense(AdminCompany) },
      { path: 'categories', element: withSuspense(AdminPlaceholderPage) },
      { path: 'orders', element: withSuspense(AdminPlaceholderPage) },
      { path: 'payments', element: withSuspense(AdminPlaceholderPage) },
      { path: 'internships', element: withSuspense(AdminPlaceholderPage) },
      { path: 'applications', element: withSuspense(AdminPlaceholderPage) },
      { path: 'contractors', element: withSuspense(AdminPlaceholderPage) },
      { path: 'users', element: withSuspense(AdminPlaceholderPage) },
      { path: 'messages', element: withSuspense(AdminPlaceholderPage) },
      { path: 'settings', element: withSuspense(AdminSettings) },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: withSuspense(NotFoundPage),
  },
]);

