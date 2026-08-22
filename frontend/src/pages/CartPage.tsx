import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Section, Button } from '@/components/ui';
import { CartItemCard, OrderSummary } from '@/features/cart';
import { ROUTES } from '@/routes/routePaths';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      <Section className="py-0">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-8">
            <Link to={ROUTES.PRODUCTS} className="inline-flex items-center text-body-sm text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors mb-4 hidden md:flex">
              <ArrowLeft size={16} className="mr-2" /> Continue Shopping
            </Link>
            <h1 className="text-display-sm mb-4">Shopping Cart</h1>
            <p className="text-body-lg text-[var(--text-secondary)]">
              {isEmpty 
                ? "Your cart is currently empty."
                : `You have ${items.length} item${items.length === 1 ? '' : 's'} in your cart.`}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isEmpty ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--bg-secondary)]"
              >
                <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
                  <ShoppingCart size={32} className="text-[var(--text-secondary)]" />
                </div>
                <h3 className="text-heading-md mb-2">Your cart is empty</h3>
                <p className="text-body-md text-[var(--text-secondary)] mb-8 max-w-md text-center">
                  Looks like you haven't added any robotics or automation equipment to your cart yet.
                </p>
                <Link to={ROUTES.PRODUCTS}>
                  <Button size="lg">
                    Continue Shopping <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="filled"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col lg:flex-row gap-12"
              >
                {/* Cart Items List */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CartItemCard 
                          item={item} 
                          onUpdateQuantity={updateQuantity}
                          onRemove={removeFromCart}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                  <div className="sticky top-32">
                    <OrderSummary items={items} subtotal={subtotal} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
}
