import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Section, Button } from '@/components/ui';
import { ROUTES } from '@/routes/routePaths';
import { CheckoutSummary } from '@/features/checkout';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const customerInfo = location.state?.customerInfo;
  const stateItems = location.state?.items;
  const stateSubtotal = location.state?.subtotal;

  const items = stateItems || cartItems;
  const subtotal = stateSubtotal || cartSubtotal;

  useEffect(() => {
    // If cart is empty, redirect back to cart
    if (items.length === 0) {
      navigate(ROUTES.CART);
    }
  }, [items.length, navigate]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const existingScript = document.getElementById('razorpay-checkout-js');
      if (existingScript) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-js';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentError(null);
    
      try {
      const { supabase } = await import('@/lib/supabase');
      // 1. Create the order
      const payload = {
        shippingDetails: customerInfo
      };

      const mockOrderId = "MOCK-" + crypto.randomUUID().slice(0,8).toUpperCase();
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearCart();
      navigate('/order-success/' + mockOrderId, { replace: true });
    } catch (e: any) {
      console.error('Failed to process payment:', e);
      setIsLoading(false);
      setPaymentError(e.message || 'Failed to process payment. Please try again.');
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-8 pb-16">
      <Section className="py-4 border-b border-[var(--border-primary)] hidden md:block">
        <Link to="/checkout" className="inline-flex items-center text-body-sm text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Checkout
        </Link>
      </Section>

      <Section className="py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row gap-12"
          >
            {/* Left Side: Payment Details */}
            <div className="lg:w-7/12 xl:w-2/3">
              <h1 className="text-display-sm mb-8">Payment</h1>
              
              {paymentError && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-500">
                  <AlertCircle className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Payment Failed</h4>
                    <p className="text-sm">{paymentError}</p>
                  </div>
                </div>
              )}

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl p-6 mb-8">
                <h3 className="text-heading-sm mb-4">Customer Information</h3>
                {customerInfo ? (
                  <div className="grid grid-cols-2 gap-4 text-body-sm text-[var(--text-secondary)]">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Contact</p>
                      <p>{customerInfo.firstName} {customerInfo.lastName}</p>
                      <p>{customerInfo.email}</p>
                      <p>{customerInfo.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Shipping Address</p>
                      <p>{customerInfo.address}</p>
                      <p>{customerInfo.city}, {customerInfo.state} {customerInfo.zipCode}</p>
                      <p>{customerInfo.country}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-body-sm text-[var(--text-secondary)]">No customer information provided.</p>
                )}
              </div>

              <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl p-6 mb-8">
                <h3 className="text-heading-sm mb-4">Online Payments Unavailable</h3>
                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg flex items-start gap-3 text-yellow-500">
                  <AlertCircle className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm mb-1">Testing Phase (eKYC Pending)</h4>
                    <p className="text-sm">Online payments are currently not available. If you would like to place an order, please message us directly from the Contact page and we will process it manually.</p>
                  </div>
                </div>
                
                <Link to={ROUTES.CONTACT}>
                  <Button 
                    size="lg" 
                    className="w-full" 
                  >
                    Message Us to Order
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side: Summary */}
            <div className="lg:w-5/12 xl:w-1/3">
              <div className="sticky top-32">
                <CheckoutSummary items={items} subtotal={subtotal} />
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}





