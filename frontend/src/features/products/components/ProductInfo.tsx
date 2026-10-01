import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button, Badge } from '@/components/ui';
import { Heart, ShieldCheck, Settings } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { items: wishlistItems = [], addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = useMemo(() => {
    return wishlistItems.some((item) => item.product.id === product.id);
  }, [wishlistItems, product.id]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    } catch (error) {
      console.error('Wishlist error', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Low Stock': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Backorder': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const specKeys = Object.keys(product.specifications || {}).slice(0, 4);

  return (
    <div className="flex flex-col md:pl-8 pt-2">
      
      {/* Top Badges */}
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          {product.category}
        </span>
        <span className="text-gray-300">|</span>
        <span className={"text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider " + getAvailabilityColor(product.availability)}>
          {product.availability}
        </span>
      </div>

      <h1 className="text-3xl lg:text-4xl font-black text-[var(--text-primary)] mb-4 leading-tight tracking-tight uppercase">
        {product.name}
      </h1>
      
      <p className="text-sm text-[var(--text-secondary)] mb-8 line-clamp-3 leading-relaxed">
        {product.description}
      </p>
      
      <div className="mb-10 flex items-baseline gap-4">
        <span className="text-4xl font-black text-[var(--text-primary)]">{formatPrice(product.price)}</span>
        <span className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider font-semibold">Excl. Taxes</span>
      </div>
      
      {/* Technical Highlights */}
      {specKeys.length > 0 && (
        <div className="mb-10">
          <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Key Specifications</p>
          <div className="grid grid-cols-2 gap-3">
            {specKeys.map((key, idx) => (
              <div key={idx} className="flex flex-col p-3 border border-[var(--border-strong)] bg-[var(--bg-secondary)] rounded-sm hover:border-[var(--text-primary)] transition-colors">
                <span className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">{key}</span>
                <span className="text-sm font-bold text-[var(--text-primary)] truncate" title={product.specifications[key]}>
                  {product.specifications[key]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!specKeys.length && product.features && product.features.length > 0 && (
         <div className="mb-10">
          <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-4">Core Features</p>
          <div className="flex flex-col gap-3">
             {product.features.slice(0, 3).map((feat, idx) => (
               <div key={idx} className="flex items-center text-sm text-[var(--text-secondary)] font-medium">
                 <ShieldCheck size={16} className="text-[var(--text-primary)] mr-3 flex-shrink-0" />
                 <span>{feat}</span>
               </div>
             ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex gap-4">
          <button 
            onClick={handleAddToCart}
            disabled={product.availability === 'Backorder'}
            className="flex-1 py-3 px-6 rounded-sm font-bold uppercase tracking-wider text-sm border-2 border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {added ? 'Added to Cart' : 'Add To Cart'}
          </button>
          
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-sm border-2 border-[var(--border-strong)] hover:border-[var(--text-primary)] transition-colors bg-[var(--bg-secondary)]"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={20} 
              className={"transition-colors " + (isWishlisted ? 'text-red-500 fill-red-500' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')} 
            />
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else navigate('/checkout?productId=' + product.id);
          }}
          disabled={product.availability === 'Backorder'}
          className="w-full py-4 px-6 rounded-sm font-black uppercase tracking-widest text-sm text-white transition-all bg-[var(--color-brand)] hover:brightness-110 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Order
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-8 text-[var(--text-tertiary)]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
          <ShieldCheck size={14} /> <span>1 Year Warranty</span>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
          <Settings size={14} /> <span>Tech Support</span>
        </div>
      </div>
    </div>
  );
}
