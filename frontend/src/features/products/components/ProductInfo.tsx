import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button, Badge } from '@/components/ui';
import { ShoppingCart, CreditCard, Minus, Plus, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 border-green-200 dark:border-green-900';
      case 'Low Stock': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900';
      case 'Backorder': return 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 border-red-200 dark:border-red-900';
      default: return '';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
    setAdded(false);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-3">
        <span className="text-eyebrow text-[var(--text-tertiary)]">{product.category}</span>
        {product.isNew && <Badge variant="primary" size="sm">NEW</Badge>}
      </div>
      
      <h1 className="text-display-sm mb-4">{product.name}</h1>
      
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border-strong)]">
        <span className="text-heading-lg text-[var(--text-primary)]">{formatPrice(product.price)}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded border shadow-sm ${getAvailabilityColor(product.availability)}`}>
          {product.availability}
        </span>
      </div>
      
      <p className="text-body-lg text-[var(--text-secondary)] mb-8">
        {product.description}
      </p>

      {/* Security Note: Price calculation here is purely for display. Real calculations must occur securely on the NestJS backend. */}
      
      <div className="space-y-6">
        <div>
          <label className="block text-body-sm text-[var(--text-secondary)] mb-2">Quantity</label>
          <div className="flex items-center w-32 border border-[var(--border-strong)] rounded-md overflow-hidden bg-[var(--bg-secondary)]">
            <button 
              className="px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-50"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus size={16} />
            </button>
            <div className="flex-1 text-center font-medium text-[var(--text-primary)]">{quantity}</div>
            <button 
              className="px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            size="lg" 
            className={`flex-1 transition-all ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
            disabled={product.availability === 'Backorder'}
            onClick={handleAddToCart}
          >
            {added ? (
              <><Check size={18} className="mr-2" /> Added</>
            ) : (
              <><ShoppingCart size={18} className="mr-2" /> Add to Cart</>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="flex-1"
            disabled={product.availability === 'Backorder'}
            onClick={() => navigate(`/checkout?productId=${product.id}`)}
          >
            <CreditCard size={18} className="mr-2" /> Buy Now
          </Button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--border-strong)]">
        <div className="flex items-center gap-3 text-[var(--text-secondary)]">
          <ShieldCheck size={20} className="text-[var(--color-brand)]" />
          <span className="text-body-sm">Includes 2-year enterprise hardware warranty and dedicated support.</span>
        </div>
      </div>
    </div>
  );
}
