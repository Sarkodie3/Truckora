'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Coupon } from '@/types';
import { calculateShippingCents, calculateTaxCents } from '@/lib/utils';
import { COUPONS } from '@/lib/data/mock-data';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  appliedCoupon: Coupon | null;
  addItem: (product: Product, quantity?: number) => { success: boolean; message?: string };
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'truckora_cart_items_v1';
const COUPON_STORAGE_KEY = 'truckora_cart_coupon_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage upon mount
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setAppliedCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage on mutation
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, appliedCoupon, isLoaded]);

  const addItem = (product: Product, quantity = 1): { success: boolean; message?: string } => {
    if (quantity <= 0) return { success: false, message: 'Quantity must be at least 1' };

    const existingIndex = items.findIndex((i) => i.product.id === product.id);
    const currentQtyInCart = existingIndex > -1 ? items[existingIndex].quantity : 0;
    const newTotalQty = currentQtyInCart + quantity;

    if (newTotalQty > product.stockQuantity) {
      return {
        success: false,
        message: `Only ${product.stockQuantity} in stock. You already have ${currentQtyInCart} in your cart.`,
      };
    }

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex].quantity = newTotalQty;
      setItems(updated);
    } else {
      setItems([...items, { product, quantity }]);
    }

    return { success: true };
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeItem(productId);
      return { success: true };
    }

    const item = items.find((i) => i.product.id === productId);
    if (!item) return { success: false, message: 'Item not in cart' };

    if (quantity > item.product.stockQuantity) {
      return {
        success: false,
        message: `Maximum available stock is ${item.product.stockQuantity}.`,
      };
    }

    setItems((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
    return { success: true };
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  const shippingCents = calculateShippingCents(items, 'NL');

  let discountCents = 0;
  if (appliedCoupon) {
    if (subtotalCents >= appliedCoupon.minOrderCents) {
      if (appliedCoupon.discountType === 'percentage') {
        discountCents = Math.round((subtotalCents * appliedCoupon.discountValue) / 100);
      } else {
        discountCents = appliedCoupon.discountValue;
      }
    }
  }

  const taxableAmount = Math.max(0, subtotalCents - discountCents);
  const taxCents = calculateTaxCents(taxableAmount, 21.0);
  const totalCents = Math.max(0, taxableAmount + shippingCents + taxCents);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = COUPONS.find((c) => c.code === cleanCode && c.isActive);

    if (!coupon) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (subtotalCents < coupon.minOrderCents) {
      return {
        success: false,
        message: `Coupon requires a minimum order of €${(coupon.minOrderCents / 100).toFixed(2)}.`,
      };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon ${coupon.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotalCents,
        shippingCents,
        taxCents,
        discountCents,
        totalCents,
        appliedCoupon,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
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
