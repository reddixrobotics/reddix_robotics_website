import { motion } from 'framer-motion';
import { Section, SectionHeading, Card, Badge } from '@/components/ui';

const upcomingProjects = [
  {
    title: 'Project Genesis',
    description: 'Developing the foundational AI brain for general-purpose bipedal locomotion.',
    team: 'AI Research',
    status: 'In Development'
  },
  {
    title: 'Argus Vision System',
    description: 'A multi-modal sensor fusion system for zero-visibility industrial environments.',
    team: 'Perception',
    status: 'Prototyping'
  },
  {
    title: 'HiveMind Network',
    description: 'Swarm intelligence protocol for coordinating hundreds of logistical robots seamlessly.',
    team: 'Software Engineering',
    status: 'Beta Testing'
  }
];

export default function NewProjectsSection() {
  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="What's Next" 
        title="Upcoming Projects" 
        description="Here's a sneak peek at the cutting-edge initiatives you could be working on."
      />
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {upcomingProjects.map((project, i) => (
          <motion.div
            key={i}
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
        ))}
      </div>
    </Section>
  );
}
