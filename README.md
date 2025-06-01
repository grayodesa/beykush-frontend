# Beykush Frontend - Next.js E-commerce Platform

## 🍷 О проекте

Современный, высокопроизводительный frontend для винодельни Beykush, построенный на Next.js с использованием Headless WordPress архитектуры.

### Ключевые особенности
- ⚡ Молниеносная скорость загрузки (< 1 сек)
- 🛒 Полноценный e-commerce функционал
- 🌍 Мультиязычность (UK/EN/RU)
- 📱 Mobile-first дизайн
- 🔐 Безопасная интеграция с WordPress/WooCommerce
- 💳 Украинские платежные системы (LiqPay, Приват24)
- 📦 Интеграция с Нова Пошта

## 🚀 Быстрый старт

### Требования
- Node.js 20.x или выше
- pnpm 8.x или выше
- WordPress сайт с установленными плагинами:
  - WPGraphQL
  - WPGraphQL for WooCommerce
  - JWT Authentication for WPGraphQL

### Установка

```bash
# Клонирование репозитория
git clone https://github.com/your-org/beykush-frontend.git
cd beykush-frontend

# Установка зависимостей
pnpm install

# Копирование переменных окружения
cp .env.example .env.local

# Запуск development сервера
pnpm dev
```

### Настройка окружения

Создайте `.env.local` файл со следующими переменными:

```env
# WordPress GraphQL API
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=your-refresh-token

# Платежные системы
LIQPAY_PUBLIC_KEY=your-public-key
LIQPAY_PRIVATE_KEY=your-private-key

# Email
SENDGRID_API_KEY=your-api-key

# Доставка
NOVA_POSHTA_API_KEY=your-api-key

# Аналитика
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=your-pixel-id

# Другое
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATION_SECRET=your-secret-key
```

## 📁 Структура проекта

```
beykush-frontend/
├── app/                    # Next.js App Router
│   ├── (shop)/            # Группа маршрутов магазина
│   ├── (auth)/            # Защищенные маршруты
│   ├── api/               # API endpoints
│   └── layout.tsx         # Root layout
├── components/            # React компоненты
│   ├── ui/               # Базовые UI компоненты
│   ├── products/         # Компоненты продуктов
│   ├── cart/            # Компоненты корзины
│   └── layout/          # Layout компоненты
├── lib/                  # Утилиты и конфигурация
│   ├── apollo/          # GraphQL клиент
│   ├── graphql/         # Запросы и мутации
│   └── utils/           # Вспомогательные функции
├── hooks/               # Custom React hooks
├── store/               # Zustand stores
├── types/               # TypeScript типы
├── public/              # Статические файлы
└── docs/                # Документация проекта
```

## 🛠️ Основные команды

```bash
# Разработка
pnpm dev              # Запуск dev сервера
pnpm build            # Production сборка
pnpm start            # Запуск production сервера
pnpm lint             # Проверка линтером
pnpm test             # Запуск тестов
pnpm test:e2e         # E2E тесты
pnpm storybook        # Запуск Storybook

# Утилиты
pnpm analyze          # Анализ bundle size
pnpm type-check       # Проверка типов
pnpm format           # Форматирование кода
```

## 🧪 Тестирование

### Unit тесты
```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

### E2E тесты
```bash
pnpm test:e2e
pnpm test:e2e:ui    # С UI Playwright
```

### Тестирование компонентов
```bash
pnpm storybook
pnpm test:storybook
```

## 📦 Основные зависимости

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Apollo Client** - GraphQL client
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Hook Form** - Forms
- **Zod** - Validation
- **Framer Motion** - Animations

## 🔧 Конфигурация

### GraphQL Codegen

Для генерации типов из GraphQL схемы:

```bash
pnpm codegen
pnpm codegen:watch
```

### Tailwind CSS

Конфигурация в `tailwind.config.js` включает:
- Кастомные цвета бренда
- Расширенную типографику
- Анимации

## 🚀 Deployment

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения
3. Deploy происходит автоматически при push в main

### Другие платформы

```bash
# Build для production
pnpm build

# Необходимые переменные окружения
# должны быть настроены на платформе
```

## 📊 Мониторинг

- **Vercel Analytics** - встроенная аналитика
- **Sentry** - отслеживание ошибок
- **Google Analytics** - пользовательская аналитика

## 🤝 Contributing

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

### Стандарты кода

- Используем Prettier для форматирования
- ESLint для качества кода
- Conventional Commits для сообщений
- TypeScript strict mode

## 📝 Документация

Полная документация доступна в папке `/docs`:

- [Техническое задание](./docs/TECHNICAL_SPECIFICATION_COMPLETE.md)
- [Архитектура](./docs/architecture.md)
- [Дизайн-система](./docs/07_design_system.md)
- [API документация](./docs/08_integrations.md)

## 🐛 Известные проблемы

Актуальный список issues: [GitHub Issues](https://github.com/your-org/beykush-frontend/issues)

## 📞 Поддержка

- **Email**: dev@beykush.com
- **Slack**: #beykush-frontend
- **Documentation**: [Wiki](https://github.com/your-org/beykush-frontend/wiki)

## 📄 Лицензия

Proprietary - © 2024 Beykush Winery. All rights reserved.

---

Built with ❤️ using Next.js and WordPress