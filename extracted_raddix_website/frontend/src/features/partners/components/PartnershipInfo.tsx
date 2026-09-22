import { CheckCircle2, Globe, Shield, Zap } from 'lucide-react';
import { Section, SectionHeading, Button } from '@/components/ui';

export default function PartnershipInfo() {
  const benefits = [
    {
      icon: <Globe className="text-[var(--color-brand)] mb-4" size={32} />,
      title: "Global Distribution Network",
      description: "Tap into our international network to scale your robotics deployment rapidly across borders."
    },
    {
      icon: <Shield className="text-[var(--color-brand)] mb-4" size={32} />,
      title: "Enterprise Reliability",
      description: "Our partners adhere to the highest ISO standards, ensuring components and integrations are enterprise-ready."
    },
    {
      icon: <Zap className="text-[var(--color-brand)] mb-4" size={32} />,
      title: "Co-Innovation",
      description: "Collaborate closely with our engineering teams on cutting-edge R&D and bespoke automation solutions."
    }
  ];

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-3xl overflow-hidden mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Text & Benefits */}
        <div className="p-8 md:p-12 lg:p-16">
          <h2 className="text-display-sm mb-6">Why Partner With Us?</h2>
          <p className="text-body-lg text-[var(--text-secondary)] mb-12">
            At Reddix Robotics, we believe that the future of automation is collaborative. We work with industry leaders in manufacturing, software, and logistics to build ecosystems that solve complex global challenges.
          </p>
          
          <div className="space-y-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-[var(--color-brand)]" size={24} />
                </div>
                <div>
                  <h4 className="text-heading-sm mb-2">{benefit.title}</h4>
                  <p className="text-body-sm text-[var(--text-secondary)]">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Visual / Stats */}
        <div className="bg-[var(--bg-primary)] p-8 md:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-[var(--border-strong)] flex flex-col justify-center relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand)]/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-12">
            <div>
              <div className="text-display-md font-bold text-white mb-2">40+</div>
              <div className="text-heading-xs text-[var(--text-secondary)] uppercase tracking-wider">Active Partners</div>
            </div>
            <div>
              <div className="text-display-md font-bold text-white mb-2">15</div>
              <div className="text-heading-xs text-[var(--text-secondary)] uppercase tracking-wider">Countries</div>
            </div>
            <div>
              <div className="text-display-md font-bold text-white mb-2">99.9%</div>
              <div className="text-heading-xs text-[var(--text-secondary)] uppercase tracking-wider">Integration Success</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
