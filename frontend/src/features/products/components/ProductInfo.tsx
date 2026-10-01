import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/data/products';
import { Button, Badge } from '@/components/ui';
import { Heart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useMemo } from 'react';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
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

  // Mock colors for the layout requirement
  const colors = ['bg-[#b2d3c2]', 'bg-[#c5c1c5]', 'bg-[#2b2b2b]'];

  return (
    <div className="flex flex-col md:pl-8 pt-4">
      
      <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] mb-3 leading-tight tracking-tight">
        {product.name}
      </h1>
      
      {/* Mock Rating Section to match reference layout */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex text-yellow-400">
          <Star size={16} fill="currentColor" />
          <Star size={16} fill="currentColor" />
          <Star size={16} fill="currentColor" />
          <Star size={16} fill="currentColor" />
          <Star size={16} className="text-gray-300" />
        </div>
        <span className="text-sm text-[var(--text-secondary)]">3,345</span>
      </div>
      
      <div className="mb-8">
        <span className="text-2xl font-black text-[var(--color-brand)]">{formatPrice(product.price)}</span>
      </div>
      
      {/* Colors Section */}
      <div className="mb-10">
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">Colors</p>
        <div className="flex gap-3">
          {colors.map((color, idx) => (
            <button 
              key={idx}
              onClick={() => setSelectedColor(idx)}
              className={"w-8 h-8 rounded-md border-2 transition-all " + color + (selectedColor === idx ? ' border-gray-600 shadow-md scale-110' : ' border-transparent opacity-80 hover:opacity-100')}
              aria-label={"Select color " + idx}
            />
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col gap-4 max-w-md">
        <div className="flex gap-4">
          <button 
            onClick={handleAddToCart}
            disabled={product.availability === 'Backorder'}
            className="flex-1 py-3 px-6 rounded-md font-semibold transition-all shadow-sm flex justify-center items-center gap-2"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-brand) 15%, transparent)', color: 'var(--color-brand)' }}
          >
            {added ? 'Added to Cart' : 'Add To Cart'}
          </button>
          
          <button
            onClick={toggleWishlist}
            disabled={wishlistLoading}
            className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-md border border-[var(--border-strong)] hover:border-[var(--color-brand)] transition-colors bg-white shadow-sm"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart 
              size={20} 
              className={"transition-colors " + (isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-[var(--color-brand)]')} 
            />
          </button>
        </div>
        
        <button 
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else navigate('/checkout?productId=' + product.id);
          }}
          disabled={product.availability === 'Backorder'}
          className="w-full py-3 px-6 rounded-md font-semibold text-white transition-all shadow-md bg-[var(--color-brand)] hover:brightness-110"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
