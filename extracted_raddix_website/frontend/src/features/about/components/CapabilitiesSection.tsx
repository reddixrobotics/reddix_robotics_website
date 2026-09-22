import { motion } from 'framer-motion';
import { Section, SectionHeading } from '@/components/ui';

const capabilities = [
  { title: "Industrial Automation", desc: "End-to-end robotic integration for manufacturing and assembly lines." },
  { title: "Autonomous Logistics", desc: "Fleet management and intelligent routing for warehouses and distribution." },
  { title: "Healthcare Robotics", desc: "Precision surgical arms and automated laboratory handling systems." },
  { title: "Field Inspection", desc: "Drones and mobile robots for hazardous or hard-to-reach environments." }
];

export default function CapabilitiesSection() {
  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="What We Do" 
        title="Cross-Industry Capabilities" 
      />
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {capabilities.map((cap, i) => (
          <motion.div
            key={i}
            className="p-6 border-l-2 border-[var(--color-brand)] bg-[var(--bg-secondary)] rounded-r-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <h4 className="text-heading-md mb-2">{cap.title}</h4>
            <p className="text-body-md text-[var(--text-secondary)]">{cap.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
