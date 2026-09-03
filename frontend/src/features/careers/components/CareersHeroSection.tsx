import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { ArrowRight, Users, Cpu, Rocket, MapPin } from 'lucide-react';
import { RobotHoverAnimation } from './RobotHoverAnimation';

const stats = [
  { icon: Users,  value: '50+',  label: 'Team Members'     },
  { icon: Cpu,    value: '20+',  label: 'Projects Deployed' },
  { icon: Rocket, value: '5+',   label: 'Years of R&D'     },
  { icon: MapPin, value: 'HYD',  label: 'Hyderabad, India'  },
];

export default function CareersHeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden bg-[var(--bg-primary)] py-12">

      {/* ── Background decorations ── */}
      <div className="pointer-events-none absolute top-0 right-0 w-[650px] h-[650px] rounded-full bg-[var(--color-brand)] opacity-[0.06] blur-[110px] translate-x-1/3 -translate-y-1/4" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[var(--color-brand)] opacity-[0.04] blur-[90px] -translate-x-1/3 translate-y-1/3" />

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-brand) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glowing bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/30 to-transparent" />

      <div className="container-content relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6 items-center">

          {/* ── Left: Text content ── */}
          <div className="flex flex-col justify-center py-4 lg:py-0">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 self-start px-4 py-1.5 rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/6 mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.18em] text-[var(--color-brand)] uppercase">
                Careers at Reddix
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-display-lg font-bold text-[var(--text-primary)] leading-[1.08] mb-6"
            >
              Build the{' '}
              <span className="relative inline-block">
                <span className="text-[var(--color-brand)]">Autonomous</span>
                <span
                  className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--color-brand), transparent)' }}
                />
              </span>
              <br />
              Future with Us
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-body-lg text-[var(--text-secondary)] mb-10 max-w-lg leading-relaxed"
            >
              Join a world-class team of roboticists, AI researchers, and engineers
              solving the most complex challenges in autonomous systems and industrial automation.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-14"
            >
              <button
                onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,16,20,0.3)] hover:-translate-y-0.5"
                style={{ background: 'var(--color-brand)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Open Positions
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <button
                onClick={() => document.getElementById('culture')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold border-2 border-[var(--color-brand)]/30 text-[var(--color-brand)] bg-[var(--color-brand)]/5 hover:bg-[var(--color-brand)]/10 hover:border-[var(--color-brand)]/60 transition-all duration-300 hover:-translate-y-0.5"
              >
                Our Culture
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center sm:items-start gap-1 p-3 rounded-xl bg-[var(--surface-card)] border border-[var(--border-primary)]"
                  >
                    <Icon size={16} className="text-[var(--color-brand)] mb-0.5" />
                    <span className="text-xl font-bold text-[var(--text-primary)]">{stat.value}</span>
                    <span className="text-[11px] text-[var(--text-muted)] font-medium">{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* ── Right: Robot image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center lg:justify-end -mt-8"
          >
            {/* Outer glow ring */}
            <div
              className="absolute w-[420px] h-[420px] rounded-full border border-[var(--color-brand)]/10 animate-[spin_20s_linear_infinite]"
              style={{ borderStyle: 'dashed' }}
            />
            <div className="absolute w-[320px] h-[320px] rounded-full border border-[var(--color-brand)]/15" />

            {/* Brand colored glow behind robot */}
            <div className="absolute w-72 h-72 rounded-full bg-[var(--color-brand)] opacity-[0.08] blur-[60px]" />

            {/* Robot image container */}
            <div className="relative z-10 w-[360px] h-[360px] flex items-center justify-center">

              {/* Floating card — top left */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -top-4 -left-6 z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-primary)] shadow-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)]/10 flex items-center justify-center">
                  <Cpu size={16} className="text-[var(--color-brand)]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[var(--text-primary)]">ROS2 Powered</p>
                  <p className="text-[10px] text-[var(--text-muted)]">Autonomous Navigation</p>
                </div>
              </motion.div>

              {/* Floating card — bottom right */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="absolute -bottom-4 -right-4 z-20 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[var(--surface-card)] border border-[var(--border-primary)] shadow-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[var(--text-primary)]">Live & Active</p>
                  <p className="text-[10px] text-[var(--text-muted)]">In field deployment</p>
                </div>
              </motion.div>

              {/* Robot image */}
              <div className="relative w-full h-full">
                {/* Image background plate & Animation container */}
                <div className="absolute inset-8 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden">
                  <RobotHoverAnimation 
                    className="w-full h-full block"
                  />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
