export interface CartItem {
  id: string; // Product ID from WooCommerce
  productId: number; // Database ID
  name: string;
  slug: string;
  price: string; // Price as string from WooCommerce
  regularPrice?: string;
  salePrice?: string;
  quantity: number;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  // Wine-specific attributes
  attributes?: {
    vintage?: string;
    volume?: string;
    alcoholContent?: string;
    grapeVariety?: string[];
  };
  variationId?: number; // For product variations
  variation?: Record<string, string>; // Variation attributes
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  discountType: 'fixed' | 'percent';
}

export interface CartState {
  items: CartItem[];
  totals: CartTotals;
  appliedCoupons: AppliedCoupon[];
  isLoading: boolean;
  isOpen: boolean; // For cart drawer
  lastUpdated: number; // Timestamp for persistence
}

export interface CartActions {
  // Item management
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string, variationId?: number) => void;
  updateQuantity: (id: string, quantity: number, variationId?: number) => void;
  clearCart: () => void;

  // Cart UI
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Coupon management
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => void;

  // Calculations
  recalculateTotals: () => void;

  // Persistence
  loadCart: () => void;
  syncWithServer: () => Promise<void>;
}

export type CartStore = CartState & CartActions;
