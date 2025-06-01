// components/products/WineCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Heart, Info } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils/format';
import { Wine } from '@/types/product';

interface WineCardProps {
  wine: Wine;
  locale?: 'uk' | 'en' | 'ru';
}

export default function WineCard({ wine, locale = 'uk' }: WineCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const translations = {
    uk: {
      addToCart: 'До кошика',
      viewDetails: 'Детальніше',
      inStock: 'В наявності',
      outOfStock: 'Немає в наявності',
      volume: 'Об\'єм',
      alcohol: 'Алкоголь',
      grapeVariety: 'Сорт винограду',
      vintage: 'Рік врожаю',
      added: 'Додано!',
    },
    en: {
      addToCart: 'Add to Cart',
      viewDetails: 'View Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      volume: 'Volume',
      alcohol: 'Alcohol',
      grapeVariety: 'Grape Variety',
      vintage: 'Vintage',
      added: 'Added!',
    },
    ru: {
      addToCart: 'В корзину',
      viewDetails: 'Подробнее',
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
      volume: 'Объем',
      alcohol: 'Алкоголь',
      grapeVariety: 'Сорт винограда',
      vintage: 'Год урожая',
      added: 'Добавлено!',
    },
  };

  const t = translations[locale];

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      addItem({
        productId: wine.databaseId,
        name: wine.name,
        price: wine.price,
        quantity: 1,
        image: wine.image?.sourceUrl,
      });

      // Показываем уведомление об успешном добавлении
      setIsLoading(false);
      
      // Анимация кнопки
      const button = e.currentTarget;
      button.textContent = t.added;
      setTimeout(() => {
        button.textContent = t.addToCart;
      }, 2000);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    // Здесь можно добавить логику сохранения в избранное
  };

  const isInStock = wine.stockStatus === 'IN_STOCK';
  const discountPercentage = wine.salePrice 
    ? Math.round((1 - parseFloat(wine.salePrice) / parseFloat(wine.regularPrice)) * 100)
    : 0;

  return (
    <article className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <Link href={`/products/${wine.slug}`} className="block">
        {/* Бейдж со скидкой */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}

        {/* Кнопка избранного */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          aria-label="Add to favorites"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Изображение */}
        <div className="relative aspect-[3/4] bg-gray-100">
          {!imageError && wine.image ? (
            <Image
              src={wine.image.sourceUrl}
              alt={wine.image.altText || wine.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImageError(true)}
              priority={false}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-400">
                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 2v14h14V5H5zm7 2a1 1 0 011 1v3.5a1.5 1.5 0 01-1.5 1.5h-1A1.5 1.5 0 019 11.5V8a1 1 0 011-1h2zm0 2h-2v1.5a.5.5 0 00.5.5h1a.5.5 0 00.5-.5V9z"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Информация о продукте */}
        <div className="p-5">
          {/* Категория */}
          {wine.productCategories?.nodes?.[0] && (
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              {wine.productCategories.nodes[0].name}
            </p>
          )}

          {/* Название */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-700 transition-colors">
            {wine.name}
          </h3>

          {/* Атрибуты */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            {wine.vintage && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="text-xs">{t.vintage}:</span>
                <span className="font-medium">{wine.vintage}</span>
              </div>
            )}
            {wine.alcoholContent && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="text-xs">{t.alcohol}:</span>
                <span className="font-medium">{wine.alcoholContent}%</span>
              </div>
            )}
            {wine.volume && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="text-xs">{t.volume}:</span>
                <span className="font-medium">{wine.volume}ml</span>
              </div>
            )}
            {wine.grapeVariety && (
              <div className="flex items-center gap-1 text-gray-600">
                <span className="text-xs">{t.grapeVariety}:</span>
                <span className="font-medium text-xs">{wine.grapeVariety}</span>
              </div>
            )}
          </div>

          {/* Цена */}
          <div className="flex items-baseline gap-2 mb-4">
            {wine.salePrice ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  {formatPrice(wine.salePrice, 'UAH')}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(wine.regularPrice, 'UAH')}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(wine.price, 'UAH')}
              </span>
            )}
          </div>

          {/* Статус наличия */}
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
              {isInStock ? t.inStock : t.outOfStock}
            </span>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock || isLoading}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200
                ${isInStock 
                  ? 'bg-red-600 text-white hover:bg-red-700 active:scale-95' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <ShoppingCart className="w-5 h-5" />
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                t.addToCart
              )}
            </button>
            
            <Link
              href={`/products/${wine.slug}`}
              className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label={t.viewDetails}
            >
              <Info className="w-5 h-5 text-gray-600" />
            </Link>
          </div>
        </div>
      </Link>
    </article>
  );
}

// Компонент-скелетон для загрузки
export function WineCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-5">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-5 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-12 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// Компонент списка вин
export function WineGrid({ 
  wines, 
  loading = false,
  locale = 'uk' 
}: { 
  wines: Wine[];
  loading?: boolean;
  locale?: 'uk' | 'en' | 'ru';
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <WineCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wines.map((wine) => (
        <WineCard key={wine.id} wine={wine} locale={locale} />
      ))}
    </div>
  );
}

// Типы для TypeScript
// types/product.ts
export interface Wine {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  regularPrice: string;
  salePrice?: string;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK';
  stockQuantity?: number;
  image?: {
    sourceUrl: string;
    altText?: string;
  };
  productCategories?: {
    nodes: Array<{
      name: string;
      slug: string;
    }>;
  };
  // Специфичные для вина атрибуты
  vintage?: string;
  alcoholContent?: string;
  volume?: string;
  grapeVariety?: string;
}

// Утилита для форматирования цены
// lib/utils/format.ts
export function formatPrice(price: string | number, currency: string = 'UAH'): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
}