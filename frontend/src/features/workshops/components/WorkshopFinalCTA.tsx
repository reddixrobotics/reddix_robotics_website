import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfOHo7D9BNF0ZeL7CAQTIMxhq_XQyWgo6oczNFk3QNXi5ifxQ/viewform?usp=header';

export function WorkshopFinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-black text-white overflow-hidden text-center">
      {/* Background visual */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[var(--color-brand)]/10 blur-[150px] opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05]">
            READY TO STOP <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">JUST WATCHING?</span>
          </h2>
          <p className="mt-8 text-xl md:text-2xl font-bold tracking-wide text-white/70">
            30 DAYS. ONE ROBOT. ONE ENGINEERING JOURNEY.
          </p>
          
          <div className="mt-14 flex justify-center">
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-5 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-black text-lg md:text-xl tracking-wide shadow-[0_0_40px_rgba(var(--color-brand-rgb),0.4)] hover:shadow-[0_0_60px_rgba(var(--color-brand-rgb),0.6)] transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Apply Now <ArrowRight size={24} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
