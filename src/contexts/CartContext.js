import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const getStoredCart = (userId) => {
  try {
    const savedCart = localStorage.getItem(`cart_${userId}`);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => user ? getStoredCart(user.id) : []);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle cart initialization when user changes
  useEffect(() => {
    if (user) {
      const storedCart = getStoredCart(user.id);
      setCart(storedCart);
    } else {
      setCart([]);
    }
    setIsInitialized(true);
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user && isInitialized) {
      try {
        localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, user, isInitialized]);

  const addToCart = (movie) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === movie.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === movie.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...movie, quantity: 1 }];
    });
  };

  const removeFromCart = (movieId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== movieId));
  };

  const updateQuantity = (movieId, quantity) => {
    if (quantity < 1) {
      removeFromCart(movieId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === movieId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    }
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      calculateTotal,
      cartCount: getCartCount()
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;