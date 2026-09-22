import { Section } from '@/components/ui';
import { ContactForm, ContactInfo, MapPlaceholder } from '@/features/contact';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      
      {/* Hero Section */}
      <Section className="pt-24 pb-16 bg-[var(--bg-secondary)] border-b border-[var(--border-strong)] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-brand)]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-display-md mb-6">Contact <span className="text-[var(--color-brand)]">Reddix Robotics</span></h1>
          <p className="text-body-lg text-[var(--text-secondary)]">
            Partner with us to build the future. Reach out to our enterprise sales team, request technical support, or explore career opportunities.
          </p>
        </div>
      </Section>

      {/* Main Content Area */}
      <Section className="py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
            
            {/* Left: Contact Info */}
            <div className="lg:w-5/12">
              <ContactInfo />
            </div>

            {/* Right: Contact Form */}
            <div className="lg:w-7/12">
              <ContactForm />
            </div>

          </div>
        </div>
      </Section>

      {/* Map Section */}
      <section className="pb-24 max-w-[1600px] mx-auto md:px-8 xl:px-12">
        <MapPlaceholder />
      </section>

    </div>
  );
}
