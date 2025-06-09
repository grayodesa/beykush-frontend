# 2. Технический стек

## 2.1 Frontend технологии

### Основной фреймворк

- **Next.js 15.0+**
  - App Router для современной архитектуры
  - Server Components для оптимизации
  - Built-in оптимизации изображений
  - API Routes для серверной логики

### Язык программирования

- **TypeScript 5.0+**
  - Строгая типизация
  - Улучшенный developer experience
  - Меньше runtime ошибок

### Стилизация

- **Tailwind CSS 3.4+**
  - Utility-first подход
  - Кастомная дизайн-система
  - PostCSS для дополнительной обработки
  - CSS Modules для изолированных стилей

### State Management

- **Zustand**
  - Управление корзиной
  - Локальные настройки пользователя
- **React Context API**
  - Аутентификация
  - Языковые настройки
- **Apollo Client Cache**
  - Кеширование GraphQL запросов

### Работа с данными

- **Apollo Client 3.8+**
  - GraphQL запросы и мутации
  - Оптимистичные обновления
  - Кеширование и синхронизация
- **SWR**
  - Для REST API endpoints
  - Real-time обновления

### Формы и валидация

- **React Hook Form**
  - Производительные формы
  - Минимальные ре-рендеры
- **Zod**
  - Schema валидация
  - Type inference

### UI библиотеки

- **Radix UI**
  - Доступные компоненты
  - Headless подход
- **Framer Motion**
  - Анимации и переходы
  - Gesture поддержка
- **Lucide React**
  - Иконки

### Утилиты

- **date-fns**
  - Работа с датами
  - Локализация
- **clsx + tailwind-merge**
  - Conditional классы
- **react-intersection-observer**
  - Lazy loading
  - Scroll анимации

## 2.2 Backend технологии (существующие)

### CMS и E-commerce

- **WordPress 6.4+**
  - Headless CMS
  - Управление контентом
- **WooCommerce 8.5+**
  - Управление продуктами
  - Обработка заказов
  - Интеграции доставки

### GraphQL API

- **WPGraphQL 1.19+**
  - Основной GraphQL endpoint
- **WPGraphQL for WooCommerce 0.19+**
  - E-commerce функциональность
- **WPGraphQL JWT Authentication**
  - Аутентификация пользователей
- **WPGraphQL for ACF**
  - Кастомные поля

### Дополнительные плагины

- **Advanced Custom Fields Pro**
  - Кастомные поля для вин
- **WPML или Polylang**
  - Мультиязычность
- **Yoast SEO**
  - SEO метаданные

## 2.3 Инфраструктура

### Хостинг Frontend

- **Vercel**
  - Оптимизация для Next.js
  - Edge Functions
  - Analytics
  - Web Vitals monitoring

### CDN и оптимизация

- **Vercel Edge Network**
  - Глобальная CDN
  - Image Optimization API
- **Cloudinary** (опционально)
  - Дополнительная обработка изображений

### База данных

- **WordPress MySQL** (существующая)
- **Redis** (для кеширования сессий)

### Email сервисы

- **SendGrid/Mailgun**
  - Транзакционные email
  - Email кампании

## 2.4 DevOps и инструменты

### Version Control

- **Git + GitHub**
  - Монорепозиторий подход
  - Conventional Commits
  - Branch protection

### CI/CD

- **GitHub Actions**
  - Автоматические тесты
  - Preview deployments
  - Production deployments
- **Vercel CLI**
  - Локальное тестирование

### Качество кода

- **ESLint**
  - Next.js config
  - Custom rules
- **Prettier**
  - Code formatting
- **Husky + lint-staged**
  - Pre-commit hooks
- **Commitlint**
  - Commit message validation

### Тестирование

- **Jest**
  - Unit tests
  - Integration tests
- **React Testing Library**
  - Component tests
- **Playwright**
  - E2E tests
- **Lighthouse CI**
  - Performance tests

### Мониторинг

- **Sentry**
  - Error tracking
  - Performance monitoring
- **Vercel Analytics**
  - Web analytics
  - Core Web Vitals
- **LogRocket** (опционально)
  - Session replay

### Документация

- **Storybook**
  - Компонентная документация
  - Visual testing
- **TypeDoc**
  - API документация

## 2.5 Внешние сервисы и API

### Платежные системы

- **LiqPay API**
  - Основной платежный провайдер
- **Приват24 API**
  - Альтернативный метод
- **Stripe API**
  - Международные платежи

### Доставка

- **Нова Пошта API**
  - Основная служба доставки
- **УкрПошта API**
  - Альтернативная доставка

### Аналитика и маркетинг

- **Google Analytics 4**
- **Google Tag Manager**
- **Facebook Pixel**
- **Hotjar** (тепловые карты)

### Безопасность

- **Cloudflare** (опционально)
  - DDoS защита
  - WAF
  - Bot management

## 2.6 Требования к окружению

### Development

- Node.js 20.x LTS
- npm/yarn/pnpm
- Docker (для локального WordPress)

### Production

- Node.js 20.x
- HTTPS обязательно
- HTTP/2 поддержка

### Браузеры

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari iOS 14+
- Chrome Android 90+
