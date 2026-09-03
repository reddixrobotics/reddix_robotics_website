import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Section, SectionHeading, Card, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import apiClient from '@/services/apiClient';

interface FeaturedProject {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  projectUrl?: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await apiClient.get<FeaturedProject[]>('/api/featured-projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch featured projects', err);
        setError('Failed to load featured projects');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="Case Studies" 
        title="Featured Projects" 
        description="See how Reddix Robotics is transforming industries with real-world deployments."
      />
      
      {isLoading ? (
        <div className="mt-12 text-center text-zinc-500 py-12">Loading featured projects...</div>
      ) : error ? (
        <div className="mt-12 text-center text-red-500 py-12">{error}</div>
      ) : projects.length === 0 ? (
        <div className="mt-12 text-center text-zinc-500 py-12">No featured projects currently available.</div>
      ) : (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col overflow-hidden p-0 border border-[var(--border-primary)] shadow-md bg-[var(--surface-card)] hover:border-[var(--color-brand)] transition-colors">
                <div className="h-48 bg-[var(--bg-tertiary)] flex items-center justify-center relative overflow-hidden">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { 
                        (e.target as HTMLImageElement).src = '/logo.png';
                        (e.target as HTMLImageElement).className = "w-1/2 h-1/2 object-contain opacity-50"; 
                      }}
                    />
                  ) : (
                    <div className="text-label text-[var(--text-tertiary)]">Project Image</div>
                  )}
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
                  {project.projectUrl && (
                    <Button variant="ghost" className="self-start -ml-3 text-[var(--color-brand)]" onClick={() => window.open(project.projectUrl, '_blank')}>
                      Read Case Study <ArrowRight size={16} className="ml-2" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-12 text-center">
        <Button variant="outline">View All Projects</Button>
      </div>
    </Section>
  );
}
