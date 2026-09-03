import { motion } from 'framer-motion';
import { Section } from '@/components/ui';

export function PortfolioOutcomes() {
  return (
    <Section className="bg-surface text-content py-32 border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
            YOU DON'T LEAVE WITH<br/>
            JUST A CERTIFICATE.
          </h2>
          <p className="text-2xl text-brand font-bold mb-10">YOU LEAVE WITH PROOF.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono text-content-secondary">
            {[
              'Working ROS 2 Projects',
              'GitHub Repository',
              'Gazebo Simulation',
              'URDF/Xacro',
              'TF Tree',
              'Sensor Integration',
              'SLAM Map',
              'Nav2 Configuration',
              'Computer Vision',
              'YOLO Integration',
              'Debugging Report',
              'Test Report'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-content font-medium">
                <span className="text-brand font-bold">✓</span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-surface-secondary border border-brand/30 p-8 rounded-xl relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-[50px]" />
            <h3 className="text-xs font-mono text-content-muted mb-8 tracking-widest">REDDIX ROBOTICS</h3>
            <h4 className="text-2xl font-bold mb-6 text-content">ENGINEERING PASSPORT</h4>
            
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-content-secondary">Linux</span>
                <span className="text-brand">Applied</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-content-secondary">ROS 2</span>
                <span className="text-brand">Applied</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-content-secondary">SLAM</span>
                <span className="text-brand">Applied</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-content-secondary">Nav2</span>
                <span className="text-brand">Applied</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-content-secondary">YOLO Vision</span>
                <span className="text-brand">Applied</span>
              </div>
            </div>
            
            <div className="mt-8 text-xs text-content-muted">
              * Verification of technical proficiency based on project deliverables.
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
