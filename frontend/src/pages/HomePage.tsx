import {
  HeroSection,
  CompanySection,
  CapabilitiesSection,
  TechnologiesSection,
  ProjectsSection,
  ProductsSection,
  TeamSection,
  PartnersSection,
  CareersPreviewSection,
  WorkshopsSection,
  CtaSection
} from '@/features/home';

/**
 * HomePage
 * The main landing page for Reddix Robotics.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <PartnersSection />
      <CompanySection />
      <CapabilitiesSection />
      <TechnologiesSection />
      <ProjectsSection />
      <ProductsSection />
      <CareersPreviewSection />
      <WorkshopsSection />
      <CtaSection />
    </div>
  );
}
