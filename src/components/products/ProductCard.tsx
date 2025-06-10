'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useCartStore } from '@/store/cart';
import { Product, ProductType } from '@/lib/graphql';
import { getProductPrice, isInStock } from '@/lib/graphql/utils';

// Icon components
const EyeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const HeartIcon = ({ filled = false, className = "w-5 h-5" }: { filled?: boolean; className?: string }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShoppingCartIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onWishlistToggle,
  isWishlisted = false,
  className,
}) => {
  const { t, formatCurrency } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const priceInfo = getProductPrice(product);
  const inStock = isInStock(product);
  const discount = priceInfo.salePrice
    ? Math.round(((priceInfo.regularPrice - priceInfo.salePrice) / priceInfo.regularPrice) * 100)
    : 0;

  const getWineYear = () => {
    const yearAttr = product.attributes?.find(
      (attr) => attr.name?.toLowerCase() === 'year' || attr.name?.toLowerCase() === 'рік'
    );
    return yearAttr?.value || yearAttr?.options?.[0];
  };

  const year = getWineYear();
  const mainCategory = product.productCategories?.nodes?.[0] || product.productCategories?.[0];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      // For variable products, we'll need to show a modal or redirect to product page
      if (product.type === ProductType.VARIABLE) {
        window.location.href = `/product/${product.slug}`;
      } else {
        addItem(product, 1);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    onQuickView?.(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    onWishlistToggle?.(product.id);
  };

  return (
    <Card
      className={cn('group relative', className)}
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={product.image?.sourceUrl || '/placeholder-wine.svg'}
            alt={product.image?.altText || product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {priceInfo.isOnSale && discount > 0 && <Badge variant="error">-{discount}%</Badge>}
            {product.featured && <Badge variant="primary">{t.common.new}</Badge>}
          </div>

          {/* Out of stock overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="neutral" size="md">
                {t.product.outOfStock}
              </Badge>
            </div>
          )}

          {/* Quick actions overlay */}
          <div
            className={cn(
              'absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300',
              'flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100'
            )}
          >
            {onQuickView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                aria-label="Quick View"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
            )}
            {onWishlistToggle && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleWishlistToggle}
                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                aria-label="Add to Wishlist"
              >
                <HeartIcon filled={isWishlisted} className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              href={`/product/${product.slug}`}
              className="font-medium text-gray-900 hover:text-rose-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              {mainCategory && <span className="text-sm text-gray-600">{mainCategory.name}</span>}
              {year && <span className="text-sm text-rose-500 font-medium">{year}</span>}
            </div>
          </div>
          <div className="text-right">
            {priceInfo.priceRange ? (
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(priceInfo.priceRange.min)} -{' '}
                {formatCurrency(priceInfo.priceRange.max)}
              </div>
            ) : priceInfo.salePrice ? (
              <>
                <div className="text-sm text-gray-500 line-through">
                  {formatCurrency(priceInfo.regularPrice)}
                </div>
                <div className="text-lg font-semibold text-burgundy-600">
                  {formatCurrency(priceInfo.salePrice)}
                </div>
              </>
            ) : (
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(priceInfo.price)}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          variant="dark"
          size="sm"
          className="w-full"
          disabled={!inStock || isAddingToCart}
          loading={isAddingToCart}
        >
          {!inStock ? (
            t.product.outOfStock
          ) : product.type === ProductType.VARIABLE ? (
            'Select Options'
          ) : (
            <>
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              {t.product.addToCart}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};
