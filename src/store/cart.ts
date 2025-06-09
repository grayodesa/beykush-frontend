import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartStore, CartItem, CartTotals, AppliedCoupon } from '@/types/cart';

const CART_STORAGE_KEY = 'beykush-cart';

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]): Omit<CartTotals, 'tax' | 'shipping' | 'discount'> => {
  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.salePrice || item.price);
    return sum + price * item.quantity;
  }, 0);

  return {
    subtotal,
    total: subtotal, // Will be updated with tax, shipping, discount
  };
};

// Helper to find item index
const findItemIndex = (items: CartItem[], id: string, variationId?: number): number => {
  return items.findIndex(
    (item) => item.id === id && (variationId ? item.variationId === variationId : !item.variationId)
  );
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        items: [],
        totals: {
          subtotal: 0,
          tax: 0,
          shipping: 0,
          discount: 0,
          total: 0,
        },
        appliedCoupons: [],
        isLoading: false,
        isOpen: false,
        lastUpdated: Date.now(),

        // Actions
        addItem: (item, quantity = 1) => {
          set((state) => {
            const existingIndex = findItemIndex(state.items, item.id, item.variationId);

            if (existingIndex >= 0) {
              // Update quantity if item exists
              state.items[existingIndex].quantity += quantity;
            } else {
              // Add new item
              state.items.push({ ...item, quantity });
            }

            state.lastUpdated = Date.now();
            // Recalculate totals
            const { subtotal } = calculateTotals(state.items);
            state.totals.subtotal = subtotal;
            state.totals.total =
              subtotal + state.totals.tax + state.totals.shipping - state.totals.discount;
          });

          // Open cart drawer when item is added
          get().openCart();
        },

        removeItem: (id, variationId) => {
          set((state) => {
            const index = findItemIndex(state.items, id, variationId);
            if (index >= 0) {
              state.items.splice(index, 1);
              state.lastUpdated = Date.now();

              // Recalculate totals
              const { subtotal } = calculateTotals(state.items);
              state.totals.subtotal = subtotal;
              state.totals.total =
                subtotal + state.totals.tax + state.totals.shipping - state.totals.discount;
            }
          });
        },

        updateQuantity: (id, quantity, variationId) => {
          set((state) => {
            const index = findItemIndex(state.items, id, variationId);
            if (index >= 0) {
              if (quantity <= 0) {
                // Remove item if quantity is 0 or less
                state.items.splice(index, 1);
              } else {
                state.items[index].quantity = quantity;
              }
              state.lastUpdated = Date.now();

              // Recalculate totals
              const { subtotal } = calculateTotals(state.items);
              state.totals.subtotal = subtotal;
              state.totals.total =
                subtotal + state.totals.tax + state.totals.shipping - state.totals.discount;
            }
          });
        },

        clearCart: () => {
          set((state) => {
            state.items = [];
            state.totals = {
              subtotal: 0,
              tax: 0,
              shipping: 0,
              discount: 0,
              total: 0,
            };
            state.appliedCoupons = [];
            state.lastUpdated = Date.now();
          });
        },

        toggleCart: () => {
          set((state) => {
            state.isOpen = !state.isOpen;
          });
        },

        openCart: () => {
          set((state) => {
            state.isOpen = true;
          });
        },

        closeCart: () => {
          set((state) => {
            state.isOpen = false;
          });
        },

        applyCoupon: async (code) => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            // TODO: Implement API call to validate and apply coupon
            // For now, just add a mock coupon
            await new Promise((resolve) => setTimeout(resolve, 1000));

            set((state) => {
              state.appliedCoupons.push({
                code,
                discount: 10, // Mock 10 UAH discount
                discountType: 'fixed',
              });

              // Update discount in totals
              state.totals.discount = state.appliedCoupons.reduce(
                (sum: number, coupon: AppliedCoupon) => sum + coupon.discount,
                0
              );
              state.totals.total =
                state.totals.subtotal +
                state.totals.tax +
                state.totals.shipping -
                state.totals.discount;
              state.isLoading = false;
              state.lastUpdated = Date.now();
            });
          } catch (error) {
            set((state) => {
              state.isLoading = false;
            });
            throw error;
          }
        },

        removeCoupon: (code) => {
          set((state) => {
            state.appliedCoupons = state.appliedCoupons.filter(
              (c: AppliedCoupon) => c.code !== code
            );

            // Update discount in totals
            state.totals.discount = state.appliedCoupons.reduce(
              (sum: number, coupon: AppliedCoupon) => sum + coupon.discount,
              0
            );
            state.totals.total =
              state.totals.subtotal +
              state.totals.tax +
              state.totals.shipping -
              state.totals.discount;
            state.lastUpdated = Date.now();
          });
        },

        recalculateTotals: () => {
          set((state) => {
            const { subtotal } = calculateTotals(state.items);
            state.totals.subtotal = subtotal;
            state.totals.total =
              subtotal + state.totals.tax + state.totals.shipping - state.totals.discount;
            state.lastUpdated = Date.now();
          });
        },

        loadCart: () => {
          // This is handled by persist middleware
          // But we can use this for manual cart recovery
        },

        syncWithServer: async () => {
          set((state) => {
            state.isLoading = true;
          });

          try {
            // TODO: Implement sync with WooCommerce cart session
            // This would involve calling GraphQL mutations to sync cart state
            await new Promise((resolve) => setTimeout(resolve, 1000));

            set((state) => {
              state.isLoading = false;
              state.lastUpdated = Date.now();
            });
          } catch (error) {
            set((state) => {
              state.isLoading = false;
            });
            throw error;
          }
        },
      })),
      {
        name: CART_STORAGE_KEY,
        // Only persist essential data
        partialize: (state) => ({
          items: state.items,
          appliedCoupons: state.appliedCoupons,
          lastUpdated: state.lastUpdated,
        }),
      }
    ),
    {
      name: 'cart-store',
    }
  )
);

// Selectors for common use cases
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotals = () => useCartStore((state) => state.totals);
export const useCartCount = () =>
  useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
export const useIsCartOpen = () => useCartStore((state) => state.isOpen);
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
    toggleCart: state.toggleCart,
    openCart: state.openCart,
    closeCart: state.closeCart,
    applyCoupon: state.applyCoupon,
    removeCoupon: state.removeCoupon,
  }));
