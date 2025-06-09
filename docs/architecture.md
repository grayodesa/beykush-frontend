# Архитектура Headless WordPress + Next.js для винодельни Beykush

## 📋 Обзор решения

Предлагаемая архитектура позволит значительно ускорить работу сайта, сохранив
при этом все функциональные возможности WordPress и WooCommerce для управления
контентом и магазином.

### Основные преимущества:

- **Скорость**: Статическая генерация страниц, кеширование на CDN
- **SEO**: Полная оптимизация для поисковых систем
- **Масштабируемость**: Фронтенд и бэкенд независимы друг от друга
- **Гибкость дизайна**: Полный контроль над UI/UX
- **Сохранение функциональности**: Все возможности WooCommerce остаются
  доступными

## 🏗️ Архитектура системы

```
┌─────────────────────────────────────────────────────────────────┐
│                         Пользователи                            │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CDN (Cloudflare/Vercel)                      │
│                  Кеширование статических файлов                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Frontend                           │
│  • SSG/ISR для статических страниц                             │
│  • SSR для динамических страниц                                │
│  • API Routes для серверной логики                             │
│  • Tailwind CSS для стилизации                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                          GraphQL API
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WordPress Backend                            │
│  • WPGraphQL + WPGraphQL for WooCommerce                      │
│  • JWT Authentication                                           │
│  • Управление контентом                                        │
│  • Обработка заказов                                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Внешние сервисы                               │
│  • Платежные системы (через WooCommerce)                      │
│  • Службы доставки                                             │
│  • Email уведомления                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Технологический стек

### Backend (WordPress)

- **WordPress** - основная CMS
- **WooCommerce** - управление магазином
- **WPGraphQL** - GraphQL API для WordPress
- **WPGraphQL for WooCommerce** - расширение для WooCommerce
- **WPGraphQL JWT Authentication** - авторизация через JWT токены
- **Advanced Custom Fields + WPGraphQL for ACF** - кастомные поля

### Frontend (Next.js)

- **Next.js 15** - React фреймворк с App Router
- **TypeScript** - типизация кода
- **Apollo Client** - GraphQL клиент
- **Tailwind CSS** - утилитарные CSS классы
- **SWR** - кеширование и синхронизация данных
- **Zustand** - управление состоянием (корзина)

## 📦 Установка и настройка

### 1. Настройка WordPress Backend

#### Установка необходимых плагинов:

```bash
# Через WP-CLI
wp plugin install wp-graphql --activate
wp plugin install wp-graphql-woocommerce --activate
wp plugin install wp-graphql-jwt-authentication --activate
```

#### Конфигурация wp-config.php:

```php
// JWT Authentication
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-secret-key-here');

// CORS настройки для Next.js
define('GRAPHQL_DEBUG', true);

// Увеличение лимитов для GraphQL
define('GRAPHQL_MAX_QUERY_AMOUNT', 1000);
```

#### Настройка .htaccess для JWT:

```apache
# JWT Authentication
SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1

# CORS Headers
Header set Access-Control-Allow-Origin "https://your-frontend-domain.com"
Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

### 2. Структура Next.js проекта

```
beykush-frontend/
├── app/
│   ├── (shop)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   └── checkout/
│   │       └── page.tsx
│   ├── (static)/
│   │   ├── about/
│   │   ├── winery/
│   │   └── contact/
│   ├── api/
│   │   ├── revalidate/
│   │   └── checkout/
│   └── layout.tsx
├── components/
│   ├── layout/
│   ├── products/
│   ├── cart/
│   └── ui/
├── lib/
│   ├── apollo-client.ts
│   ├── graphql/
│   │   ├── queries/
│   │   └── mutations/
│   └── woocommerce/
├── hooks/
├── types/
└── styles/
```

## 🔧 Ключевые компоненты реализации

### 1. Настройка Apollo Client

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('woo-session');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'woocommerce-session': `Session ${token}`,
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
```

### 2. GraphQL запросы

```typescript
// lib/graphql/queries/products.ts
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        name
        slug
        description
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
        image {
          sourceUrl
          altText
        }
        productCategories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        stockQuantity
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      attributes {
        nodes {
          name
          options
        }
      }
      related(first: 4) {
        nodes {
          id
          name
          slug
          image {
            sourceUrl
          }
          ... on SimpleProduct {
            price
          }
        }
      }
    }
  }
`;
```

### 3. Управление корзиной

```typescript
// store/cart.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return total + parseFloat(item.price) * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'beykush-cart',
    }
  )
);
```

### 4. Страница продукта

```typescript
// app/(shop)/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { apolloClient } from '@/lib/apollo-client';
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql/queries/products';
import ProductDetails from '@/components/products/ProductDetails';

export async function generateStaticParams() {
  // Генерация статических путей для продуктов
  const { data } = await apolloClient.query({
    query: gql`
      query GetAllProductSlugs {
        products(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  return data.products.nodes.map((product: any) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const { data } = await apolloClient.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug: params.slug },
  });

  if (!data.product) {
    notFound();
  }

  return <ProductDetails product={data.product} />;
}
```

### 5. Процесс оформления заказа

```typescript
// lib/graphql/mutations/checkout.ts
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        id
        orderNumber
        status
        total
      }
      customer {
        id
      }
    }
  }
`;

// components/checkout/CheckoutForm.tsx
export function CheckoutForm() {
  const [createOrder] = useMutation(CREATE_ORDER);
  const cartItems = useCartStore((state) => state.items);

  const handleSubmit = async (formData: CheckoutFormData) => {
    try {
      const lineItems = cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const { data } = await createOrder({
        variables: {
          input: {
            paymentMethod: formData.paymentMethod,
            isPaid: false,
            billing: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address1: formData.address,
              city: formData.city,
              postcode: formData.postcode,
              country: 'UA',
            },
            lineItems,
          },
        },
      });

      // Редирект на страницу оплаты или успеха
      if (data.createOrder.order) {
        router.push(`/order-success/${data.createOrder.order.orderNumber}`);
      }
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };
}
```

## 🚀 Оптимизация производительности

### 1. Incremental Static Regeneration (ISR)

```typescript
// app/(shop)/products/[slug]/page.tsx
export const revalidate = 3600; // Обновление каждый час

// Или для динамической ревалидации
export async function generateStaticParams() {
  // ...
}

// API route для ревалидации по требованию
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { path, secret } = await request.json();

  // Проверка секретного ключа
  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

### 2. Оптимизация изображений

```typescript
// components/ui/ProductImage.tsx
import Image from 'next/image';

export function ProductImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={800}
      quality={85}
      loading="lazy"
      placeholder="blur"
      blurDataURL={generateBlurDataURL(src)}
      {...props}
    />
  );
}
```

### 3. Кеширование GraphQL запросов

```typescript
// lib/apollo-cache.ts
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: {
          keyArgs: ['where', 'orderby'],
          merge(existing, incoming, { args }) {
            const offset = args?.after ? existing?.nodes.length : 0;
            const merged = existing ? existing.nodes.slice(0) : [];

            for (let i = 0; i < incoming.nodes.length; ++i) {
              merged[offset + i] = incoming.nodes[i];
            }

            return {
              ...incoming,
              nodes: merged,
            };
          },
        },
      },
    },
  },
});
```

## 🔐 Безопасность

### 1. Защита API endpoints

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  // Защита админских роутов
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}
```

### 2. Валидация данных

```typescript
// lib/validation/checkout.ts
import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  postcode: z.string().regex(/^[0-9]{5}$/),
  paymentMethod: z.enum(['stripe', 'liqpay', 'cod']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
```

## 🌍 Интернационализация

### Настройка i18n

```typescript
// next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'uk',
    locales: ['uk', 'en', 'ru'],
  },
};

// lib/i18n/translations.ts
export const translations = {
  uk: {
    products: {
      title: 'Наші вина',
      addToCart: 'Додати до кошика',
      outOfStock: 'Немає в наявності',
    },
  },
  en: {
    products: {
      title: 'Our Wines',
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
    },
  },
};
```

## 📱 Progressive Web App (PWA)

### Конфигурация manifest.json

```json
{
  "name": "Beykush Winery",
  "short_name": "Beykush",
  "description": "Premium wines from the Black Sea coast",
  "theme_color": "#8B0000",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🚦 Мониторинг и аналитика

### 1. Интеграция Google Analytics

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

### 2. Мониторинг производительности

```typescript
// lib/monitoring/performance.ts
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Отправка метрик в систему мониторинга
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        page: window.location.pathname,
      }),
    });
  }
}
```

## 📋 Чек-лист для миграции

### Phase 1: Подготовка (1-2 недели)

- [ ] Установка и настройка WPGraphQL плагинов
- [ ] Создание GraphQL схемы для кастомных полей
- [ ] Настройка JWT авторизации
- [ ] Тестирование GraphQL API

### Phase 2: Разработка фронтенда (4-6 недель)

- [ ] Инициализация Next.js проекта
- [ ] Создание базовой структуры компонентов
- [ ] Реализация страниц продуктов
- [ ] Интеграция корзины и checkout
- [ ] Адаптивный дизайн

### Phase 3: Интеграция (2-3 недели)

- [ ] Подключение платежных систем
- [ ] Настройка доставки
- [ ] Email уведомления
- [ ] Личный кабинет пользователя

### Phase 4: Тестирование (1-2 недели)

- [ ] Функциональное тестирование
- [ ] Нагрузочное тестирование
- [ ] SEO аудит
- [ ] Проверка безопасности

### Phase 5: Запуск (1 неделя)

- [ ] Настройка хостинга (Vercel/Netlify)
- [ ] Конфигурация CDN
- [ ] DNS настройки
- [ ] Мониторинг первых дней работы

## 💡 Дополнительные рекомендации

1. **Используйте Vercel для хостинга** - оптимальная интеграция с Next.js
2. **Настройте Preview deployments** - для тестирования изменений
3. **Используйте Edge Functions** - для геолокации и персонализации
4. **Внедрите A/B тестирование** - для оптимизации конверсии
5. **Настройте автоматические бекапы** - для WordPress данных

## 🆘 Поддержка и обслуживание

### Регулярные задачи:

- Обновление зависимостей (ежемесячно)
- Проверка безопасности (еженедельно)
- Оптимизация изображений (по необходимости)
- Анализ производительности (ежемесячно)
- Резервное копирование (ежедневно)

### Мониторинг ключевых метрик:

- Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Конверсия в корзину (> 3%)
- Конверсия в заказ (> 1.5%)
- Скорость загрузки страниц (< 3s)
- Uptime (> 99.9%)

Это решение обеспечит максимальную производительность сайта при сохранении всей
функциональности WordPress и WooCommerce для управления контентом и заказами.
