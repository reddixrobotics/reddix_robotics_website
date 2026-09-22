import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { ShieldCheck } from 'lucide-react';
import { ROUTES } from '@/routes/routePaths';
import { CartItem } from '@/context/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const advanceAmount = items.reduce((total, item) => {
    const price = item.product.price ?? (item.product as any).basePrice ?? 0;
    const depositPerc = item.product.depositPercentage ?? 50;
    return total + (price * (depositPerc / 100) * item.quantity);
  }, 0);
  
  const remainingBalance = subtotal - advanceAmount;
  const effectivePercentage = subtotal > 0 ? Math.round((advanceAmount / subtotal) * 100) : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl p-6 lg:p-8 flex flex-col h-full">
      <h3 className="text-heading-sm mb-6">Order Summary</h3>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-body-md text-[var(--text-secondary)]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center text-body-md text-[var(--color-brand)] font-medium">
          <span>Deposit Required ({effectivePercentage}%)</span>
          <span>{formatPrice(advanceAmount)}</span>
        </div>
        
        <div className="flex justify-between items-center text-body-md text-[var(--text-secondary)]">
          <span>Remaining Balance</span>
          <span>{formatPrice(remainingBalance)}</span>
        </div>
      </div>
      
      <div className="border-t border-[var(--border-strong)] pt-6 mb-8">
        <div className="flex justify-between items-center text-heading-md">
          <span>Total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <p className="text-body-sm text-[var(--text-tertiary)] mt-2 text-right">
          *Taxes and shipping calculated at checkout
        </p>
      </div>

      <div className="mt-auto space-y-4">
        <Link to={ROUTES.CHECKOUT}>
          <Button size="lg" className="w-full">
            Proceed to Checkout
          </Button>
        </Link>
        
        <div className="flex items-start gap-3 mt-4 text-[var(--text-tertiary)]">
          <ShieldCheck size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-body-sm">
            <strong className="text-[var(--text-secondary)]">Security Note:</strong> Checkout totals and deposits will be verified securely on our servers prior to payment.
          </p>
        </div>
      </div>
    </div>
  );
}
