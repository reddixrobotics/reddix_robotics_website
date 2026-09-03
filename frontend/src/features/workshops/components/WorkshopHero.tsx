import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useWorkshopMedia } from '@/hooks/useWorkshopMedia';
import { cn } from '@/utils';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfOHo7D9BNF0ZeL7CAQTIMxhq_XQyWgo6oczNFk3QNXi5ifxQ/viewform?usp=header';

export function WorkshopHero() {
  const { getMedia } = useWorkshopMedia();
  const heroMedia = getMedia('hero');

  const scrollToProgram = useCallback(() => {
    const el = document.getElementById('program');
    if (!el) return;
    const navH = 72;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0505] text-[#f4f4f4]">
      {/* Background radial glow */}
      {heroMedia?.mediaUrl ? (
        <div className="absolute inset-0 z-0">
          {heroMedia.mediaType === 'image' ? (
            <img src={heroMedia.mediaUrl} alt={heroMedia.altText || 'Hero'} className="w-full h-full object-cover opacity-50" />
          ) : (
            <video src={heroMedia.mediaUrl} poster={heroMedia.posterUrl || undefined} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#c1121f]/[0.08] blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
      )}
      
      {/* Fallback pattern / subtle grid if needed */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#a8a8a8] text-sm font-medium tracking-wide mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c1121f] shadow-[0_0_8px_rgba(193,18,31,0.8)]" />
            Reddix Robotics <span className="opacity-40 px-1">·</span> Online & Offline ROS 2 Residency
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-[84px] font-black tracking-tight leading-[1.05] max-w-5xl"
        >
          <span className="text-white">Write Real Code.</span>
          <br />
          <span className="text-[#c1121f] drop-shadow-[0_0_40px_rgba(193,18,31,0.5)]">Not Just Theory.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 text-lg md:text-xl text-[#a8a8a8] font-medium"
        >
          Online & Offline. Hands-on. Full ROS 2 stack, real hardware, in 30 days.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 mt-12"
        >
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#c1121f] text-white font-bold text-base hover:bg-[#a00f1a] transition-all duration-200 active:scale-[0.97] shadow-[0_0_20px_rgba(193,18,31,0.3)]"
          >
            Apply for the Cohort <ArrowRight size={18} />
          </a>
          <button
            onClick={scrollToProgram}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#f0ebd8] text-[#0a0908] font-bold text-base hover:bg-white transition-all duration-200 active:scale-[0.97]"
          >
            View Curriculum <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-3 gap-8 mt-20 pt-10 border-t border-[var(--border-subtle)] w-full max-w-lg"
        >
          {[['30', 'Days'], ['1', 'Real Robot'], ['100%', 'Hands-On']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-[var(--color-brand)]">{val}</div>
              <div className="text-xs font-semibold tracking-wide text-[var(--text-secondary)] uppercase mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToProgram}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-label="Scroll to program"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--color-brand)] hover:border-[var(--color-brand)] transition-colors"
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
