'use client';

import { useCallback } from 'react';
import { useCartStore } from '@/store/cart';
import type { CartItem } from '@/types/cart';

export const useCart = () => {
  const {
    items,
    totals,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  // Calculate item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Add product to cart helper
  const addToCart = useCallback(
    (
      product: {
        id: string;
        productId: number;
        name: string;
        slug: string;
        price: string;
        regularPrice?: string;
        salePrice?: string;
        image?: {
          sourceUrl: string;
          altText?: string;
        };
        attributes?: CartItem['attributes'];
        variationId?: number;
        variation?: Record<string, string>;
      },
      quantity = 1
    ) => {
      addItem(product, quantity);
    },
    [addItem]
  );

  // Remove from cart helper
  const removeFromCart = useCallback(
    (productId: string, variationId?: number) => {
      removeItem(productId, variationId);
    },
    [removeItem]
  );

  // Update item quantity helper
  const updateItemQuantity = useCallback(
    (productId: string, quantity: number, variationId?: number) => {
      updateQuantity(productId, quantity, variationId);
    },
    [updateQuantity]
  );

  // Check if item is in cart
  const isInCart = useCallback(
    (productId: string, variationId?: number) => {
      return items.some(
        (item) =>
          item.id === productId &&
          (variationId ? item.variationId === variationId : !item.variationId)
      );
    },
    [items]
  );

  // Get item from cart
  const getCartItem = useCallback(
    (productId: string, variationId?: number) => {
      return items.find(
        (item) =>
          item.id === productId &&
          (variationId ? item.variationId === variationId : !item.variationId)
      );
    },
    [items]
  );

  // Format price for display
  const formatPrice = useCallback((price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numPrice);
  }, []);

  return {
    // State
    items,
    totals,
    itemCount,
    isOpen,
    isEmpty: items.length === 0,

    // Actions
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    applyCoupon,
    removeCoupon,

    // Helpers
    isInCart,
    getCartItem,
    formatPrice,
  };
};
