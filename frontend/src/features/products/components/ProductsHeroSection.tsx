import { motion } from 'framer-motion';

export default function ProductsHeroSection() {
  return (
    <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[var(--bg-primary)] pt-32 pb-12 border-b border-[var(--border-primary)]">
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-[0.03] mix-blend-luminosity" />
      
      <div className="container-content relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow mb-4 text-[var(--color-brand)] tracking-widest">HARDWARE & SOFTWARE</p>
          <h1 className="text-display-md mb-6 leading-tight">
            Advanced Robotics <br/><span className="text-[var(--text-secondary)]">Marketplace</span>
          </h1>
          <p className="text-body-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Procure enterprise-grade robotic arms, autonomous mobile robots, sensory arrays, and edge compute modules for your automation needs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
