import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export default function ApplicationCtaSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[var(--color-brand)] text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="container-content relative z-10 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-display-md mb-6">Don't see a perfect match?</h2>
          <p className="text-body-lg mb-10 text-white/90">
            We are always on the lookout for exceptional talent. Submit a general application and we'll reach out when the right opportunity arises.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-white text-[var(--color-brand)] hover:bg-gray-100" onClick={() => navigate('/careers/general-apply')}>
              Submit General Application
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
