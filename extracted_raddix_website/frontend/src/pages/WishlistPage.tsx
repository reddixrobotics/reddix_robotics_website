import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routes/routePaths';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { cn, formatCurrency } from '@/utils';

export default function WishlistPage() {
  const { items: wishlistItems = [], removeFromWishlist, isLoading, error, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, 1);
      // Item added successfully
    } catch (err: any) {
      console.error(err.message || 'Failed to add to cart');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId);
      // Item removed successfully
    } catch (err: any) {
      console.error(err.message || 'Failed to remove from wishlist');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spinner rounded-full border-2 border-[var(--border-strong)] border-t-[var(--color-brand)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-content py-12 md:py-16">
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)]">
          <Heart size={48} className="text-red-500 mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2 text-red-500">{error}</h2>
          <button onClick={fetchWishlist} className="btn btn-primary mt-4">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-content py-12 md:py-16">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Heart className="text-red-500 fill-red-500" />
          My Wishlist
        </h1>
        <p className="text-[var(--text-secondary)]">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 text-center bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)]">
          <Heart size={48} className="text-[var(--text-muted)] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-md">
            Looks like you haven't added anything to your wishlist yet.
            Explore our products and save your favorites!
          </p>
          <Link to={ROUTES.PRODUCTS} className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.product.id}
              className="flex flex-col bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)] overflow-hidden hover:border-[var(--color-brand)] transition-all duration-300 group"
            >
              {/* Image */}
              <Link to={`/products/${item.product.id}`} className="block relative aspect-[4/3] bg-[var(--bg-tertiary)] overflow-hidden">
                <img
                  src={item.product.imageUrl || (item.product as any).images?.[0]?.url || 'https://placehold.co/300x300?text=No+Image'}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove(item.product.id);
                  }}
                  className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-black/80 rounded-full text-red-500 hover:text-red-600 hover:scale-110 transition-all shadow-md focus-ring"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </Link>
              
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <Link to={`/products/${item.product.id}`} className="font-semibold text-lg hover:text-[var(--color-brand)] transition-colors line-clamp-1 mb-1">
                  {item.product.name}
                </Link>
                <div className="text-[var(--text-secondary)] font-medium mb-4">
                  {formatCurrency(item.product.price ?? (item.product as any).basePrice ?? 0)}
                </div>
                
                <div className="mt-auto">
                  <button
                    onClick={() => handleAddToCart(item.product)}
                    className="w-full btn btn-primary py-2 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
