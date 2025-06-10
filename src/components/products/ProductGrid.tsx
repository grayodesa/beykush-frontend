'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/graphql';
import { ProductCard } from './ProductCard';
import { ProductQuickView } from './ProductQuickView';

export interface ProductGridProps {
  products: Product[];
  onWishlistToggle?: (productId: string) => void;
  wishlistedIds?: string[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onWishlistToggle,
  wishlistedIds = [],
  columns = 4,
  className,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <>
      <div className={cn('grid gap-6', gridCols[columns], className)}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
            onWishlistToggle={onWishlistToggle}
            isWishlisted={wishlistedIds.includes(product.id)}
          />
        ))}
      </div>

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onWishlistToggle={onWishlistToggle}
          isWishlisted={wishlistedIds.includes(quickViewProduct.id)}
        />
      )}
    </>
  );
};
