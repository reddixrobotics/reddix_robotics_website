import { motion } from 'framer-motion';
import { Section, SectionHeading, Card, Button, Badge } from '@/components/ui';
import { projects } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export default function ProjectsSection() {
  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="Portfolio" 
        title="Transformative Projects" 
        description="A selection of our most impactful deployments across various industries."
      />
      
      <div className="mt-16 space-y-12 max-w-6xl mx-auto">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="flex flex-col md:flex-row overflow-hidden p-0 border-[var(--border-primary)] shadow-md group">
              <div className="md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                <img 
                  src={project.imageUrl} 
                  alt={project.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-[var(--bg-primary)]/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[var(--border-strong)]">
                  <span className="text-caption font-bold text-[var(--color-brand)]">{project.year}</span>
                </div>
              </div>
              
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-eyebrow text-[var(--text-tertiary)]">{project.category}</p>
                </div>
                <h3 className="text-heading-lg mb-4">{project.name}</h3>
                <p className="text-body-md text-[var(--text-secondary)] mb-6">
                  {project.description}
                </p>
                
                <div className="mb-8 flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <Badge key={tech} variant="neutral" size="sm" className="bg-[var(--bg-secondary)] border-[var(--border-strong)]">{tech}</Badge>
                  ))}
                </div>
                
                <div className="mt-auto">
                  <Button variant="outline" className="group-hover:bg-[var(--bg-secondary)] transition-colors">
                    View Details <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
