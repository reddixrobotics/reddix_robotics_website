import { motion } from 'framer-motion';
import { Section } from '@/components/ui';

export function BuildBreakDebug() {
  return (
    <Section id="experience" className="bg-surface-tertiary text-content py-32 border-y border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            WE WILL INTENTIONALLY<br/>
            <span className="text-status-error">BREAK THE SYSTEM.</span>
          </h2>
          <p className="text-xl text-content-secondary max-w-3xl mx-auto mb-16">
            BECAUSE REAL ENGINEERS KNOW HOW TO FIX IT.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { problem: 'TF ERROR', desc: 'Debug coordinate frame disconnects and missing transforms.' },
            { problem: 'NAV2 FAILURE', desc: 'Diagnose why the robot is stuck or spinning in place.' },
            { problem: 'SENSOR FAILURE', desc: 'Handle noisy LIDAR data or missing camera feeds.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface border border-status-error/30 p-8 text-left group hover:border-status-error transition-colors rounded-xl shadow-sm"
            >
              <div className="text-status-error font-mono text-sm mb-4">ERROR DETECTED</div>
              <h3 className="text-2xl font-bold mb-4 text-content">{item.problem}</h3>
              <p className="text-content-secondary mb-8">{item.desc}</p>
              
              <div className="space-y-2 font-mono text-xs text-content-muted">
                <div className="flex justify-between"><span className="text-content-secondary">OBSERVE</span> &rarr;</div>
                <div className="flex justify-between"><span className="text-content-secondary">DIAGNOSE</span> &rarr;</div>
                <div className="flex justify-between"><span className="text-status-error">ROOT CAUSE</span> &rarr;</div>
                <div className="flex justify-between"><span className="text-status-success">FIX & VERIFY</span> &rarr;</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
