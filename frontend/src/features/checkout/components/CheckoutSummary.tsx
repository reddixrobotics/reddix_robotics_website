import { CartItem } from '@/context/CartContext';
import { ShieldAlert } from 'lucide-react';

interface CheckoutSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function CheckoutSummary({ items, subtotal }: CheckoutSummaryProps) {
  const depositRatio = 0.50; // 50% deposit
  const requiredDeposit = subtotal * depositRatio;
  const remainingBalance = subtotal - requiredDeposit;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-strong)] rounded-xl p-6 lg:p-8">
      <h3 className="text-heading-sm mb-6">Order Summary</h3>
      
      {/* Items List */}
      <div className="space-y-4 mb-8 pb-6 border-b border-[var(--border-strong)] max-h-[40vh] overflow-y-auto custom-scrollbar">
        {items.map(item => (
          <div key={item.product.id} className="flex justify-between gap-4">
            <div className="flex gap-4">
              <div className="relative w-16 h-16 bg-[var(--bg-primary)] rounded-md border border-[var(--border-strong)] overflow-hidden flex-shrink-0">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                <div className="absolute -top-2 -right-2 bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-body-md font-medium text-[var(--text-primary)] line-clamp-2">{item.product.name}</span>
                <span className="text-xs text-[var(--text-tertiary)]">{item.product.category}</span>
              </div>
            </div>
            <div className="text-body-md font-bold text-[var(--text-primary)] pt-1">
              {formatPrice(item.product.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Financials */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-body-md text-[var(--text-secondary)]">
          <span>Total Product Value</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between items-center text-body-md text-[var(--text-secondary)]">
          <span>Deposit Required</span>
          <span>50%</span>
        </div>
        
        <div className="flex justify-between items-center text-heading-md text-[var(--color-brand)] pt-2 border-t border-[var(--border-strong)] mt-2">
          <span>Pay Now (Advance)</span>
          <span>{formatPrice(requiredDeposit)}</span>
        </div>
        
        <div className="flex justify-between items-center text-body-md text-[var(--text-secondary)] pt-2">
          <span>Remaining Balance</span>
          <span>{formatPrice(remainingBalance)}</span>
        </div>
      </div>

      {/* Security Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3 text-amber-500">
        <ShieldAlert size={24} className="flex-shrink-0" />
        <p className="text-xs">
          <strong>Security Note:</strong> The prices and required deposit displayed here are estimated for your convenience. The final, authoritative payment amount and tax calculations will be securely verified by our backend systems before your payment is processed.
        </p>
      </div>
    </div>
  );
}
