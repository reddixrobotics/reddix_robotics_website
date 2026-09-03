import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';
import { Cpu, Zap, Settings, Shield, Globe } from 'lucide-react';

const OpenCVIcon = ({ size, className }: { size?: number, className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" width={size || 26} height={size || 26} className={className}>
    <circle cx="10" cy="10" r="6" fill="#7C1014"/>
    <circle cx="22" cy="10" r="6" fill="#16803C"/>
    <circle cx="16" cy="22" r="6" fill="#1D6FA4"/>
    <circle cx="10" cy="10" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="22" cy="10" r="3" fill="white" fillOpacity="0.4"/>
    <circle cx="16" cy="22" r="3" fill="white" fillOpacity="0.4"/>
  </svg>
);

const capabilities = [
  {
    icon: Cpu,
    title: 'Autonomous Navigation',
    description: 'Advanced SLAM and path planning algorithms allowing robots to navigate complex, dynamic environments seamlessly.',
    accent: 'from-[var(--color-brand)] to-rose-700',
    delay: 0,
  },
  {
    icon: OpenCVIcon,
    title: 'Computer Vision',
    description: 'State-of-the-art object detection, semantic segmentation, and spatial awareness using deep learning models.',
    accent: 'from-rose-700 to-red-800',
    delay: 0.1,
  },
  {
    icon: Zap,
    title: 'Edge Computing',
    description: 'High-performance on-device processing for real-time decision making with minimal latency requirements.',
    accent: 'from-red-800 to-[var(--color-brand)]',
    delay: 0.2,
  },
  {
    icon: Settings,
    title: 'Precision Actuation',
    description: 'Custom-designed actuators and motor controllers delivering sub-millimeter accuracy and high torque output.',
    accent: 'from-[var(--color-brand)] to-rose-800',
    delay: 0.3,
  },
  {
    icon: Shield,
    title: 'Failsafe Systems',
    description: 'Redundant hardware and software safety layers ensuring reliable operation in mission-critical scenarios.',
    accent: 'from-rose-800 to-red-900',
    delay: 0.4,
  },
  {
    icon: Globe,
    title: 'Fleet Management',
    description: 'Cloud-based orchestration for monitoring, updating, and coordinating thousands of robotic units globally.',
    accent: 'from-red-900 to-[var(--color-brand)]',
    delay: 0.5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function CapabilitiesSection() {
  return (
    <Section className="bg-[var(--bg-secondary)] overflow-hidden relative">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[var(--color-brand)] opacity-[0.04] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[var(--color-brand)] opacity-[0.04] blur-3xl" />

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
        viewport={{ once: true, margin: '-80px' }}
      >
        {capabilities.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} variants={itemVariants}>
              <div className="group relative h-full bg-[var(--surface-card)] border border-[var(--border-primary)] rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:border-[var(--color-brand)] hover:shadow-[0_8px_30px_rgba(124,16,20,0.12)] hover:-translate-y-1 cursor-default">

                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${item.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Corner glow */}
                <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[var(--color-brand)] opacity-0 group-hover:opacity-[0.06] blur-2xl transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative mb-6 inline-flex">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.accent} p-[2px] shadow-sm`}>
                    <div className="w-full h-full rounded-[10px] bg-[var(--surface-card)] flex items-center justify-center">
                      <Icon size={26} className="text-[var(--color-brand)] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>
                  {/* Ping effect */}
                  <span className="absolute -top-1 -right-1 w-3 h-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand)] opacity-20" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-brand)] opacity-40" />
                  </span>
                </div>

                {/* Number badge */}
                <div className="absolute top-5 right-5 text-[var(--border-strong)] text-xs font-mono font-bold opacity-40 group-hover:opacity-70 transition-opacity duration-300 select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <h3 className="text-heading-md mb-3 text-[var(--text-primary)] group-hover:text-[var(--color-brand)] transition-colors duration-200">
                  {item.title}
                </h3>

                <p className="text-body-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>

              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
