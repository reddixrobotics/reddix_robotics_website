import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import { mapApiProductToFrontend } from '@/services/publicProductService';
import { supabase } from '@/lib/supabase';
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
  const { isAuthenticated, userRole, loading, user } = useAuth();
  const isReady = !loading;

  const fetchCart = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('CartItem')
        .select('*, product:Product(*, images:ProductImage(*))')
        .eq('userId', user.id);
        
      if (error) throw error;
      
      const mappedItems = (data || []).map((item: any) => ({
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
    if (isReady && isAuthenticated && userRole === 'USER' && user) {
      fetchCart().then(() => {
        const pending = sessionStorage.getItem('pendingCartAction');
        if (pending) {
          try {
            sessionStorage.removeItem('pendingCartAction');
            const action = JSON.parse(pending);
            
            // Upsert the cart item directly via Supabase
            supabase
              .from('CartItem')
              .select('id, quantity')
              .eq('userId', user.id)
              .eq('productId', action.productId)
              .maybeSingle()
              .then(({ data: existing }) => {
                if (existing) {
                  return supabase
                    .from('CartItem')
                    .update({ quantity: existing.quantity + action.quantity })
                    .eq('id', existing.id);
                } else {
                  return supabase
                    .from('CartItem')
                    .insert({ userId: user.id, productId: action.productId, quantity: action.quantity });
                }
              })
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
  }, [isAuthenticated, isReady, userRole, user]);

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
    if (!requireAuth(product, quantity) || !user) return;
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
      
      const { data: existing } = await supabase
        .from('CartItem')
        .select('id, quantity')
        .eq('userId', user.id)
        .eq('productId', product.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('CartItem')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('CartItem')
          .insert({ userId: user.id, productId: product.id, quantity });
      }

      fetchCart();
    } catch (e) {
      console.error('Failed to add to cart', e);
      fetchCart(); // Revert on failure
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!requireAuth() || !user) return;
    try {
      setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
      await supabase
        .from('CartItem')
        .delete()
        .eq('userId', user.id)
        .eq('productId', productId);
    } catch (e) {
      console.error('Failed to remove from cart', e);
      fetchCart();
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!requireAuth() || !user) return;
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    try {
      setItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
      await supabase
        .from('CartItem')
        .update({ quantity })
        .eq('userId', user.id)
        .eq('productId', productId);
    } catch (e) {
      console.error('Failed to update quantity', e);
      fetchCart();
    }
  };

  const clearCart = async () => {
    if (!requireAuth() || !user) return;
    try {
      setItems([]);
      await supabase.from('CartItem').delete().eq('userId', user.id);
    } catch (e) {
      console.error('Failed to clear cart', e);
      fetchCart();
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const advanceAmount = items.reduce((sum, item) => sum + (item.product.price * (item.product.depositPercentage / 100)) * item.quantity, 0);
  const remainingAmount = subtotal - advanceAmount;

  return (
    <CartContext.Provider 
      value={{ 
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
      }}
    >
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
