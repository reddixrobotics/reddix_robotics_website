import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Mail } from 'lucide-react';

export default function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-28 overflow-hidden bg-[var(--bg-primary)]">

      {/* ── Background decorations ── */}
      {/* Large brand glow top-right */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[480px] h-[480px] rounded-full bg-[var(--color-brand)] opacity-[0.08] blur-[100px]" />
      {/* Accent glow bottom-left */}
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-[var(--color-brand)] opacity-[0.06] blur-[90px]" />

      {/* Subtle dot-grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(var(--color-brand) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Glowing horizontal divider top ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/40 to-transparent" />

      <div className="container-content relative z-10 text-center max-w-4xl">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand)]/25 bg-[var(--color-brand)]/6 mb-8"
        >
          <Zap size={13} className="text-[var(--color-brand)]" />
          <span className="text-xs font-bold tracking-[0.15em] text-[var(--color-brand)] uppercase">
            Get Started Today
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-display-md font-bold text-[var(--text-primary)] mb-6 leading-[1.1]"
        >
          Ready to{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-[var(--color-brand)]">Automate</span>
            <span
              className="absolute inset-x-0 bottom-1 h-3 opacity-20 blur-sm rounded"
              style={{ background: 'var(--color-brand)' }}
            />
          </span>
          {' '}Your Operations?
        </motion.h2>

        {/* Sub-text */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-body-lg text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto"
        >
          Contact our engineering team to discuss how Reddix Robotics can design and
          deploy a custom autonomous solution for your business.
        </motion.p>

        {/* CTA cards row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Primary button */}
          <button
            onClick={() => navigate('/contact')}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-white text-base overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,16,20,0.35)] hover:-translate-y-0.5"
            style={{ background: 'var(--color-brand)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Mail size={18} />
              Contact Sales
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            {/* Shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </button>

          {/* Secondary button */}
          <button
            onClick={() => navigate('/contact?request=demo')}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 border-[var(--color-brand)]/40 text-[var(--color-brand)] bg-[var(--color-brand)]/5 hover:bg-[var(--color-brand)]/10 hover:border-[var(--color-brand)]/70 transition-all duration-300 hover:-translate-y-0.5"
          >
            Request a Demo
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8 text-sm text-[var(--text-muted)]"
        >
          🔒 No commitment required · Free consultation · Response within 24 hours
        </motion.p>
      </div>
    </section>
  );
}
