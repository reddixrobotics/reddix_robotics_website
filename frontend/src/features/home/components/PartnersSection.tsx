import { motion } from 'framer-motion';
import { Section } from '@/components/ui';
import { Bot, Eye, Cpu, CircuitBoard, Network, GraduationCap, Wrench, FlaskConical } from 'lucide-react';

const trustPoints = [
  { name: 'Robotics & Automation', icon: Bot },
  { name: 'AI & Computer Vision', icon: Eye },
  { name: 'ROS & Autonomous Systems', icon: Cpu },
  { name: 'Embedded Systems', icon: CircuitBoard },
  { name: 'Industrial IoT', icon: Network },
  { name: 'Robotics Training & Industry Programs', icon: GraduationCap },
  { name: 'Prototype Development', icon: Wrench },
  { name: 'Research & Development', icon: FlaskConical }
];

export default function PartnersSection() {
  return (
    <Section className="bg-[#09090b] relative overflow-hidden py-24 border-t border-zinc-900/50">
      <div className="text-center mb-12 max-w-4xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-[0.2em] text-[#ef4444] mb-4 uppercase"
        >
          ENGINEERED FOR INDUSTRY
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-zinc-300 text-base md:text-lg"
        >
          Advanced robotics and AI solutions built to solve real-world challenges.
        </motion.p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 w-full max-w-[1200px] mx-auto px-4">
        {trustPoints.map((point, i) => {
          const Icon = point.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex flex-col items-center justify-center h-[180px] bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl hover:border-zinc-700/80 hover:bg-[#111113] transition-colors duration-300 group cursor-default"
            >
              <div className="w-14 h-14 rounded-full border border-zinc-800/80 flex items-center justify-center mb-4 group-hover:border-zinc-600 transition-colors duration-300">
                <Icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300 stroke-[1.5]" />
              </div>
              <span className="text-sm font-semibold text-white tracking-wide text-center px-4 leading-relaxed">
                {point.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
