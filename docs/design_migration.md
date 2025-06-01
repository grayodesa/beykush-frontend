# Руководство по миграции дизайна Beykush из Elementor в Next.js

## 📊 Анализ текущего дизайна

### Элементы страницы продукта:
1. **Шапка** - логотип, навигация, корзина, переключатель языка
2. **Хлебные крошки** - навигационная цепочка
3. **Галерея продукта** - основное изображение + миниатюры
4. **Информация о продукте**:
   - Название и год
   - Цена
   - Описание
   - Форма добавления в корзину
   - SKU/артикул
5. **Табы с дополнительной информацией**:
   - Додаткова інформація (характеристики)
   - Опис
   - Відгуки
6. **Блок рекомендаций** - похожие товары
7. **Подвал** - контакты, ссылки, копирайт

### Цветовая схема:
- **Основной фиолетовый**: #7c3aed (кнопка "Додати в кошик")
- **Бургундский**: #a94f5c (элементы навигации при наведении)
- **Серый текст**: #6b7280
- **Фон**: #faf8f3 (кремовый)

## 🔄 Процесс миграции

### Шаг 1: Экспорт контента из WordPress

```php
// functions.php - добавить временную функцию для экспорта
add_action('init', function() {
    if (isset($_GET['export_products']) && current_user_can('administrator')) {
        $products = wc_get_products([
            'limit' => -1,
            'status' => 'publish',
        ]);
        
        $export_data = [];
        
        foreach ($products as $product) {
            $export_data[] = [
                'id' => $product->get_id(),
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'description' => $product->get_description(),
                'short_description' => $product->get_short_description(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'sku' => $product->get_sku(),
                'stock_status' => $product->get_stock_status(),
                'image' => wp_get_attachment_url($product->get_image_id()),
                'gallery' => array_map('wp_get_attachment_url', $product->get_gallery_image_ids()),
                'categories' => wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']),
                'attributes' => $product->get_attributes(),
                'meta_data' => $product->get_meta_data(),
            ];
        }
        
        header('Content-Type: application/json');
        echo json_encode($export_data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }
});
```

### Шаг 2: Соответствие компонентов Elementor → Next.js

| Elementor Widget | Next.js Component | Расположение |
|------------------|-------------------|--------------|
| Site Header | `components/layout/Header.tsx` | Глобальный layout |
| Breadcrumbs | `components/ui/Breadcrumbs.tsx` | Страницы |
| Product Gallery | `components/products/ProductGallery.tsx` | Страница продукта |
| Add to Cart Form | `components/products/AddToCartForm.tsx` | Страница продукта |
| Tabs | `components/ui/Tabs.tsx` | Переиспользуемый |
| Products Grid | `components/products/ProductGrid.tsx` | Каталог/рекомендации |
| Footer | `components/layout/Footer.tsx` | Глобальный layout |

### Шаг 3: Создание переиспользуемых компонентов

```typescript
// components/layout/Header.tsx
export default function Header() {
  return (
    <header className="bg-beykush-burgundy text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo-beykush.svg" 
              alt="Beykush Winery" 
              width={120} 
              height={40}
            />
          </Link>
          
          {/* Навигация */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/about" className="hover:text-beykush-gold transition-colors">
              ПРО НАС
            </Link>
            <Link href="/shop" className="hover:text-beykush-gold transition-colors">
              ВИННИЙ КЛУБ
            </Link>
            <Link href="/shop" className="hover:text-beykush-gold transition-colors">
              МАГАЗИН
            </Link>
          </nav>
          
          {/* Действия */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}

// components/ui/Tabs.tsx
interface TabsProps {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
  defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);
  
  return (
    <div>
      {/* Навигация табов */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 font-medium text-sm border-b-2 transition-colors
                ${activeTab === tab.id
                  ? 'border-beykush-purple text-beykush-purple'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Контент табов */}
      <div className="py-8">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
```

### Шаг 4: Оптимизация для производительности

#### 1. Lazy Loading компонентов
```typescript
// Динамический импорт тяжелых компонентов
const ProductGallery = dynamic(() => import('./ProductGallery'), {
  loading: () => <ProductGallerySkeleton />,
  ssr: true,
});

const ReviewsList = dynamic(() => import('./ReviewsList'), {
  loading: () => <ReviewsListSkeleton />,
  ssr: false, // Отзывы не критичны для SEO
});
```

#### 2. Оптимизация изображений
```typescript
// next.config.js
module.exports = {
  images: {
    // Автоматическая оптимизация изображений
    domains: ['beykush.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    
    // Кастомный загрузчик для WordPress
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
};

// lib/image-loader.js
export default function wpImageLoader({ src, width, quality }) {
  // Используем WordPress для генерации оптимизированных изображений
  const params = new URLSearchParams();
  params.set('w', width.toString());
  params.set('q', (quality || 85).toString());
  
  return `${src}?${params.toString()}`;
}
```

#### 3. Предзагрузка критических ресурсов
```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Предзагрузка шрифтов */}
        <link
          rel="preload"
          href="/fonts/playfair-display-v30-latin_cyrillic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Предзагрузка критических стилей */}
        <link
          rel="preload"
          href="/_next/static/css/app.css"
          as="style"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Шаг 5: Миграция интерактивных элементов

#### Фильтры продуктов
```typescript
// components/shop/ProductFilters.tsx
export default function ProductFilters({ 
  categories, 
  onFilterChange 
}: ProductFiltersProps) {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 5000],
    inStock: true,
    sortBy: 'date',
  });
  
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <aside className="space-y-6">
      {/* Категории */}
      <div>
        <h3 className="font-semibold mb-3">Категорії</h3>
        <RadioGroup
          value={filters.category}
          onChange={(value) => handleFilterChange('category', value)}
        >
          {categories.map((category) => (
            <RadioGroup.Option key={category.slug} value={category.slug}>
              {({ checked }) => (
                <div className={`
                  flex items-center justify-between p-2 rounded cursor-pointer
                  ${checked ? 'bg-beykush-purple/10' : 'hover:bg-gray-100'}
                `}>
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">
                    ({category.count})
                  </span>
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </RadioGroup>
      </div>
      
      {/* Ценовой диапазон */}
      <div>
        <h3 className="font-semibold mb-3">Ціна</h3>
        <PriceRangeSlider
          min={0}
          max={5000}
          value={filters.priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />
      </div>
    </aside>
  );
}
```

#### Анимации при скролле
```typescript
// hooks/useScrollAnimation.ts
export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);
}
```

### Шаг 6: SEO оптимизация

```typescript
// lib/seo/structured-data.ts
export function generateProductSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image?.sourceUrl,
    brand: {
      '@type': 'Brand',
      name: 'Beykush Winery',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'UAH',
      availability: product.stockStatus === 'IN_STOCK' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Beykush Winery',
      },
    },
    aggregateRating: product.averageRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    } : undefined,
  };
}

// В компоненте страницы продукта
export default function ProductPage({ product }) {
  const structuredData = generateProductSchema(product);
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      {/* Остальной контент */}
    </>
  );
}
```

## 📋 Чек-лист миграции дизайна

### Подготовка
- [ ] Экспортировать все изображения в высоком разрешении
- [ ] Документировать все цвета, шрифты, отступы
- [ ] Создать библиотеку UI компонентов
- [ ] Настроить систему дизайн-токенов

### Компоненты
- [ ] Header с навигацией
- [ ] Footer с контактами
- [ ] Карточка продукта
- [ ] Галерея изображений
- [ ] Форма добавления в корзину
- [ ] Табы информации
- [ ] Фильтры каталога
- [ ] Корзина (мини и полная)
- [ ] Форма оформления заказа

### Страницы
- [ ] Главная
- [ ] Каталог продуктов
- [ ] Страница продукта
- [ ] Корзина
- [ ] Оформление заказа
- [ ] О компании
- [ ] Контакты
- [ ] Винный клуб

### Оптимизация
- [ ] Настроить lazy loading
- [ ] Оптимизировать изображения
- [ ] Минимизировать CSS/JS
- [ ] Настроить кеширование
- [ ] Проверить Core Web Vitals

### Тестирование
- [ ] Проверить на всех устройствах
- [ ] Тестировать скорость загрузки
- [ ] Проверить SEO метрики
- [ ] A/B тестирование конверсии

## 🎯 Результат

После миграции вы получите:
- **Скорость загрузки**: < 1 секунды
- **Lighthouse Score**: 95+
- **Полный контроль** над дизайном
- **Масштабируемость** для будущих изменений
- **Улучшенная конверсия** за счет скорости