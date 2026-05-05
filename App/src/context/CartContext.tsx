// src/context/CartContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, CartState, FoodItem } from '../navigation/types';

interface CartContextType {
  cart: CartState;
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.items.find(i => i.foodItem.id === item.id);
      if (existing) {
        existing.quantity += 1;
        return {
          ...prev,
          total: prev.total + item.price,
        };
      } else {
        return {
          items: [...prev.items, { foodItem: item, quantity: 1 }],
          total: prev.total + item.price,
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const item = prev.items.find(i => i.foodItem.id === itemId);
      if (item) {
        const newItems = prev.items.filter(i => i.foodItem.id !== itemId);
        return {
          items: newItems,
          total: prev.total - item.foodItem.price * item.quantity,
        };
      }
      return prev;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => {
      const newItems = prev.items.map(i =>
        i.foodItem.id === itemId ? { ...i, quantity } : i
      );
      const total = newItems.reduce((sum, i) => sum + i.foodItem.price * i.quantity, 0);
      return { items: newItems, total };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};