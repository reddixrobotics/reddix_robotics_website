import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';

export default function CompanyCultureSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] border-y border-[var(--border-primary)] overflow-hidden">
      <SectionHeading 
        eyebrow="Culture" 
        title="Life at Reddix" 
      />
      
      <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-heading-md mb-6">Driven by Curiosity, Defined by Impact</h3>
          <p className="text-body-md text-[var(--text-secondary)] mb-6">
            At Reddix, we don't just build machines; we build the future. Our culture is deeply rooted in engineering excellence, open collaboration, and an insatiable curiosity for what's next.
          </p>
          <p className="text-body-md text-[var(--text-secondary)]">
            We believe that the best ideas can come from anyone, anywhere. That's why we foster a flat, transparent environment where bold concepts are celebrated and rigorous testing is the standard.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-96 rounded-2xl overflow-hidden border border-[var(--border-strong)] shadow-xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" 
            alt="Team collaborating" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </Section>
  );
}
