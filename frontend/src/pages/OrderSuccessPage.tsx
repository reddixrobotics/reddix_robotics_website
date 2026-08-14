import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Section, Button } from '@/components/ui';
import { ROUTES } from '@/routes/routePaths';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <Section className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-2xl p-12"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
            </div>
            
            <h1 className="text-display-sm mb-4">Payment successful</h1>
            <p className="text-body-lg text-[var(--text-secondary)] mb-8">
              Your order has been placed successfully.
            </p>
            
            {id && (
              <div className="bg-[var(--bg-tertiary)] inline-block px-4 py-2 rounded-lg mb-8">
                <span className="text-body-sm text-[var(--text-secondary)]">Order ID: </span>
                <span className="font-mono font-bold">{id}</span>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/dashboard/orders">
                <Button size="lg" variant="outline">
                  Track Order
                </Button>
              </Link>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg">
                  Continue Shopping <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
