import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';

const team = [
  { name: 'Dr. Elena Rostova', role: 'Chief Executive Officer', bg: 'from-gray-700 to-gray-900' },
  { name: 'Marcus Chen', role: 'Head of AI Research', bg: 'from-gray-600 to-gray-800' },
  { name: 'Sarah Jenkins', role: 'VP of Hardware Engineering', bg: 'from-gray-800 to-black' },
  { name: 'Dr. Kwame Osei', role: 'Director of Autonomous Systems', bg: 'from-gray-700 to-gray-900' }
];

export default function TeamSection() {
  return (
    <Section className="bg-[var(--bg-secondary)]">
      <SectionHeading 
        eyebrow="Leadership" 
        title="Meet the Minds Behind the Machines" 
      />
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group cursor-pointer"
          >
            <div className={`aspect-[3/4] rounded-xl mb-4 overflow-hidden bg-gradient-to-b ${member.bg} relative`}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-brand)] mix-blend-overlay" />
            </div>
            <h4 className="text-heading-sm font-semibold">{member.name}</h4>
            <p className="text-body-sm text-[var(--text-secondary)]">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
