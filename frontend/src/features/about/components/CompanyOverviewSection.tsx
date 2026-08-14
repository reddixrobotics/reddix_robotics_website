import { motion } from 'framer-motion';
import { Section } from '@/components/ui';

export default function CompanyOverviewSection() {
  return (
    <Section className="bg-[var(--bg-primary)] pt-0 pb-24">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-heading-xl mb-8">Pioneering the Autonomous Frontier</h2>
          <p className="text-body-lg text-[var(--text-secondary)] mb-6">
            Reddix Robotics is a robotics and technology company focused on robotics, AI, automation, computer vision, and engineering solutions. We bridge the gap between complex algorithmic research and robust, real-world hardware deployments.
          </p>
          <p className="text-body-lg text-[var(--text-secondary)]">
            Our autonomous systems are designed to operate in unconstrained environments, learning and adapting to dynamic challenges. By combining state-of-the-art machine learning with precision mechatronics, we build the foundations for a fully automated future.
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
