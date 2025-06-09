# State Management

This directory contains Zustand stores for managing client-side state.

## Cart Store

The cart store (`cart.ts`) manages shopping cart state with the following
features:

- **Persistence**: Cart data is saved to localStorage
- **Type Safety**: Full TypeScript support with interfaces
- **DevTools**: Redux DevTools integration for debugging
- **Optimistic Updates**: Immediate UI updates with background sync
- **Selectors**: Pre-built selectors for common use cases

### Usage

```tsx
import { useCart } from '@/hooks/useCart';

function ProductCard({ product }) {
  const { addToCart, isInCart, formatPrice } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      productId: product.databaseId,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>{formatPrice(product.price)}</p>
      <button onClick={handleAddToCart}>
        {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
```

### Store Structure

```typescript
interface CartStore {
  // State
  items: CartItem[];
  totals: CartTotals;
  appliedCoupons: AppliedCoupon[];
  isLoading: boolean;
  isOpen: boolean;
  lastUpdated: number;

  // Actions
  addItem: (item, quantity?) => void;
  removeItem: (id, variationId?) => void;
  updateQuantity: (id, quantity, variationId?) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code) => Promise<void>;
  removeCoupon: (code) => void;
  recalculateTotals: () => void;
  loadCart: () => void;
  syncWithServer: () => Promise<void>;
}
```
