import { motion } from 'framer-motion';
import { Section, SectionHeading, Card } from '@/components/ui';
import { ShieldCheck, Lightbulb, Users, Zap } from 'lucide-react';

const values = [
  {
    icon: <ShieldCheck size={28} className="text-[var(--color-brand)]" />,
    title: 'Safety First',
    description: 'We prioritize the safety of humans interacting with our autonomous systems above all else, embedding redundant failsafes into every product.'
  },
  {
    icon: <Lightbulb size={28} className="text-[var(--color-brand)]" />,
    title: 'Relentless Innovation',
    description: 'We continuously challenge the status quo, pushing the boundaries of AI, materials science, and mechatronic engineering.'
  },
  {
    icon: <Users size={28} className="text-[var(--color-brand)]" />,
    title: 'Human-Centric',
    description: 'Our robots are designed to augment and elevate human potential, taking on dull, dirty, and dangerous tasks so people can focus on creativity.'
  },
  {
    icon: <Zap size={28} className="text-[var(--color-brand)]" />,
    title: 'Reliability',
    description: 'We engineer our systems to perform flawlessly in the most demanding and unconstrained environments, 24/7.'
  }
];

export default function CoreValuesSection() {
  return (
    <Section className="bg-[var(--bg-primary)]">
      <SectionHeading 
        eyebrow="Our Principles" 
        title="Core Values" 
        description="The fundamental beliefs that guide our research, engineering, and business decisions."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-5xl mx-auto">
        {values.map((value, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="h-full border-[var(--border-primary)] flex flex-col items-start p-8">
              <div className="mb-6 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-strong)]">
                {value.icon}
              </div>
              <h4 className="text-heading-md mb-3">{value.title}</h4>
              <p className="text-body-md text-[var(--text-secondary)]">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
