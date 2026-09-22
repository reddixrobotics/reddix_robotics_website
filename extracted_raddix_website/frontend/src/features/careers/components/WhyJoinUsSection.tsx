import { motion } from 'framer-motion';
import { Section, SectionHeading, Card } from '@/components/ui';
import { BrainCircuit, Rocket, HeartHandshake, Laptop } from 'lucide-react';

const benefits = [
  {
    icon: <Rocket size={24} className="text-[var(--color-brand)]" />,
    title: 'High-Impact Work',
    description: 'Your code and designs will directly power robots deployed in real-world scenarios across the globe.'
  },
  {
    icon: <BrainCircuit size={24} className="text-[var(--color-brand)]" />,
    title: 'Continuous Learning',
    description: 'Generous stipends for courses, conferences, and dedicated research time to explore bold new ideas.'
  },
  {
    icon: <Laptop size={24} className="text-[var(--color-brand)]" />,
    title: 'Flexible Environment',
    description: 'Remote-friendly policies for software roles and state-of-the-art hybrid labs for hardware engineering.'
  },
  {
    icon: <HeartHandshake size={24} className="text-[var(--color-brand)]" />,
    title: 'Comprehensive Care',
    description: 'Top-tier health insurance, mental wellness programs, and extensive family leave policies.'
  }
];

export default function WhyJoinUsSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] border-y border-[var(--border-primary)]">
      <SectionHeading 
        eyebrow="Benefits" 
        title="Why Join Reddix Robotics?" 
        description="We provide an environment where brilliant minds can focus on what they do best: innovating."
      />
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full border-[var(--border-primary)] hover:border-[var(--color-brand)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h4 className="text-heading-sm mb-3">{benefit.title}</h4>
              <p className="text-body-sm text-[var(--text-secondary)]">{benefit.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
