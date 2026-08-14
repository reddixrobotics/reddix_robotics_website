import { Product } from '@/data/products';
import { Card, Button, Badge } from '@/components/ui';
import { ShoppingCart, Eye, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

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

  return (
    <Card className="p-0 overflow-hidden flex flex-col h-full border-[var(--border-strong)] hover:border-[var(--color-brand)] transition-colors group bg-[var(--bg-secondary)] card-interactive" onClick={() => navigate(`/products/${product.id}`)}>
      {/* Image container */}
      <div className="relative h-56 overflow-hidden bg-black">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-opacity duration-300 opacity-90 group-hover:opacity-100"
        />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <Badge variant="primary" size="sm">NEW</Badge>
          )}
          {product.isFeatured && (
            <Badge variant="neutral" size="sm" className="bg-[var(--bg-primary)]">FEATURED</Badge>
          )}
        </div>
        
        {/* Availability Badge */}
        <div className="absolute bottom-3 right-3">
          <span className={`text-xs font-bold px-2 py-1 rounded border ${getAvailabilityColor(product.availability)}`}>
            {product.availability}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-eyebrow text-[var(--text-tertiary)] mb-1">{product.category}</p>
        <h3 className="text-heading-sm mb-2 group-hover:text-[var(--color-brand)] transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-body-sm text-[var(--text-secondary)] mb-4 flex-grow line-clamp-2">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <p className="text-heading-md mb-4">{formatPrice(product.price)}</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 px-2 text-xs" aria-label="View Product" onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}`);
              }}>
                <Eye size={14} className="mr-1" /> View
              </Button>
              <Button variant="primary" className={`flex-1 px-2 text-xs ${added ? 'bg-green-600 hover:bg-green-700' : ''}`} disabled={product.availability === 'Backorder'} onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
                setAdded(true);
                setTimeout(() => setAdded(false), 2000);
              }}>
                {added ? (
                  <><Check size={14} className="mr-1" /> Added</>
                ) : (
                  <><ShoppingCart size={14} className="mr-1" /> Cart</>
                )}
              </Button>
            </div>
            <Button variant="outline" className="w-full text-xs border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white transition-colors" disabled={product.availability === 'Backorder'} onClick={(e) => {
              e.stopPropagation();
              navigate(`/checkout?productId=${product.id}`);
            }}>
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
