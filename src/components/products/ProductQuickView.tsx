'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingCart, Heart } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { useTranslation } from '@/lib/i18n';
import { useCartStore } from '@/store/cart';
import { Product, ProductType, ProductVariation } from '@/lib/graphql';
import { 
  getProductPrice, 
  isInStock, 
  getAvailableAttributes, 
  getSelectedVariation,
  getStockStatusLabel 
} from '@/lib/graphql/utils';

export interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onWishlistToggle?: (productId: string) => void;
  isWishlisted?: boolean;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  isOpen,
  onClose,
  onWishlistToggle,
  isWishlisted = false,
}) => {
  const { t, formatCurrency } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const priceInfo = getProductPrice(product);
  const availableAttributes = product.variations ? getAvailableAttributes(product.variations) : {};
  const selectedVariation = product.variations 
    ? getSelectedVariation(product.variations, selectedAttributes)
    : null;

  const currentProduct = selectedVariation || product;
  const currentPriceInfo = selectedVariation ? getProductPrice(selectedVariation as any) : priceInfo;
  const inStock = isInStock(currentProduct);

  const handleAttributeChange = (name: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = async () => {
    if (!inStock || isAddingToCart) return;

    // For variable products, ensure all attributes are selected
    if (product.type === ProductType.VARIABLE && !selectedVariation) {
      // Show error or highlight missing attributes
      return;
    }

    setIsAddingToCart(true);
    try {
      addItem(product, quantity, selectedVariation || undefined);
      onClose();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    onWishlistToggle?.(product.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      className="max-w-4xl"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 text-gray-500 hover:text-gray-700 z-10"
          aria-label={t.common.close}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-[3/4] bg-gray-100">
            <Image
              src={currentProduct.image?.sourceUrl || '/placeholder-wine.svg'}
              alt={currentProduct.image?.altText || currentProduct.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {priceInfo.isOnSale && priceInfo.salePrice && (
              <Badge variant="error" className="absolute top-4 left-4">
                -{Math.round(((priceInfo.regularPrice - priceInfo.salePrice) / priceInfo.regularPrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            
            {/* Price */}
            <div className="mb-4">
              {currentPriceInfo.priceRange ? (
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(currentPriceInfo.priceRange.min)} - {formatCurrency(currentPriceInfo.priceRange.max)}
                </div>
              ) : currentPriceInfo.salePrice ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-burgundy-600">
                    {formatCurrency(currentPriceInfo.salePrice)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatCurrency(currentPriceInfo.regularPrice)}
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(currentPriceInfo.price)}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                {getStockStatusLabel(currentProduct.stockStatus || 'OUT_OF_STOCK')}
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <div 
                className="mb-6 text-gray-600"
                dangerouslySetInnerHTML={{ __html: product.shortDescription }}
              />
            )}

            {/* Variable Product Options */}
            {product.type === ProductType.VARIABLE && Object.entries(availableAttributes).length > 0 && (
              <div className="space-y-4 mb-6">
                {Object.entries(availableAttributes).map(([name, options]) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {name}
                    </label>
                    <Select
                      value={selectedAttributes[name] || ''}
                      onChange={(e) => handleAttributeChange(name, e.target.value)}
                      required
                    >
                      <option value="">{t.product.selectOptions}</option>
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.product.quantity}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={!inStock || isAddingToCart || (product.type === ProductType.VARIABLE && !selectedVariation)}
                loading={isAddingToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t.product.addToCart}
              </Button>
              {onWishlistToggle && (
                <Button
                  onClick={handleWishlistToggle}
                  variant="secondary"
                  size="lg"
                  aria-label={t.product.addToWishlist}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
              )}
            </div>

            {/* SKU */}
            {product.sku && (
              <div className="mt-4 text-sm text-gray-600">
                {t.product.sku}: {product.sku}
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};