import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { mapApiProductToFrontend } from '@/services/publicProductService';
import apiClient from '@/services/apiClient';
import { useAuth } from './AuthContext';

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  advanceAmount: number;
  remainingAmount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, userRole, loading } = useAuth();
  const isReady = !loading;

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/api/cart');
      const mappedItems = res.data.map((item: any) => ({
        ...item,
        product: mapApiProductToFrontend(item.product)
      }));
      setItems(mappedItems);
    } catch (e) {
      console.error('Failed to fetch cart', e);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isReady && isAuthenticated && userRole === 'USER') {
      fetchCart().then(() => {
        const pending = sessionStorage.getItem('pendingCartAction');
        if (pending) {
          try {
            sessionStorage.removeItem('pendingCartAction');
            const action = JSON.parse(pending);
            // Since we only have productId, we need to fetch the product or just hit the API
            // The API for cart requires productId and quantity
            apiClient.post('/api/cart', { productId: action.productId, quantity: action.quantity })
              .then(() => fetchCart())
              .catch(e => console.error('Failed to add pending cart item', e));
          } catch (e) {
            console.error('Failed to parse pending cart action', e);
          }
        }
      });
    } else if (isReady && (!isAuthenticated || userRole !== 'USER')) {
      setItems([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, isReady, userRole]);

  const requireAuth = (product?: Product, quantity?: number) => {
    if (!isAuthenticated) {
      if (product && quantity) {
        sessionStorage.setItem('pendingCartAction', JSON.stringify({ productId: product.id, quantity }));
      }
      const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${redirectUrl}`;
      return false;
    }
    return true;
  };

  const addToCart = async (product: Product, quantity: number) => {
    if (!requireAuth(product, quantity)) return;
    try {
      // Optimistic UI update
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.product.id === product.id);
        if (existingItem) {
          return prevItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { product, quantity }];
      });
      await apiClient.post('/api/cart', { productId: product.id, quantity });
      // Refresh to ensure sync
      fetchCart();
    } catch (e) {
      console.error('Failed to add to cart', e);
      fetchCart(); // Revert on failure
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!requireAuth()) return;
    try {
      setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      await apiClient.delete(`/api/cart/${productId}`);
    } catch (e) {
      console.error('Failed to remove from cart', e);
      fetchCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!requireAuth()) return;
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      setItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        )
      );
      await apiClient.put(`/api/cart/${productId}`, { quantity });
    } catch (e) {
      console.error('Failed to update quantity', e);
      fetchCart();
    }
  };

  const clearCart = async () => {
    if (!requireAuth()) return;
    try {
      setItems([]);
      await apiClient.delete('/api/cart');
    } catch (e) {
      console.error('Failed to clear cart', e);
      fetchCart();
    }
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => {
    const price = item.product.price ?? (item.product as any).basePrice ?? 0;
    return total + (price * item.quantity);
  }, 0);
  const advanceAmount = items.reduce((total, item) => {
    const price = item.product.price ?? (item.product as any).basePrice ?? 0;
    const depositPerc = item.product.depositPercentage ?? 50; // Fallback to 50% if backend misses it
    return total + (price * (depositPerc / 100) * item.quantity);
  }, 0);
  const remainingAmount = subtotal - advanceAmount;

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      advanceAmount,
      remainingAmount,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
