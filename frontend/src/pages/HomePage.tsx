import {
  HeroSection,
  CompanySection,
  CapabilitiesSection,
  ProjectsSection,
  ProductsSection,
  CareersPreviewSection,
  WorkshopsSection,
  CtaSection,
  PartnersSection
} from '@/features/home';

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes/routePaths';

/**
 * HomePage
 * The main landing page for Reddix Robotics.
 */
export default function HomePage() {
  const { isAuthenticated, userRole, loading } = useAuth();

  // Redirect Admins away from the public home page to their dashboard
  if (!loading && isAuthenticated && (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN')) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <PartnersSection />
      <CompanySection />
      <CapabilitiesSection />
      <ProjectsSection />
      <ProductsSection />
      <CareersPreviewSection />
      <WorkshopsSection />
      <CtaSection />
    </div>
  );
}
