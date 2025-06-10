'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/lib/i18n';
import { Product, ProductType, ProductVariation } from '@/lib/graphql';
import { getProductPrice, isInStock } from '@/lib/graphql/utils';
import { Button, Badge } from '@/components/ui';
import { Breadcrumb } from '@/components/layout';
import { ProductReviews } from '@/components/products/ProductReviews';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { t, formatCurrency } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const allImages = [
    product.image,
    ...(product.galleryImages?.nodes || []),
  ].filter(Boolean);

  const priceInfo = getProductPrice(product, selectedVariation);
  const inStock = isInStock(product, selectedVariation);
  const discount = priceInfo.salePrice
    ? Math.round(((priceInfo.regularPrice - priceInfo.salePrice) / priceInfo.regularPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      addItem(product, quantity);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const breadcrumbs = [
    { label: t.navigation.home, href: '/' },
    { label: t.navigation.wines, href: '/products' },
    { label: product.name, href: `/product/${product.slug}` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg">
              {allImages[selectedImageIndex] && (
                <Image
                  src={allImages[selectedImageIndex].sourceUrl}
                  alt={allImages[selectedImageIndex].altText || product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              )}
              {priceInfo.isOnSale && discount > 0 && (
                <Badge variant="error" className="absolute top-4 left-4">
                  -{discount}%
                </Badge>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={image?.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'relative aspect-[3/4] overflow-hidden bg-gray-100 rounded border-2 transition-colors',
                      selectedImageIndex === index
                        ? 'border-purple-600'
                        : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    {image && (
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || product.name}
                        fill
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">{product.name}</h1>
              {product.shortDescription && (
                <p className="mt-2 text-lg text-gray-600">{product.shortDescription}</p>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              {priceInfo.priceRange ? (
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(priceInfo.priceRange.min)} -{' '}
                  {formatCurrency(priceInfo.priceRange.max)}
                </div>
              ) : priceInfo.salePrice ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-burgundy-600">
                    {formatCurrency(priceInfo.salePrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(priceInfo.regularPrice)}
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(priceInfo.price)}
                </div>
              )}
            </div>


            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.product.quantity}
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded-md"
                  min="1"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!inStock || isAddingToCart || (product.type === ProductType.VARIABLE && !selectedVariation)}
                loading={isAddingToCart}
              >
                {!inStock
                  ? t.product.outOfStock
                  : product.type === ProductType.VARIABLE && !selectedVariation
                  ? 'Select Options'
                  : t.product.addToCart}
              </Button>
            </div>

            {/* Stock Status */}
            <div className="text-sm">
              {inStock ? (
                <span className="text-green-600">{t.product.inStock}</span>
              ) : (
                <span className="text-red-600">{t.product.outOfStock}</span>
              )}
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="py-2 px-1 border-b-2 border-rose-500 font-medium text-sm text-rose-600">
                Опис
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Додаткова інформація
              </button>
              <button className="py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Відгуки (0)
              </button>
            </nav>
          </div>

          <div className="py-8">
            {/* Description Tab Content */}
            {product.description && (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <ProductReviews productId={product.id} productName={product.name} />

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-8">{t.product.relatedProducts}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {product.relatedProducts.map((relatedProduct) => (
                <a
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-3">
                    {relatedProduct.image && (
                      <Image
                        src={relatedProduct.image.sourceUrl}
                        alt={relatedProduct.image.altText || relatedProduct.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  {relatedProduct.price && (
                    <p className="text-sm text-gray-600">{formatCurrency(parseFloat(relatedProduct.price))}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}