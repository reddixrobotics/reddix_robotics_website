import { Button } from '@/components/ui';
import { CreditCard, Loader2 } from 'lucide-react';

interface PaymentSectionProps {
  isLoading: boolean;
  onPay: () => void;
  depositAmount: number;
}

export default function PaymentSection({ isLoading, onPay, depositAmount }: PaymentSectionProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="mt-8 border-t border-[var(--border-strong)] pt-8">
      <h3 className="text-heading-sm mb-4">Payment Method</h3>
      
      {/* Mock Payment Selector */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-[var(--color-brand)] bg-[var(--color-brand)]/5 rounded-lg p-4 flex items-center gap-3 cursor-pointer">
          <CreditCard className="text-[var(--color-brand)]" />
          <span className="font-medium text-[var(--text-primary)]">Credit Card / Razorpay</span>
        </div>
        <div className="border border-[var(--border-strong)] rounded-lg p-4 flex items-center gap-3 opacity-50 cursor-not-allowed">
          <span className="font-medium text-[var(--text-secondary)]">Bank Transfer (Coming Soon)</span>
        </div>
      </div>
      
      <p className="text-body-sm text-[var(--text-secondary)] mb-6">
        Clicking the button below will securely initialize the Razorpay gateway to process your deposit of {formatPrice(depositAmount)}.
      </p>

      {/* 
        NOTE: This button triggers the form submission externally by calling the 'submit' method on the form,
        ensuring validation happens before the payment simulation runs.
      */}
      <Button 
        size="lg" 
        className="w-full h-14 text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand/20"
        disabled={isLoading}
        onClick={onPay}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" /> Processing Payment...
          </>
        ) : (
          <>
            Place Order & Pay {formatPrice(depositAmount)}
          </>
        )}
      </Button>
    </div>
  );
}
