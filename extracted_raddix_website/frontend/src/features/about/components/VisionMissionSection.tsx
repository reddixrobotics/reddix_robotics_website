import { motion } from 'framer-motion';
import { Section } from '@/components/ui';
import { Eye, Target } from 'lucide-react';

export default function VisionMissionSection() {
  return (
    <Section className="bg-[#0c0c0e] py-24 border-y border-zinc-900/50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 px-4 sm:px-6">
        
        {/* Our Vision */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#09090b] flex items-center justify-center text-[#ef4444] mb-8 border border-zinc-800/80 shadow-sm">
            <Eye size={28} strokeWidth={2} />
          </div>
          <h3 className="text-2xl sm:text-[28px] font-bold text-white mb-6 tracking-tight">Our Vision</h3>
          <div className="space-y-6">
            <p className="text-zinc-300 text-[17px] sm:text-[18px] leading-[1.7]">
              To build a future where intelligent robots and automation are accessible, practical, and transformative. 
            </p>
            <p className="text-zinc-300 text-[17px] sm:text-[18px] leading-[1.7]">
              We envision a world where advanced robotics are not limited to research labs, but empower businesses, students, and innovators to solve real-world problems.
            </p>
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#09090b] flex items-center justify-center text-[#ef4444] mb-8 border border-zinc-800/80 shadow-sm">
            <Target size={28} strokeWidth={2} />
          </div>
          <h3 className="text-2xl sm:text-[28px] font-bold text-white mb-6 tracking-tight">Our Mission</h3>
          <div className="space-y-6">
            <p className="text-zinc-300 text-[17px] sm:text-[18px] leading-[1.7]">
              To engineer intelligent robotic systems, empower future engineers, and accelerate the adoption of automation.
            </p>
            <p className="text-zinc-300 text-[17px] sm:text-[18px] leading-[1.7]">
              We combine AI, computer vision, and embedded systems to develop practical, real-world technology.
            </p>
          </div>
        </motion.div>

      </div>
    </Section>
  );
}
