import {
  CareersHeroSection,
  WhyJoinUsSection,
  OpportunitiesSection,
  TrainingSection,
  NewProjectsSection,
  CompanyCultureSection,
  ApplicationCtaSection
} from '@/features/careers';

export default function CareersPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <CareersHeroSection />
      <WhyJoinUsSection />
      <OpportunitiesSection />
      <TrainingSection />
      <NewProjectsSection />
      <CompanyCultureSection />
      <ApplicationCtaSection />
    </div>
  );
}
