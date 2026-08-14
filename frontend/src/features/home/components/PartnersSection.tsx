import { motion } from 'framer-motion';
import { Section } from '@/components/ui';

const partners = [
  "AeroSpace Dynamics", "Global Logistics Co", "NextGen Health",
  "Automotive Prime", "AgriTech Solutions", "BuildCorp"
];

export default function PartnersSection() {
  return (
    <Section compact className="bg-[var(--bg-primary)] border-t border-[var(--border-primary)] overflow-hidden">
      <div className="text-center mb-8">
        <p className="text-eyebrow text-[var(--text-tertiary)]">TRUSTED BY INDUSTRY LEADERS</p>
      </div>
      
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        {partners.map((partner, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-heading-md font-bold tracking-tighter"
          >
            {partner}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
