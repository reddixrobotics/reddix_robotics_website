import { motion } from 'framer-motion';
import { Section, SectionHeading, Card, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Automated Logistics Hub',
    category: 'Logistics',
    description: 'Deployment of 500+ autonomous mobile robots (AMRs) for a Fortune 500 e-commerce fulfillment center, increasing throughput by 300%.',
  },
  {
    id: 2,
    title: 'Surgical Precision Arm',
    category: 'Healthcare',
    description: 'Development of a hyper-accurate, low-latency robotic arm for assisting in minimally invasive remote surgeries.',
  },
  {
    id: 3,
    title: 'Agri-Bot Harvester',
    category: 'Agriculture',
    description: 'Computer-vision guided robotic harvesting system capable of identifying and picking delicate fruits at scale without damage.',
  }
];

export default function ProjectsSection() {
  return (
    <Section className="bg-[var(--bg-secondary)]">
      <SectionHeading 
        eyebrow="Case Studies" 
        title="Featured Projects" 
        description="See how Reddix Robotics is transforming industries with real-world deployments."
      />
      
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full flex flex-col overflow-hidden p-0 border-0 shadow-lg bg-[var(--bg-primary)]">
              {/* Image Placeholder */}
              <div className="h-48 bg-[var(--bg-tertiary)] flex items-center justify-center relative">
                <div className="text-label text-[var(--text-tertiary)]">Project Image</div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[var(--bg-primary)] text-caption font-semibold rounded-full shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-heading-md mb-3">{project.title}</h3>
                <p className="text-body-sm text-[var(--text-secondary)] mb-6 flex-grow">
                  {project.description}
                </p>
                <Button variant="ghost" className="self-start -ml-3 text-[var(--color-brand)]">
                  Read Case Study <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button variant="outline">View All Projects</Button>
      </div>
    </Section>
  );
}
