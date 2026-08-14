import { motion } from 'framer-motion';
import { Section } from '@/components/ui';
import { Eye, Target } from 'lucide-react';

export default function VisionMissionSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] border-y border-[var(--border-primary)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--color-brand)] mb-6 border border-[var(--border-strong)] shadow-sm">
            <Eye size={32} />
          </div>
          <h3 className="text-heading-lg mb-4">Our Vision</h3>
          <p className="text-body-lg text-[var(--text-secondary)]">
            To create a world where intelligent machines seamlessly collaborate with humans, taking on dangerous, repetitive, and complex tasks, thereby allowing humanity to focus on creativity, strategy, and innovation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--color-brand)] mb-6 border border-[var(--border-strong)] shadow-sm">
            <Target size={32} />
          </div>
          <h3 className="text-heading-lg mb-4">Our Mission</h3>
          <p className="text-body-lg text-[var(--text-secondary)]">
            To engineer and deploy the most advanced, reliable, and accessible robotic systems and automation technologies. We are committed to pushing the boundaries of AI and mechatronics to solve the most pressing industrial and societal challenges.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
