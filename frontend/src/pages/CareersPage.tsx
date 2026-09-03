import {
  CareersHeroSection,
  WhyJoinUsSection,
  OpportunitiesSection,
  TrainingSection,
  NewProjectsSection,
  CompanyCultureSection,
  ApplicationCtaSection,
  WorkshopsSection
} from '@/features/careers';

export default function CareersPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <CareersHeroSection />
      <WhyJoinUsSection />
      <OpportunitiesSection />
      <TrainingSection />
      <WorkshopsSection />
      <NewProjectsSection />
      <CompanyCultureSection />
      <ApplicationCtaSection />
    </div>
  );
}
