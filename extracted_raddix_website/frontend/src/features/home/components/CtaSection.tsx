import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export default function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="relative py-32 bg-[#111] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {/* Abstract pattern background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-brand)] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>
      
      <div className="container-content relative z-10 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-display-md mb-6">Ready to Automate Your Operations?</h2>
          <p className="text-body-lg text-gray-400 mb-10">
            Contact our engineering team to discuss how Reddix Robotics can design and deploy a custom autonomous solution for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="px-8" onClick={() => navigate('/contact')}>Contact Sales</Button>
            <Button variant="outline" size="lg" className="px-8 text-white border-white hover:bg-white hover:text-black" onClick={() => navigate('/contact?request=demo')}>
              Request a Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
