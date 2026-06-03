"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { CartItem } from "./types";

interface CartContextType {
  items: CartItem[];
  addItem: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  incrementItem: (menuItemId: string) => void;
  decrementItem: (menuItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItemId);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItemId, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  }, []);

  const incrementItem = useCallback((menuItemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }, []);

  const decrementItem = useCallback((menuItemId: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.menuItemId !== menuItemId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, incrementItem, decrementItem, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
