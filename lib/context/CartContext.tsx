'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MerchProduct } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (product: MerchProduct, selectedSize?: string, quantity?: number) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  totalCents: number;
  itemCount: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('ece_terroir_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem('ece_terroir_cart');
      }
    }
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('ece_terroir_cart', JSON.stringify(newItems));
  };

  const addItem = (product: MerchProduct, selectedSize?: string, quantity: number = 1) => {
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id && item.selectedSize === selectedSize
    );

    let newItems: CartItem[];
    if (existingIndex > -1) {
      newItems = [...items];
      newItems[existingIndex].quantity += quantity;
    } else {
      newItems = [...items, { product, quantity, selectedSize }];
    }

    saveCart(newItems);
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string, selectedSize?: string) => {
    const newItems = items.filter(
      (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
    );
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number, selectedSize?: string) => {
    if (quantity <= 0) {
      removeItem(productId, selectedSize);
      return;
    }

    const newItems = items.map((item) => {
      if (item.product.id === productId && item.selectedSize === selectedSize) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCents = items.reduce(
    (total, item) => total + item.product.priceCents * item.quantity,
    0
  );

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalCents,
        itemCount,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
