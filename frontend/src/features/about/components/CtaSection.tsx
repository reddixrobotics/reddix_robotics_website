import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export default function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[var(--color-brand)] text-white py-24 relative overflow-hidden">
      {/* Decorative abstract elements */}
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
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-display-md mb-6">Join the Autonomous Revolution</h2>
          <p className="text-body-lg mb-10 text-white/90">
            Whether you're looking to integrate our solutions into your workflow, or you want to join our team of world-class engineers, we want to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-[var(--color-brand)] hover:bg-gray-100" onClick={() => navigate('/contact')}>Contact Us</Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" onClick={() => navigate('/careers')}>View Careers</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
