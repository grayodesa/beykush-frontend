import { Product, ProductVariation } from './types';

/**
 * Parse WooCommerce price string to number
 * Example: "820.00&nbsp;₴" -> 820
 */
export function parsePrice(price: string | null | undefined): number {
  if (!price) return 0;

  // Remove HTML entities, currency symbols, and spaces
  const cleanPrice = price
    .replace(/&nbsp;/g, ' ')
    .replace(/[^\d.,]/g, '')
    .replace(',', '.');

  return parseFloat(cleanPrice) || 0;
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get display price for a product (handles variable products)
 */
export function getProductPrice(product: Product, selectedVariation?: ProductVariation | null): {
  price: number;
  regularPrice: number;
  salePrice?: number;
  isOnSale: boolean;
  priceRange?: { min: number; max: number };
} {
  // If a specific variation is selected, use its price
  if (selectedVariation) {
    const price = parsePrice(selectedVariation.price);
    const regularPrice = parsePrice(selectedVariation.regularPrice);
    const salePrice = selectedVariation.salePrice ? parsePrice(selectedVariation.salePrice) : undefined;

    return {
      price: price || regularPrice,
      regularPrice: regularPrice || price,
      salePrice,
      isOnSale: selectedVariation.onSale || false,
    };
  }

  if (product.type === 'VARIABLE' && product.variations?.length) {
    const prices = product.variations.map((v) => parsePrice(v.price));
    const regularPrices = product.variations.map((v) => parsePrice(v.regularPrice));
    const salePrices = product.variations
      .filter((v) => v.salePrice)
      .map((v) => parsePrice(v.salePrice));

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      price: minPrice,
      regularPrice: Math.min(...regularPrices),
      salePrice: salePrices.length ? Math.min(...salePrices) : undefined,
      isOnSale: product.onSale || false,
      priceRange: minPrice !== maxPrice ? { min: minPrice, max: maxPrice } : undefined,
    };
  }

  const price = parsePrice(product.price);
  const regularPrice = parsePrice(product.regularPrice);
  const salePrice = product.salePrice ? parsePrice(product.salePrice) : undefined;

  return {
    price: price || regularPrice,
    regularPrice: regularPrice || price,
    salePrice,
    isOnSale: product.onSale || false,
  };
}

/**
 * Get selected variation based on attributes
 */
export function getSelectedVariation(
  variations: ProductVariation[],
  selectedAttributes: Record<string, string>
): ProductVariation | null {
  return (
    variations.find((variation) => {
      return variation.attributes.every((attr) => {
        if (!attr.name || !attr.label) return true;
        return selectedAttributes[attr.name] === attr.label;
      });
    }) || null
  );
}

/**
 * Get available attribute options for a variable product
 */
export function getAvailableAttributes(variations: ProductVariation[]): Record<string, string[]> {
  const attributes: Record<string, Set<string>> = {};

  variations.forEach((variation) => {
    variation.attributes.forEach((attr) => {
      if (attr.name && attr.label) {
        if (!attributes[attr.name]) {
          attributes[attr.name] = new Set();
        }
        attributes[attr.name].add(attr.label);
      }
    });
  });

  // Convert Sets to arrays
  const result: Record<string, string[]> = {};
  Object.entries(attributes).forEach(([name, values]) => {
    result[name] = Array.from(values);
  });

  return result;
}

/**
 * Check if product is in stock
 */
export function isInStock(product: Product | ProductVariation, selectedVariation?: ProductVariation | null): boolean {
  // If variation is selected, check its stock
  if (selectedVariation) {
    if (!selectedVariation.stockStatus) {
      if (selectedVariation.stockQuantity !== null && selectedVariation.stockQuantity !== undefined) {
        return selectedVariation.stockQuantity > 0;
      }
      return true;
    }
    return selectedVariation.stockStatus === 'IN_STOCK' || selectedVariation.stockStatus === 'ON_BACKORDER';
  }
  // If stockStatus is not available, check stockQuantity
  if (!product.stockStatus) {
    // If we have stockQuantity info, use it
    if (product.stockQuantity !== null && product.stockQuantity !== undefined) {
      return product.stockQuantity > 0;
    }
    // Default to true if no stock info is available
    return true;
  }
  return product.stockStatus === 'IN_STOCK' || product.stockStatus === 'ON_BACKORDER';
}

/**
 * Get stock status label
 */
export function getStockStatusLabel(status: string): string {
  switch (status) {
    case 'IN_STOCK':
      return 'В наявності';
    case 'OUT_OF_STOCK':
      return 'Немає в наявності';
    case 'ON_BACKORDER':
      return 'Під замовлення';
    default:
      return status;
  }
}

/**
 * Extract product ID from GraphQL ID
 * Example: "cG9zdDoxNTEyMQ==" -> 15121
 */
export function extractDatabaseId(globalId: string): number {
  try {
    const decoded = atob(globalId);
    const match = decoded.match(/(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Transform raw GraphQL product response to match our Product interface
 */
export function transformProduct(rawProduct: any): Product {
  if (!rawProduct) return null as any;
  
  return {
    ...rawProduct,
    // Transform nested nodes arrays to flat arrays
    galleryImages: rawProduct.galleryImages?.nodes || [],
    productCategories: rawProduct.productCategories?.nodes || [],
    attributes: rawProduct.attributes?.nodes || rawProduct.attributes || [],
    // Ensure type is uppercase
    type: rawProduct.type || rawProduct.__typename?.replace('Product', '').toUpperCase(),
  };
}

/**
 * Transform an array of raw products
 */
export function transformProducts(rawProducts: any[]): Product[] {
  return rawProducts.map(transformProduct).filter(Boolean);
}
