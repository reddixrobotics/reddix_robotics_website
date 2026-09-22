import { motion } from 'framer-motion';
import { Section, SectionHeading, Badge } from '@/components/ui';

const techStack = [
  "Deep Reinforcement Learning", "Computer Vision", "Sensor Fusion",
  "LiDAR & Radar Processing", "SLAM Navigation", "ROS 2 Architecture",
  "Real-Time OS", "Edge Inference", "Digital Twins", "Predictive Maintenance"
];

export default function TechnologiesSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] border-y border-[var(--border-primary)]">
      <SectionHeading 
        eyebrow="Innovation" 
        title="Technologies We Pioneer" 
        description="We don't just use modern technology; we actively contribute to and advance the state of the art in robotics."
      />
      
      <div className="mt-12 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {techStack.map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Badge variant="brand" size="lg" className="text-body-md py-3 px-6 shadow-md border border-[var(--color-brand)] bg-transparent text-[var(--color-brand)]">
              {tech}
            </Badge>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
