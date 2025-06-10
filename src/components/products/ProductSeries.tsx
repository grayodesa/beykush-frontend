'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/graphql';
import { ProductCard } from './ProductCard';

interface ProductSeriesProps {
  seriesName: string;
  products: Product[];
  viewAllLink?: string;
}

export const ProductSeries: React.FC<ProductSeriesProps> = ({
  seriesName,
  products,
  viewAllLink,
}) => {
  if (!products.length) return null;

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-gray-900">{seriesName}</h2>
        {viewAllLink && (
          <Link 
            href={viewAllLink}
            className="text-sm text-medium-gray hover:text-rose-600 transition-colors"
          >
            Переглянути всі →
          </Link>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};