import { motion } from 'framer-motion';
import { Section, SectionHeading, Badge } from '@/components/ui';

const technologies = [
  "ROS 1", "ROS 2", "Gazebo", "RViz", "MoveIt", "SLAM", 
  "Navigation", "TF / TF2", "C / C++", "Python", "JavaScript / TypeScript", 
  "OpenCV", "YOLO", "Deep Learning", "Sensor Fusion", 
  "ESP32", "Raspberry Pi", "Arduino", "Microcontrollers", 
  "PyBullet", "Digital Prototyping", "Linux / Ubuntu", 
  "Docker", "Git", "Cloud APIs"
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
            transition={{ duration: 0.4, delay: i * 0.03 }}
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
