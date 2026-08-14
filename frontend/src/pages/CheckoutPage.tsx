import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Section } from '@/components/ui';
import { ROUTES } from '@/routes/routePaths';
import { products } from '@/data/products';
import { 
  CheckoutForm, 
  CheckoutSummary, 
  PaymentSection 
} from '@/features/checkout';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items: cartItems, subtotal: cartSubtotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const buyNowProductId = queryParams.get('productId');
  const buyNowProduct = buyNowProductId ? products.find(p => p.id === buyNowProductId) : null;

  const items = buyNowProduct ? [{ product: buyNowProduct, quantity: 1 }] : cartItems;
  const subtotal = buyNowProduct ? buyNowProduct.price : cartSubtotal;
  const advanceAmount = subtotal * 0.5;

  useEffect(() => {
    // If cart is empty and not a buy now flow, redirect back to cart
    if (items.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [items.length, navigate]);

  const handleCheckoutSubmit = (formData: any) => {
    // Navigate to payment page and pass form data
    navigate('/checkout/payment', { state: { customerInfo: formData, items, subtotal } });
  };

  const triggerFormSubmit = () => {
    // Programmatically trigger the form submission which handles validation
    const form = document.getElementById('checkout-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  if (items.length === 0) return null; // Avoid flicker before redirect

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
      
      <Section className="py-4 border-b border-[var(--border-primary)] hidden md:block">
        <Link to={ROUTES.CART} className="inline-flex items-center text-body-sm text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Cart
        </Link>
      </Section>

      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            <motion.div 
              key="checkout"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row gap-12"
            >
              {/* Left Side: Form */}
              <div className="lg:w-7/12 xl:w-2/3">
                <h1 className="text-display-sm mb-8">Checkout</h1>
                
                <CheckoutForm 
                  onSubmit={handleCheckoutSubmit} 
                  isLoading={isLoading} 
                />
                
                <PaymentSection 
                  isLoading={isLoading} 
                  onPay={triggerFormSubmit} 
                  depositAmount={advanceAmount} 
                />
              </div>

              {/* Right Side: Summary */}
              <div className="lg:w-5/12 xl:w-1/3">
                <div className="sticky top-32">
                  <CheckoutSummary items={items} subtotal={subtotal} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </Section>
    </div>
  );
}
