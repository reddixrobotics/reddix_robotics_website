import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';
import apiClient from '@/services/apiClient';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

export default function CompanyJourneySection() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await apiClient.get('/api/journeys');
        setMilestones(res.data);
      } catch (err) {
        console.error('Failed to fetch journeys:', err);
      }
    };
    fetchJourneys();
  }, []);

  if (!milestones || milestones.length === 0) {
    return null;
  }

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
                key={milestone.id}
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
                    {milestone.description}
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
