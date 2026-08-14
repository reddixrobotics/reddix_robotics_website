import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';

export default function CompanySection() {
  return (
    <Section className="bg-[var(--bg-primary)] pt-12 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeading 
            eyebrow="Our Company" 
            title="Pioneering the Autonomous Revolution" 
            align="left"
          />
          <div className="text-body-lg text-[var(--text-secondary)] space-y-6">
            <p>
              At Reddix Robotics, we believe that intelligent automation is the key to solving humanity's most complex challenges. Founded in 2026, we have rapidly grown into a global leader in autonomous systems.
            </p>
            <p>
              Our mission is to seamlessly integrate robotic technologies into industrial, commercial, and everyday environments—enhancing safety, efficiency, and human potential.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          className="relative h-64 sm:h-80 lg:h-full min-h-[400px] rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-strong)] flex items-center justify-center group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Placeholder for official company photo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-tertiary)] p-6 text-center">
            <div className="w-16 h-16 mb-4 rounded bg-[var(--border-strong)] opacity-50" />
            <p className="text-body-md font-medium text-[var(--text-secondary)]">
              [ Official Company Photo Placeholder ]
            </p>
            <p className="text-body-sm text-[var(--text-tertiary)] mt-2">
              Replace this element with an &lt;img&gt; pointing to the company headquarters or team photo.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
