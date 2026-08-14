import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/context/CartContext';

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleDecrease = () => {
    onUpdateQuantity(item.product.id, item.quantity - 1);
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.product.id, item.quantity + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-[var(--border-strong)] rounded-xl bg-[var(--bg-secondary)]">
      {/* Image */}
      <Link to={`/products/${item.product.id}`} className="w-full sm:w-24 h-24 flex-shrink-0 bg-[var(--bg-primary)] rounded-lg overflow-hidden block">
        <img 
          src={item.product.imageUrl} 
          alt={item.product.name} 
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Link to={`/products/${item.product.id}`} className="hover:text-[var(--color-brand)] transition-colors">
          <h4 className="text-body-lg font-bold text-[var(--text-primary)] truncate">{item.product.name}</h4>
        </Link>
        <span className="text-body-sm text-[var(--text-tertiary)]">{item.product.category}</span>
        
        <div className="mt-2 text-body-md font-medium text-[var(--text-primary)]">
          {formatPrice(item.product.price)}
        </div>
      </div>

      {/* Controls & Price */}
      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 mt-4 sm:mt-0">
        
        {/* Quantity Controls */}
        <div className="flex items-center border border-[var(--border-strong)] rounded-md overflow-hidden bg-[var(--bg-primary)]">
          <button 
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            onClick={handleDecrease}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <div className="w-10 text-center font-medium text-body-sm">{item.quantity}</div>
          <button 
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Subtotal */}
        <div className="text-body-lg font-bold text-[var(--text-primary)] w-24 text-right hidden sm:block">
          {formatPrice(item.product.price * item.quantity)}
        </div>

        {/* Remove */}
        <button 
          onClick={() => onRemove(item.product.id)}
          className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors rounded-md"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
