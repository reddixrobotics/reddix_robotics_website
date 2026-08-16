import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeading, Card, Badge } from '@/components/ui';
import apiClient from '@/services/apiClient';

export default function NewProjectsSection() {
  const [upcomingProjects, setUpcomingProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/api/upcoming-projects');
        setUpcomingProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch upcoming projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="What's Next" 
        title="Upcoming Projects" 
        description="Here's a sneak peek at the cutting-edge initiatives you could be working on."
      />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-[var(--text-secondary)]">Loading upcoming projects...</div>
        ) : upcomingProjects.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)]">
            No upcoming projects at the moment.
          </div>
        ) : (
          upcomingProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="h-full border-[var(--border-strong)] bg-[var(--bg-secondary)] flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="neutral" size="sm" className="bg-[var(--bg-tertiary)]">{project.team}</Badge>
                  <span className="text-caption font-bold text-[var(--color-brand)]">{project.status}</span>
                </div>
                <h4 className="text-heading-sm mb-3">{project.title}</h4>
                <p className="text-body-sm text-[var(--text-secondary)] flex-grow">{project.description}</p>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </Section>
  );
}
