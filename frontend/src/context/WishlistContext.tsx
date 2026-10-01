import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { mapApiProductToFrontend } from '@/services/publicProductService';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface WishlistItem {
  id?: string;
  product: Product;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
  isLoading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, userRole, loading, user } = useAuth();
  const isReady = !loading;

  const fetchWishlist = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('WishlistItem')
        .select('*, product:Product(*, images:ProductImage(*))')
        .eq('userId', user.id);
        
      if (error) throw error;
      
      const mappedItems = (data || []).map((item: any) => ({
        ...item,
        product: mapApiProductToFrontend(item.product)
      }));
      setItems(mappedItems);
    } catch (e) {
      console.error('Failed to fetch wishlist', e);
      setItems([]);
      setError('Unable to load your wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && isAuthenticated && userRole === 'USER' && user) {
      fetchWishlist();
    } else if (isReady && (!isAuthenticated || userRole !== 'USER')) {
      setItems([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, isReady, userRole, user]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${redirectUrl}`;
      return false;
    }
    return true;
  };

  const addToWishlist = async (product: Product) => {
    if (!requireAuth() || !user) return;
    try {
      // Optimistic update
      setItems(prev => {
        if (prev.some(item => item.product.id === product.id)) return prev;
        return [...prev, { product }];
      });
      
      const { data: existing } = await supabase
        .from('WishlistItem')
        .select('id')
        .eq('userId', user.id)
        .eq('productId', product.id)
        .maybeSingle();

      if (!existing) {
        await supabase
          .from('WishlistItem')
          .insert({ userId: user.id, productId: product.id });
      }
      
      // We don't need to re-fetch unless we want the real ID, but typically it's fine
      fetchWishlist();
    } catch (e) {
      console.error('Failed to add to wishlist', e);
      fetchWishlist();
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!requireAuth() || !user) return;
    try {
      setItems(prev => prev.filter(item => item.product.id !== productId));
      
      await supabase
        .from('WishlistItem')
        .delete()
        .eq('userId', user.id)
        .eq('productId', productId);
    } catch (e) {
      console.error('Failed to remove from wishlist', e);
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalItems: items.length,
        isLoading,
        error,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
