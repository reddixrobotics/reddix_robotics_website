import { motion } from 'framer-motion';
import { Section } from '@/components/ui';

export function NotNormalCourse() {
  return (
    <Section className="bg-surface text-content py-32 border-t border-border-subtle">
      <div className="max-w-4xl mx-auto text-center px-6">
        <motion.h2 
          className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          STOP WATCHING ROS 2 TUTORIALS.<br />
          <span className="text-brand">START BUILDING ROBOTS.</span>
        </motion.h2>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 text-xl md:text-2xl font-bold tracking-widest text-content-muted mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {['LEARN', 'BUILD', 'BREAK', 'DEBUG', 'INTEGRATE', 'DEPLOY'].map((step, idx, arr) => (
            <motion.div 
              key={step} 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <span className={idx === arr.length - 1 ? 'text-content' : ''}>{step}</span>
              {idx !== arr.length - 1 && <span className="text-brand">&rarr;</span>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
