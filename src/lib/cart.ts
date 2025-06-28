'use client';

import { Product } from './products';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

// Cart state management using localStorage
const CART_STORAGE_KEY = 'vintagevault_cart';

export const getCart = (): Cart => {
  if (typeof window === 'undefined') {
    return {
      items: [],
      total: 0,
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
    };
  }

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
      return calculateCartTotals(cart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }

  return {
    items: [],
    total: 0,
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
  };
};

export const saveCart = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const calculateCartTotals = (cart: Partial<Cart>): Cart => {
  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate tax (8.5% for example)
  const tax = subtotal * 0.085;
  
  // Calculate shipping (free over $100, otherwise $15)
  const shipping = subtotal >= 100 ? 0 : 15;
  
  const total = subtotal + tax + shipping;

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount,
  };
};

export const addToCart = (product: Product, quantity: number = 1): Cart => {
  const currentCart = getCart();
  const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);

  let newItems: CartItem[];
  
  if (existingItemIndex >= 0) {
    // Update existing item quantity
    newItems = currentCart.items.map((item, index) => 
      index === existingItemIndex 
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
  } else {
    // Add new item
    const newItem: CartItem = {
      id: `${product.id}_${Date.now()}`,
      product,
      quantity,
      addedAt: new Date().toISOString(),
    };
    newItems = [...currentCart.items, newItem];
  }

  const updatedCart = calculateCartTotals({ items: newItems });
  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (itemId: string): Cart => {
  const currentCart = getCart();
  const newItems = currentCart.items.filter(item => item.id !== itemId);
  const updatedCart = calculateCartTotals({ items: newItems });
  saveCart(updatedCart);
  return updatedCart;
};

export const updateCartItemQuantity = (itemId: string, quantity: number): Cart => {
  const currentCart = getCart();
  
  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  const newItems = currentCart.items.map(item => 
    item.id === itemId ? { ...item, quantity } : item
  );

  const updatedCart = calculateCartTotals({ items: newItems });
  saveCart(updatedCart);
  return updatedCart;
};

export const clearCart = (): Cart => {
  const emptyCart = calculateCartTotals({ items: [] });
  saveCart(emptyCart);
  return emptyCart;
};

export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.itemCount;
};

// Cart hooks for React components
export const useCart = () => {
  const [cart, setCart] = React.useState<Cart>(getCart());

  React.useEffect(() => {
    const handleStorageChange = () => {
      setCart(getCart());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addItem = (product: Product, quantity: number = 1) => {
    const updatedCart = addToCart(product, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  const removeItem = (itemId: string) => {
    const updatedCart = removeFromCart(itemId);
    setCart(updatedCart);
    return updatedCart;
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = updateCartItemQuantity(itemId, quantity);
    setCart(updatedCart);
    return updatedCart;
  };

  const clear = () => {
    const updatedCart = clearCart();
    setCart(updatedCart);
    return updatedCart;
  };

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  };
};

// Import React for the hook
import React from 'react';

