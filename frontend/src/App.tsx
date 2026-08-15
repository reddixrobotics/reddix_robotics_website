import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { router } from '@/routes';

/**
 * App — root component.
 * ThemeProvider must wrap everything so ThemeContext is available to all components.
 */
export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
