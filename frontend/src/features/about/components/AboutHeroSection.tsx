import { motion } from 'framer-motion';

export default function AboutHeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] pt-32 pb-16">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-4xl bg-[var(--color-brand)] rounded-full blur-[200px] opacity-10 pointer-events-none" />
      </div>

      <div className="container-content relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow mb-6 text-[var(--color-brand)] tracking-widest">ABOUT US</p>
          <h1 className="text-display-lg mb-8 leading-tight">
            We are <span className="text-gradient">Reddix Robotics</span>
          </h1>
          <p className="text-body-lg text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            A technology company focused on robotics, AI, automation, computer vision, and engineering solutions designed to elevate human potential.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
