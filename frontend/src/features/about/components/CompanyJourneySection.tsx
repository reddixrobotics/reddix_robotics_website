import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';

const milestones = [
  { year: "2026", title: "Foundation", desc: "Reddix Robotics founded by Dr. Elena Rostova with a seed round of $10M." },
  { year: "2027", title: "First Prototype", desc: "Successfully tested the RDX-1, our first autonomous mobile robot prototype." },
  { year: "2028", title: "Series A", desc: "Raised $50M to scale manufacturing and expand the software engineering team." },
  { year: "2029", title: "Global Expansion", desc: "Opened offices in London, Tokyo, and New York. Deployed 1,000+ units globally." },
  { year: "Today", title: "Industry Leader", desc: "Pioneering the next generation of humanoid and specialized industrial automation." }
];

export default function CompanyJourneySection() {
  return (
    <Section className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] overflow-hidden">
      <SectionHeading 
        eyebrow="Our History" 
        title="The Journey So Far" 
      />
      
      <div className="mt-16 max-w-4xl mx-auto relative">
        {/* Vertical Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--border-strong)] -translate-x-1/2" />
        
        <div className="space-y-12">
          {milestones.map((milestone, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div 
                key={i}
                className={`relative flex items-start md:items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[20px] md:left-1/2 w-4 h-4 rounded-full bg-[var(--color-brand)] -translate-x-1/2 mt-1 md:mt-0 ring-4 ring-[var(--bg-secondary)] z-10" />
                
                {/* Content */}
                <div className={`w-full pl-12 md:pl-0 md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                  <span className="inline-block px-3 py-1 bg-[var(--bg-tertiary)] rounded-full text-eyebrow text-[var(--color-brand)] mb-3">
                    {milestone.year}
                  </span>
                  <h4 className="text-heading-md mb-2">{milestone.title}</h4>
                  <p className="text-body-sm text-[var(--text-secondary)]">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
