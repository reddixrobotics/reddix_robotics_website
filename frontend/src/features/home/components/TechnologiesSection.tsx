import { motion } from 'framer-motion';
import { Section, SectionHeading, Badge } from '@/components/ui';

const technologies = [
  "ROS 2", "C++20", "Python 3.12", "TensorFlow", "PyTorch",
  "NVIDIA Isaac", "CUDA", "OpenCV", "Simulink", "Gazebo",
  "React", "TypeScript", "Node.js", "Docker", "Kubernetes",
  "WebRTC", "WebSockets", "GraphQL", "gRPC", "PostgreSQL"
];

export default function TechnologiesSection() {
  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="Our Stack" 
        title="Built on Cutting-Edge Technologies" 
        description="We leverage the latest advancements in software and hardware to deliver robust autonomous systems."
      />
      
      <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
        {technologies.map((tech, i) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Badge variant="neutral" size="lg" className="text-body-md py-2 px-4 border border-[var(--border-strong)] shadow-sm">
              {tech}
            </Badge>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
