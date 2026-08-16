import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { mapApiProductToFrontend } from '@/services/publicProductService';
import apiClient from '@/services/apiClient';
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
  const { isAuthenticated, userRole, loading } = useAuth();
  const isReady = !loading;

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get('/api/wishlist');
      const mappedItems = res.data.map((item: any) => ({
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
    if (isReady && isAuthenticated && userRole === 'USER') {
      fetchWishlist();
    } else if (isReady && (!isAuthenticated || userRole !== 'USER')) {
      setItems([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, isReady, userRole]);

  const requireAuth = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return false;
    }
    return true;
  };

  const addToWishlist = async (product: Product) => {
    if (!requireAuth()) return;
    try {
      // Optimistic UI update
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        if (existingItem) return prevItems;
        return [...prevItems, { product }];
      });
      await apiClient.post('/api/wishlist', { productId: product.id });
      fetchWishlist();
    } catch (e) {
      console.error('Failed to add to wishlist', e);
      fetchWishlist(); // Revert on failure
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!requireAuth()) return;
    try {
      setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      await apiClient.delete(`/api/wishlist/${productId}`);
    } catch (e) {
      console.error('Failed to remove from wishlist', e);
      fetchWishlist();
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      totalItems,
      isLoading,
      error,
      fetchWishlist
    }}>
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
