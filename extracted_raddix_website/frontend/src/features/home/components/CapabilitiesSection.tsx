import { motion } from 'framer-motion';
import { Section, SectionHeading, Card } from '@/components/ui';
import { Cpu, Zap, Eye, Settings, Shield, Globe } from 'lucide-react';

const capabilities = [
  {
    icon: <Cpu size={24} className="text-[var(--color-brand)]" />,
    title: 'Autonomous Navigation',
    description: 'Advanced SLAM and path planning algorithms allowing robots to navigate complex, dynamic environments seamlessly.'
  },
  {
    icon: <Eye size={24} className="text-[var(--color-brand)]" />,
    title: 'Computer Vision',
    description: 'State-of-the-art object detection, semantic segmentation, and spatial awareness using deep learning models.'
  },
  {
    icon: <Zap size={24} className="text-[var(--color-brand)]" />,
    title: 'Edge Computing',
    description: 'High-performance on-device processing for real-time decision making with minimal latency requirements.'
  },
  {
    icon: <Settings size={24} className="text-[var(--color-brand)]" />,
    title: 'Precision Actuation',
    description: 'Custom-designed actuators and motor controllers delivering sub-millimeter accuracy and high torque output.'
  },
  {
    icon: <Shield size={24} className="text-[var(--color-brand)]" />,
    title: 'Failsafe Systems',
    description: 'Redundant hardware and software safety layers ensuring reliable operation in mission-critical scenarios.'
  },
  {
    icon: <Globe size={24} className="text-[var(--color-brand)]" />,
    title: 'Fleet Management',
    description: 'Cloud-based orchestration for monitoring, updating, and coordinating thousands of robotic units globally.'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CapabilitiesSection() {
  return (
    <Section className="bg-[var(--bg-secondary)]">
      <SectionHeading 
        eyebrow="What We Do" 
        title="Core Capabilities" 
        description="Our technology stack covers the entire robotics lifecycle, from hardware design to cloud orchestration."
      />
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        {capabilities.map((item, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card interactive className="h-full border-[var(--border-primary)] hover:border-[var(--color-brand)] transition-colors">
              <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-heading-md mb-3">{item.title}</h3>
              <p className="text-body-sm text-[var(--text-secondary)]">
                {item.description}
              </p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
