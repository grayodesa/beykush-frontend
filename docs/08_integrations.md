# 8. Интеграции

## 8.1 WordPress/WooCommerce интеграция

### 8.1.1 WPGraphQL
**Цель**: Основной API для получения данных

**Endpoints**:
```graphql
# Production
https://beykush.com/graphql

# Staging
https://staging.beykush.com/graphql
```

**Необходимые плагины**:
- WPGraphQL v1.19+
- WPGraphQL for WooCommerce v0.19+
- WPGraphQL JWT Authentication v0.7+
- WPGraphQL for Advanced Custom Fields v0.6+

**Конфигурация**:
```php
// wp-config.php
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-secret-key');
define('GRAPHQL_DEBUG', false);
define('GRAPHQL_MAX_QUERY_AMOUNT', 1000);
```

### 8.1.2 Аутентификация
**JWT Flow**:
1. Login mutation → получение authToken и refreshToken
2. Сохранение токенов в secure cookies
3. Добавление токена в headers для запросов
4. Refresh token при истечении

**Пример**:
```typescript
// lib/auth/jwt.ts
export async function authenticate(username: string, password: string) {
  const { data } = await apolloClient.mutate({
    mutation: LOGIN_MUTATION,
    variables: { username, password }
  });
  
  // Сохранение токенов
  setCookie('authToken', data.login.authToken, { 
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  return data.login.user;
}
```

### 8.1.3 WooCommerce Session
**Управление сессией**:
- Создание сессии при первом добавлении в корзину
- Синхронизация с WordPress сессией
- Очистка при logout

**Headers**:
```typescript
{
  'Authorization': `Bearer ${authToken}`,
  'woocommerce-session': `Session ${sessionToken}`
}
```

## 8.2 Платежные системы

### 8.2.1 LiqPay
**Документация**: https://www.liqpay.ua/documentation/api

**Интеграция**:
```typescript
// lib/payments/liqpay.ts
interface LiqPayConfig {
  public_key: string;
  private_key: string;
  version: '3';
  action: 'pay' | 'hold';
  currency: 'UAH';
}

export class LiqPayService {
  async createPayment(order: Order) {
    const data = {
      public_key: process.env.LIQPAY_PUBLIC_KEY,
      version: '3',
      action: 'pay',
      amount: order.total,
      currency: 'UAH',
      description: `Заказ №${order.orderNumber}`,
      order_id: order.id,
      result_url: `${process.env.NEXT_PUBLIC_URL}/checkout/success`,
      server_url: `${process.env.NEXT_PUBLIC_URL}/api/liqpay/callback`,
    };
    
    const signature = this.generateSignature(data);
    return { data, signature };
  }
  
  private generateSignature(data: any) {
    const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
    const sign_string = process.env.LIQPAY_PRIVATE_KEY + base64 + process.env.LIQPAY_PRIVATE_KEY;
    return crypto.createHash('sha1').update(sign_string).digest('base64');
  }
}
```

**Callback обработка**:
```typescript
// app/api/liqpay/callback/route.ts
export async function POST(request: Request) {
  const { data, signature } = await request.json();
  
  // Верификация подписи
  if (!verifySignature(data, signature)) {
    return Response.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Обновление статуса заказа
  const decodedData = JSON.parse(Buffer.from(data, 'base64').toString());
  await updateOrderStatus(decodedData.order_id, decodedData.status);
  
  return Response.json({ success: true });
}
```

### 8.2.2 Приват24
**API**: Merchant API

**Конфигурация**:
```typescript
interface Privat24Config {
  merchant_id: string;
  merchant_password: string;
  return_url: string;
  server_url: string;
}
```

### 8.2.3 Stripe (международные платежи)
**SDK**: @stripe/stripe-js

**Интеграция**:
```typescript
// lib/payments/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export async function createCheckoutSession(order: Order) {
  const response = await fetch('/api/stripe/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: order.id })
  });
  
  const { sessionId } = await response.json();
  const stripe = await stripePromise;
  
  return stripe?.redirectToCheckout({ sessionId });
}
```

## 8.3 Службы доставки

### 8.3.1 Нова Пошта API
**Документация**: https://developers.novaposhta.ua

**Основные методы**:
```typescript
// lib/shipping/novaposhta.ts
class NovaPoshtaAPI {
  private apiKey = process.env.NOVA_POSHTA_API_KEY;
  private apiUrl = 'https://api.novaposhta.ua/v2.0/json/';
  
  // Получение списка городов
  async getCities(search: string) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        apiKey: this.apiKey,
        modelName: 'Address',
        calledMethod: 'getCities',
        methodProperties: {
          FindByString: search,
          Limit: 20
        }
      })
    });
    
    return response.json();
  }
  
  // Получение отделений
  async getWarehouses(cityRef: string) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        apiKey: this.apiKey,
        modelName: 'Address',
        calledMethod: 'getWarehouses',
        methodProperties: {
          CityRef: cityRef,
          Limit: 50
        }
      })
    });
    
    return response.json();
  }
  
  // Расчет стоимости доставки
  async calculateShipping(params: ShippingParams) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      body: JSON.stringify({
        apiKey: this.apiKey,
        modelName: 'InternetDocument',
        calledMethod: 'getDocumentPrice',
        methodProperties: {
          CitySender: params.citySender,
          CityRecipient: params.cityRecipient,
          Weight: params.weight,
          ServiceType: 'WarehouseWarehouse',
          Cost: params.cost,
          CargoType: 'Cargo',
          SeatsAmount: params.seatsAmount
        }
      })
    });
    
    return response.json();
  }
}
```

**UI компоненты**:
```typescript
// components/checkout/NovaPoshtaSelector.tsx
export function NovaPoshtaSelector({ onChange }) {
  const [city, setCity] = useState(null);
  const [warehouse, setWarehouse] = useState(null);
  
  return (
    <>
      <CityAutocomplete 
        onSelect={setCity}
        placeholder="Введіть місто"
      />
      
      {city && (
        <WarehouseSelect
          cityRef={city.Ref}
          onSelect={setWarehouse}
          placeholder="Виберіть відділення"
        />
      )}
    </>
  );
}
```

### 8.3.2 УкрПошта API
**Endpoints**:
- Расчет тарифов
- Отслеживание посылок
- Адресный классификатор

## 8.4 Email сервисы

### 8.4.1 SendGrid
**SDK**: @sendgrid/mail

**Настройка**:
```typescript
// lib/email/sendgrid.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOrderConfirmation(order: Order) {
  const msg = {
    to: order.billing.email,
    from: 'orders@beykush.com',
    templateId: 'd-xxxxxxxxxxxxx', // SendGrid template ID
    dynamicTemplateData: {
      orderNumber: order.orderNumber,
      customerName: order.billing.firstName,
      orderTotal: order.total,
      items: order.lineItems,
      shippingAddress: order.shipping
    }
  };
  
  return sgMail.send(msg);
}
```

**Email templates**:
- Подтверждение заказа
- Отправка заказа
- Доставка заказа
- Восстановление пароля
- Приветствие нового клиента
- Винный клуб уведомления

### 8.4.2 Transactional emails
```typescript
// lib/email/templates.ts
export const emailTemplates = {
  orderConfirmation: {
    subject: 'Замовлення №{{orderNumber}} підтверджено',
    preheader: 'Дякуємо за ваше замовлення!'
  },
  shipping: {
    subject: 'Ваше замовлення відправлено',
    preheader: 'Трек номер: {{trackingNumber}}'
  },
  delivered: {
    subject: 'Замовлення доставлено',
    preheader: 'Насолоджуйтесь нашими винами!'
  }
};
```

## 8.5 Аналитика и мониторинг

### 8.5.1 Google Analytics 4
**SDK**: @next/third-parties/google

**События**:
```typescript
// lib/analytics/ga4.ts
export const GA_EVENTS = {
  // E-commerce
  view_item: 'view_item',
  add_to_cart: 'add_to_cart',
  remove_from_cart: 'remove_from_cart',
  begin_checkout: 'begin_checkout',
  purchase: 'purchase',
  
  // Custom
  wine_club_join: 'wine_club_join',
  newsletter_signup: 'newsletter_signup',
  product_review: 'product_review'
};

export function trackEvent(eventName: string, parameters: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}
```

### 8.5.2 Google Tag Manager
**Container ID**: GTM-XXXXXXX

**Data Layer**:
```typescript
// lib/analytics/gtm.ts
export function pushToDataLayer(data: any) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }
}

// Пример использования
pushToDataLayer({
  event: 'purchase',
  ecommerce: {
    transaction_id: order.id,
    value: order.total,
    currency: 'UAH',
    items: order.items
  }
});
```

### 8.5.3 Facebook Pixel
**Pixel ID**: Из настроек Facebook Business

**События**:
```typescript
// lib/analytics/facebook.ts
export function trackFacebookEvent(eventName: string, parameters?: any) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
}

// Standard events
trackFacebookEvent('ViewContent', {
  content_ids: [product.id],
  content_type: 'product',
  value: product.price,
  currency: 'UAH'
});
```

### 8.5.4 Sentry
**DSN**: Из проекта Sentry

**Конфигурация**:
```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

## 8.6 CRM интеграции

### 8.6.1 Mailchimp
**API**: Marketing API v3

**Синхронизация**:
```typescript
// lib/crm/mailchimp.ts
export async function syncCustomerToMailchimp(customer: Customer) {
  const response = await fetch(
    `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: customer.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: customer.firstName,
          LNAME: customer.lastName,
          PHONE: customer.phone
        },
        tags: ['customer', customer.wineClubMember ? 'wine-club' : '']
      })
    }
  );
  
  return response.json();
}
```

### 8.6.2 HubSpot (опционально)
**API**: Contacts API

**Webhooks**:
- Новый заказ → создание/обновление контакта
- Регистрация → создание контакта
- Винный клуб → обновление свойств

## 8.7 Социальные сети

### 8.7.1 Instagram Basic Display API
**Использование**:
- Отображение последних постов
- User-generated content
- Виджет Instagram feed

### 8.7.2 Facebook SDK
**Login with Facebook**:
```typescript
// lib/social/facebook.ts
export async function loginWithFacebook() {
  const { authResponse } = await new Promise((resolve) => {
    FB.login(resolve, { scope: 'email,public_profile' });
  });
  
  if (authResponse) {
    // Отправка токена на backend
    const user = await authenticateWithFacebook(authResponse.accessToken);
    return user;
  }
}
```

## 8.8 SEO инструменты

### 8.8.1 Google Search Console
**Верификация**: HTML meta tag

**Sitemap**:
```typescript
// app/sitemap.ts
export default async function sitemap() {
  const products = await getAllProducts();
  const posts = await getAllPosts();
  
  return [
    {
      url: 'https://beykush.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...products.map((product) => ({
      url: `https://beykush.com/products/${product.slug}`,
      lastModified: product.modifiedDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `https://beykush.com/blog/${post.slug}`,
      lastModified: post.modifiedDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    }))
  ];
}
```

### 8.8.2 Schema.org структурированные данные
```typescript
// lib/seo/schema.ts
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Beykush Winery',
    url: 'https://beykush.com',
    logo: 'https://beykush.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+380-50-069-5777',
      contactType: 'customer service',
      availableLanguage: ['Ukrainian', 'English', 'Russian']
    },
    sameAs: [
      'https://www.facebook.com/beykushwinery',
      'https://www.instagram.com/beykush_winery'
    ]
  };
}
```

## 8.9 Внешние виджеты

### 8.9.1 Отзывы Google
**Google Places API**: для отображения рейтинга

### 8.9.2 TrustPilot
**Widget**: встраиваемый виджет отзывов

### 8.9.3 Live Chat
**Tawk.to** или **Intercom**: для поддержки клиентов

## 8.10 Безопасность интеграций

### 8.10.1 API Keys управление
```typescript
// Все ключи в переменных окружения
NEXT_PUBLIC_* - для публичных ключей
* - для приватных ключей

// Валидация на сервере
if (!process.env.API_KEY) {
  throw new Error('API_KEY is required');
}
```

### 8.10.2 Rate limiting
```typescript
// lib/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум запросов
  message: 'Too many requests'
});
```

### 8.10.3 Webhook безопасность
```typescript
// Верификация подписей
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

---