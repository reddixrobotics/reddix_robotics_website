import { ArrowRight, Globe2 } from 'lucide-react';
import { Section, Button, Badge } from '@/components/ui';
import { PartnersGrid, PartnershipInfo } from '@/features/partners';
import { partnerCountries } from '@/data/partners';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      
      {/* Hero Section */}
      <Section className="pt-24 pb-20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--color-brand)]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-blue-900/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-6 border-[var(--color-brand)] text-[var(--color-brand)] px-4 py-1">
            Global Network
          </Badge>
          <h1 className="text-display-lg mb-6">
            Our <span className="gradient-text">Partners</span> & Contractors
          </h1>
          <p className="text-body-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            Collaborating with industry-leading manufacturers, software integrators, and researchers worldwide to push the boundaries of robotics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={ROUTES.CONTACT}>
              <Button size="lg" className="w-full sm:w-auto">
                Become a Partner <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => document.getElementById('network')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Network
            </Button>
          </div>
        </div>
      </Section>

      {/* Global Reach / Countries Section */}
      <Section className="py-12 bg-[var(--bg-secondary)] border-y border-[var(--border-strong)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 md:w-1/3">
            <div className="w-12 h-12 rounded-full bg-[var(--bg-primary)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--color-brand)]">
              <Globe2 size={24} />
            </div>
            <div>
              <h3 className="text-heading-sm">Global Presence</h3>
              <p className="text-body-sm text-[var(--text-secondary)]">Operating in key technology hubs</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:w-2/3">
            {partnerCountries.map((country) => (
              <Badge key={country} variant="secondary" className="px-4 py-2 text-sm font-medium border border-[var(--border-strong)] bg-[var(--bg-primary)]">
                {country}
              </Badge>
            ))}
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-dashed text-[var(--text-tertiary)]">
              + Expanding
            </Badge>
          </div>
        </div>
      </Section>

      {/* Partner Grid Section */}
      <Section id="network" className="py-24">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-display-xs mb-4">Ecosystem Partners</h2>
            <p className="text-body-lg text-[var(--text-secondary)] max-w-2xl">
              Discover the hardware and software companies that power our robotic infrastructure.
            </p>
          </div>
        </div>
        
        <PartnersGrid />
      </Section>

      {/* Partnership Info Section */}
      <Section className="py-24 bg-[var(--bg-secondary)]/30 border-t border-[var(--border-strong)]">
        <PartnershipInfo />
      </Section>

      {/* CTA Section */}
      <Section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg-secondary)]/50 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-display-sm mb-6">Join the Future of Automation</h2>
          <p className="text-body-lg text-[var(--text-secondary)] mb-10">
            We are actively looking for integration partners and certified contractors in emerging markets. Let's build together.
          </p>
          <Link to={ROUTES.CONTACT}>
            <Button size="lg">
              Apply for Partnership
            </Button>
          </Link>
        </div>
      </Section>

    </div>
  );
}
