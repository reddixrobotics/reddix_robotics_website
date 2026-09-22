import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CareersPreviewSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[var(--bg-secondary)] py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--border-primary)] to-transparent opacity-20 pointer-events-none" />
      
      <div className="container-content relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-eyebrow mb-2">Join the Team</p>
          <h2 className="text-heading-xl mb-4">Build the future with us</h2>
          <p className="text-body-lg text-[var(--text-secondary)]">
            We are always looking for exceptional roboticists, software engineers, and visionaries to join our mission.
          </p>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 flex justify-start md:justify-end"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button size="lg" variant="outline" onClick={() => navigate('/careers')}>
            View Open Positions <ArrowRight size={18} className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
