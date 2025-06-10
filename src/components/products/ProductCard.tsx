'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useCartStore } from '@/store/cart';
import { Product, ProductType } from '@/lib/graphql';
import { getProductPrice, isInStock } from '@/lib/graphql/utils';

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

  const getWineType = () => {
    const category = product.productCategories?.find(cat => 
      ['red', 'white', 'rose', 'sparkling'].includes(cat.slug)
    );
    return category?.slug;
  };

  const getWineYear = () => {
    const yearAttr = product.attributes?.find(attr => 
      attr.name?.toLowerCase() === 'year' || attr.name?.toLowerCase() === 'рік'
    );
    return yearAttr?.value || yearAttr?.options?.[0];
  };

  const wineType = getWineType();
  const year = getWineYear();

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inStock || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      // For variable products, we'll need to show a modal or redirect to product page
      if (product.type === ProductType.VARIABLE) {
        window.location.href = `/product/${product.slug}`;
      } else {
        addItem(product);
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
            {priceInfo.isOnSale && discount > 0 && (
              <Badge variant="error">
                -{discount}%
              </Badge>
            )}
            {product.featured && (
              <Badge variant="primary">
                {t.product.featured}
              </Badge>
            )}
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
          <div className={cn(
            "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300",
            "flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100"
          )}>
            {onQuickView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleQuickView}
                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                aria-label={t.product.quickView}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onWishlistToggle && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleWishlistToggle}
                className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                aria-label={t.product.addToWishlist}
              >
                <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
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
              className="font-medium text-gray-900 hover:text-purple-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
              {wineType && <span>{getWineTypeName(wineType)}</span>}
              {year && <span>{year}</span>}
            </div>
          </div>
          <div className="text-right">
            {priceInfo.priceRange ? (
              <div className="text-lg font-semibold text-gray-900">
                {formatCurrency(priceInfo.priceRange.min)} - {formatCurrency(priceInfo.priceRange.max)}
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
          variant="primary"
          size="sm"
          className="w-full"
          disabled={!inStock || isAddingToCart}
          loading={isAddingToCart}
        >
          {!inStock ? (
            t.product.outOfStock
          ) : product.type === ProductType.VARIABLE ? (
            t.product.selectOptions
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {t.product.addToCart}
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};