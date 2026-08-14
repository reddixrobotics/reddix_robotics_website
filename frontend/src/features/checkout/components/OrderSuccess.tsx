import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/routes/routePaths';

export default function OrderSuccess() {
  const orderId = `RDX-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={48} className="text-green-500" />
      </div>
      
      <h2 className="text-display-sm mb-4">Payment Successful</h2>
      <p className="text-body-lg text-[var(--text-secondary)] mb-8 max-w-lg">
        Thank you for your order. We have successfully processed your deposit and secured your robotics hardware reservation.
      </p>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl p-6 mb-10 min-w-[300px]">
        <p className="text-body-sm text-[var(--text-tertiary)] mb-1">Order Reference Number</p>
        <p className="text-heading-md font-mono text-[var(--text-primary)]">{orderId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link to={ROUTES.HOME}>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Return to Home
          </Button>
        </Link>
        <Link to={ROUTES.PRODUCTS}>
          <Button size="lg" className="w-full sm:w-auto">
            <Package size={18} className="mr-2" /> Explore More Products
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
