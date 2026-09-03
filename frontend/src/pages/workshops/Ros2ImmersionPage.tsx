import { useEffect } from 'react';
import { WorkshopNavbar } from '@/features/workshops/components/WorkshopNavbar';
import { WorkshopHero } from '@/features/workshops/components/WorkshopHero';
import { WorkshopProgram } from '@/features/workshops/components/WorkshopProgram';
import { MeetKushi } from '@/features/workshops/components/MeetKushi';
import { WorkshopCurriculum } from '@/features/workshops/components/WorkshopCurriculum';
import { WorkshopExperience } from '@/features/workshops/components/WorkshopExperience';
import { WorkshopFAQ } from '@/features/workshops/components/WorkshopFAQ';
import { WorkshopFinalCTA } from '@/features/workshops/components/WorkshopFinalCTA';

export default function Ros2ImmersionPage() {
  useEffect(() => {
    // Set default theme to light (as per instructions)
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <WorkshopNavbar />
      <main>
        <WorkshopHero />
        <WorkshopProgram />
        <MeetKushi />
        <WorkshopCurriculum />
        <WorkshopExperience />
        <WorkshopFAQ />
        <WorkshopFinalCTA />
      </main>
      {/* Assuming there's a global footer or we don't include one if not strictly available */}
    </div>
  );
}
