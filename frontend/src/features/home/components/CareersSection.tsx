import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

export default function CareersSection() {
  return (
    <section className="bg-[var(--bg-secondary)] py-24 lg:py-32">
      <div className="container-content">
        <div className="bg-white rounded-3xl p-10 md:p-16 lg:p-20 shadow-xl border border-[var(--border-subtle)] text-center max-w-5xl mx-auto relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <p className="text-eyebrow text-[var(--color-brand)] font-bold tracking-widest mb-4">CAREERS</p>
            <h2 className="text-display-sm lg:text-display-md font-display text-[var(--text-primary)] mb-6">
              Build the Future With Us
            </h2>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
              Join a team working at the intersection of robotics, AI and intelligent automation. We are always looking for visionary engineers and thinkers.
            </p>
            <Button size="lg" className="px-10 bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">
              View Careers <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}


