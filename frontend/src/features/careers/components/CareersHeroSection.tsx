import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

export default function CareersHeroSection() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] pt-32 pb-16">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-0" />

      <div className="container-content relative z-10 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow mb-4 text-[var(--color-brand)] tracking-widest">CAREERS AT REDDIX</p>
          <h1 className="text-display-lg mb-6 leading-tight">
            Build the <span className="text-gradient">Autonomous Future</span>
          </h1>
          <p className="text-body-lg text-[var(--text-secondary)] mb-10">
            Join a world-class team of roboticists, AI researchers, and engineers solving the most complex challenges in automation.
          </p>
          <Button size="lg" className="px-8" onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}>
            View Open Positions
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
