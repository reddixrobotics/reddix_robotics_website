import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils';

const FAQS = [
  { q: 'Do I need previous ROS 2 experience?', a: 'No. We start from absolute zero.' },
  { q: 'Do I need to know Linux?', a: 'No prior Linux experience required. We cover it from Day 2.' },
  { q: 'Do I need Python or C++?', a: 'Basic programming helps but is not required.' },
  { q: 'Will I work with a real robot?', a: 'Yes. Kushi is a real robot built by Reddix Robotics.' },
  { q: 'Will I build my own projects?', a: 'Every day you build something real.' },
  { q: 'What will I learn in 30 days?', a: 'ROS 2, Linux, Gazebo, SLAM, Nav2, Computer Vision, YOLO, and autonomous robotics.' },
  { q: 'What happens on Day 30?', a: 'Reddix Demo Day. You demonstrate your autonomous robot.' },
  { q: 'Will I receive a certificate?', a: 'Yes, a certificate of completion from Reddix Robotics.' },
];

export function WorkshopFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={ref}
      id="faq"
      style={{ scrollMarginTop: '72px' }}
      className="py-24 md:py-32 bg-[var(--bg-primary)] text-[var(--text-primary)]"
    >
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-brand)]">FAQ</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-black tracking-tighter">COMMON QUESTIONS</h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="mt-16 flex flex-col gap-4">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] overflow-hidden">
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-6 text-left focus-visible:outline-none focus-visible:bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <span className="font-bold text-[var(--text-primary)] md:text-lg">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={cn('text-[var(--text-muted)] transition-transform duration-300', isOpen && 'rotate-180 text-[var(--color-brand)]')}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-6 text-[var(--text-secondary)]">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
