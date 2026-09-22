import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useWorkshopMedia } from '@/hooks/useWorkshopMedia';

const STEPS = [
  { num: '1', title: 'Setup', desc: 'Configure Linux & ROS 2 environment.' },
  { num: '2', title: 'Architecture', desc: 'Design nodes, topics, and services.' },
  { num: '3', title: 'Simulation', desc: 'Build the digital twin in Gazebo.' },
  { num: '4', title: 'Hardware', desc: 'Integrate real sensors and actuators.' },
  { num: '5', title: 'Algorithms', desc: 'Implement SLAM and Navigation.' },
  { num: '6', title: 'Testing', desc: 'Verify behavior in complex environments.' },
  { num: '7', title: 'Debugging', desc: 'Analyze tf trees and node graphs.' },
  { num: '8', title: 'Deployment', desc: 'Final launch on real hardware.' },
];

export function WorkshopExperience() {
  const { getMedia } = useWorkshopMedia();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="experience"
      style={{ scrollMarginTop: '72px' }}
      className="py-24 md:py-32 bg-[var(--bg-secondary)] text-[var(--text-primary)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand)]">The Experience</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6 mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">BUILD. BREAK. DEBUG. REPEAT.</h2>
          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl font-medium">
            Engineering isn't about everything working on the first try. It's about learning how to fix it when it doesn't.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
              className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)]"
            >
              <div className="text-[var(--color-brand)] font-mono font-bold text-sm mb-2">0{step.num}</div>
              <h3 className="font-bold text-[var(--text-primary)] mb-1">{step.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Experience Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((num) => {
            const media = getMedia(`experience-${num}`);
            if (!media?.mediaUrl) return null;
            return (
              <motion.div
                key={`exp-${num}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + num * 0.1 }}
                className="w-full aspect-video rounded-2xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-lg relative group"
              >
                {media.mediaType === 'image' ? (
                  <img src={media.mediaUrl} alt={media.altText || `Experience ${num}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <video src={media.mediaUrl} poster={media.posterUrl || undefined} autoPlay loop muted playsInline className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                {media.altText && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">{media.altText}</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
