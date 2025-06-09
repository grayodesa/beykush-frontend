'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  image: {
    src: string;
    alt: string;
  };
  price: number;
  salePrice?: number;
  inStock?: boolean;
  wineType?: 'red' | 'white' | 'rose' | 'sparkling';
  year?: number;
  onAddToCart?: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id: _id,
  slug,
  name,
  image,
  price,
  salePrice,
  inStock = true,
  wineType,
  year,
  onAddToCart,
  className,
}) => {
  const { t, formatCurrency } = useTranslation();

  const getWineTypeName = (type: string) => {
    switch (type) {
      case 'red':
        return t.wine.redWine;
      case 'white':
        return t.wine.whiteWine;
      case 'rose':
        return t.wine.roseWine;
      case 'sparkling':
        return t.wine.sparklingWine;
      default:
        return type;
    }
  };

  const discount = salePrice ? Math.round(((price - salePrice) / price) * 100) : 0;

  return (
    <Card className={cn('group', className)} hoverable>
      <Link href={`/product/${slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {salePrice && (
            <Badge
              variant="error"
              className="absolute top-2 right-2"
            >
              -{discount}%
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="neutral" size="md">
                {t.product.outOfStock}
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              href={`/product/${slug}`}
              className="font-medium text-gray-900 hover:text-purple-600 transition-colors line-clamp-2"
            >
              {name}
            </Link>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              {wineType && <span>{getWineTypeName(wineType)}</span>}
              {year && <span>{year}</span>}
            </div>
          </div>
          <div className="text-right">
            {salePrice ? (
              <>
                <div className="text-sm text-gray-500 line-through">
                  {formatCurrency(price)}
                </div>
                <div className="text-lg font-semibold text-burgundy-600">
                  {formatCurrency(salePrice)}
                </div>
              </>
            ) : (
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(price)}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart?.();
          }}
          variant="primary"
          size="sm"
          className="w-full"
          disabled={!inStock}
        >
          {inStock ? t.product.addToCart : t.product.outOfStock}
        </Button>
      </div>
    </Card>
  );
};