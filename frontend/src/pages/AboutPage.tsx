import {
  AboutHeroSection,
  CompanyOverviewSection,
  VisionMissionSection,
  CoreValuesSection,
  TechnologiesSection,
  CapabilitiesSection,
  EmployeesSection,
  ProjectsSection,
  CompanyJourneySection,
  CtaSection
} from '@/features/about';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <AboutHeroSection />
      <CompanyOverviewSection />
      <VisionMissionSection />
      <CoreValuesSection />
      <TechnologiesSection />
      <CapabilitiesSection />
      <EmployeesSection />
      <CompanyJourneySection />
      <CtaSection />
    </div>
  );
}
