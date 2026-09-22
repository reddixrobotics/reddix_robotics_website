import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useWorkshopMedia } from '@/hooks/useWorkshopMedia';
import { cn } from '@/utils';
import { RobotHoverAnimation } from '@/features/careers/components/RobotHoverAnimation';

const ARCHITECTURE = [
  { step: '1', title: 'ROBOT ARCHITECTURE', desc: 'URDF, Links, Joints, and robot models.' },
  { step: '2', title: 'SENSORS & HARDWARE', desc: 'LiDAR, Camera, IMU, and Odometry.' },
  { step: '3', title: 'SLAM & MAPPING', desc: 'Simultaneous Localization and Mapping.' },
  { step: '4', title: 'AUTONOMOUS ROBOTICS', desc: 'Nav2, Path Planning, and Obstacle Avoidance.' },
];

export function MeetKushi() {
  const { getMedia } = useWorkshopMedia();
  const kushiMedia = getMedia('kushi');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      id="kushi-robot"
      style={{ scrollMarginTop: '72px' }}
      className="py-24 md:py-32 bg-[var(--bg-secondary)] text-[var(--text-primary)] relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[var(--color-brand)]/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand)]">Meet The Hardware</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="mt-6 mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">MEET KUSHI.</h2>
          <p className="mt-6 text-lg md:text-xl font-medium text-[var(--text-secondary)] max-w-2xl">
            The standard issue engineering platform for Reddix Robotics. You will build, program, and deploy full autonomy on this platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Media Player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full aspect-[4/3] rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-primary)] overflow-hidden shadow-2xl relative group"
          >
            <div className="w-full h-full absolute inset-0 z-10 pointer-events-auto">
              {kushiMedia?.mediaUrl ? (
                kushiMedia.mediaType === 'image' ? (
                  <img src={kushiMedia.mediaUrl} alt={kushiMedia.altText || 'Kushi'} className="w-full h-full object-cover" />
                ) : (
                  <video src={kushiMedia.mediaUrl} poster={kushiMedia.posterUrl || undefined} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                )
              ) : (
                <RobotHoverAnimation className="w-full h-full object-cover" />
              )}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 z-20">
              <div className="text-xs font-bold tracking-wider text-white/80 bg-black/40 px-3 py-1 rounded backdrop-blur-md border border-white/10">KUSHI V1.0</div>
            </div>
          </motion.div>

          {/* Architecture Steps */}
          <div className="flex flex-col gap-8">
            {ARCHITECTURE.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="flex gap-6 group"
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--color-brand)] font-bold flex items-center justify-center group-hover:border-[var(--color-brand)] group-hover:bg-[var(--color-brand)] group-hover:text-white transition-all duration-300 shadow-sm">
                    {item.step}
                  </div>
                  {i < ARCHITECTURE.length - 1 && (
                    <div className="w-px h-full bg-[var(--border-primary)] group-hover:bg-[var(--color-brand)]/50 transition-colors my-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] tracking-wide">{item.title}</h3>
                  <p className="mt-2 text-[var(--text-secondary)]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
