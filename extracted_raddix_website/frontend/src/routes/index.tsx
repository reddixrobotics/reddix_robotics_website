import { useState, useEffect } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROUTES } from './routePaths';
import RootLayout from '@/layouts/RootLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import RoleGuard from './RoleGuard';

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

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

const HomePage     = lazy(() => import('@/pages/HomePage'));
const AboutPage    = lazy(() => import('@/pages/AboutPage'));
const CareersPage  = lazy(() => import('@/pages/CareersPage'));
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('@/pages/ProductDetailsPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
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
const AdminFeaturedProjects = lazy(() => import('@/pages/admin/AdminFeaturedProjects'));
const AdminWorkshops = lazy(() => import('@/pages/admin/AdminWorkshops'));
const AdminJobs = lazy(() => import('@/pages/admin/AdminJobs'));
const AdminInternships = lazy(() => import('@/pages/admin/AdminInternships'));
const AdminUpcomingProjects = lazy(() => import('@/pages/admin/AdminUpcomingProjects'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminCompany = lazy(() => import('@/pages/admin/AdminCompany'));
const AdminJourneys = lazy(() => import('@/pages/admin/AdminJourneys'));
const AdminApplications = lazy(() => import('@/pages/admin/AdminApplications'));
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders'));
const AdminPayments = lazy(() => import('@/pages/admin/AdminPayments'));
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
      { path: ROUTES.CONTACT,      element: withSuspense(ContactPage) },
      { path: ROUTES.BLOG,         element: withSuspense(BlogPage) },
      { path: ROUTES.LOGIN,        element: withSuspense(LoginPage) },
      { path: ROUTES.SIGNUP,       element: withSuspense(SignupPage) },
      { path: ROUTES.CAREERS,      element: withSuspense(CareersPage) },
      { path: ROUTES.DESIGN_SYSTEM, element: withSuspense(DesignSystemPage) },
      { path: ROUTES.NOT_FOUND,    element: withSuspense(NotFoundPage) },
      // Publicly viewable routes (GUEST allowed)
      {
        element: <RoleGuard allowedRoles={['USER', 'GUEST', 'ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER']} />,
        children: [
          { path: ROUTES.PRODUCTS,     element: withSuspense(ProductsPage) },
          { path: ROUTES.SERVICES,     element: withSuspense(ServicesPage) },
          { path: ROUTES.PROJECTS,     element: withSuspense(ProjectsPage) },
          { path: ROUTES.PARTNERS,     element: withSuspense(PartnersPage) },
        ],
      },

      // Protected routes (Login required)
      {
        element: <RoleGuard allowedRoles={['USER', 'ADMIN', 'SUPER_ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER']} />,
        children: [
          { path: ROUTES.PRODUCT_DETAILS, element: withSuspense(ProductDetailsPage) },
          { path: ROUTES.CART,         element: withSuspense(CartPage) },
          { path: ROUTES.CHECKOUT,     element: withSuspense(CheckoutPage) },
          { path: ROUTES.CHECKOUT_PAYMENT, element: withSuspense(PaymentPage) },
          { path: ROUTES.ORDER_SUCCESS, element: withSuspense(OrderSuccessPage) },
          { path: ROUTES.CAREERS_JOB_APPLY, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(JobApplicationPage)}</div> },
          { path: ROUTES.CAREERS_INTERNSHIP_APPLY, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(InternshipApplicationPage)}</div> },
          { path: ROUTES.CAREERS_WORKSHOP_REGISTER, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(WorkshopRegistrationPage)}</div> },
          { path: ROUTES.CAREERS_GENERAL_APPLY, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(GeneralApplicationPage)}</div> },
        ],
      },

      // USER ONLY restricted routes (Replaces the old Dashboard Sidebar layout)
      {
        element: <RoleGuard allowedRoles={['USER']} />,
        children: [
          { path: ROUTES.WISHLIST, element: withSuspense(WishlistPage) },
          { path: ROUTES.PROFILE, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(DashboardProfile)}</div> },
          { path: ROUTES.APPLICATIONS, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(DashboardApplications)}</div> },
          { path: ROUTES.ORDERS,  element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(DashboardOrders)}</div> },
          { path: ROUTES.PAYMENT, element: <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[60vh]">{withSuspense(DashboardPayments)}</div> },
        ],
      },
    ],
  },
  {
    path: ROUTES.ADMIN,
    element: <RoleGuard allowedRoles={['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'ORDER_MANAGER', 'CAREER_MANAGER']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
      { index: true, element: withSuspense(AdminOverview) },
      { path: 'dashboard', element: withSuspense(AdminOverview) },
      { path: 'products', element: withSuspense(AdminProducts) },
      { path: 'employees', element: withSuspense(AdminEmployees) },
      { path: 'journeys', element: withSuspense(AdminJourneys) },
      { path: 'projects', element: withSuspense(AdminProjects) },
      { path: 'featured-projects', element: withSuspense(AdminFeaturedProjects) },
      { path: 'workshops', element: withSuspense(AdminWorkshops) },
      { path: 'jobs', element: withSuspense(AdminJobs) },
      { path: 'upcoming-projects', element: withSuspense(AdminUpcomingProjects) },
      // Other routes fallback to placeholder for now (categories, internships, etc.)
      { path: 'company', element: withSuspense(AdminCompany) },
      { path: 'categories', element: withSuspense(AdminPlaceholderPage) },
      { path: 'orders', element: withSuspense(AdminOrders) },
      { path: 'payments', element: withSuspense(AdminPayments) },
      { path: 'internships', element: withSuspense(AdminInternships) },
      { path: 'applications', element: withSuspense(AdminApplications) },
      { path: 'contractors', element: withSuspense(AdminPlaceholderPage) },
      { path: 'users', element: withSuspense(AdminPlaceholderPage) },
      { path: 'messages', element: withSuspense(AdminPlaceholderPage) },
      { path: 'settings', element: withSuspense(AdminSettings) },
      { path: '*', element: withSuspense(AdminPlaceholderPage) },
    ],
      }
    ]
  }
]);

