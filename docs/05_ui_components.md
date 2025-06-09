# 5. UI Компоненты

## 5.1 Система компонентов

### Принципы построения

- **Atomic Design** - от атомов к организмам
- **Композиция** - составные компоненты
- **Переиспользование** - DRY принцип
- **Типизация** - строгие TypeScript типы
- **Доступность** - ARIA атрибуты

### Структура папок

```
components/
├── atoms/          # Базовые элементы
├── molecules/      # Составные компоненты
├── organisms/      # Сложные компоненты
├── templates/      # Шаблоны страниц
├── layout/         # Layout компоненты
└── providers/      # Context providers
```

## 5.2 Атомарные компоненты

### 5.2.1 Button

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
```

**Варианты:**

- Primary - фиолетовый фон
- Secondary - белый фон
- Outline - прозрачный с рамкой
- Ghost - прозрачный

### 5.2.2 Input

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  label?: string;
  placeholder?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}
```

### 5.2.3 Badge

- Статусы (new, sale, out-of-stock)
- Размеры (sm, md)
- Цвета по статусу

### 5.2.4 Typography

- Heading (h1-h6)
- Text (body, caption)
- Label
- Link

### 5.2.5 Icon

- Обертка для Lucide icons
- Размеры
- Цвета
- Анимации

## 5.3 Молекулярные компоненты

### 5.3.1 FormField

```typescript
interface FormFieldProps {
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}
```

### 5.3.2 Card

```typescript
interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}
```

### 5.3.3 Modal

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}
```

### 5.3.4 Dropdown

- Trigger элемент
- Позиционирование
- Анимация появления
- Клик вне закрывает

### 5.3.5 Toast

- Типы (success, error, warning, info)
- Позиция на экране
- Auto-dismiss
- Действия

## 5.4 Организмы (сложные компоненты)

### 5.4.1 ProductCard

```typescript
interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'list';
  showQuickView?: boolean;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
}
```

**Элементы:**

- Изображение с hover эффектом
- Бейджи (новинка, скидка)
- Название и категория
- Цена (обычная/со скидкой)
- Рейтинг
- Кнопки действий

### 5.4.2 ProductGallery

```typescript
interface ProductGalleryProps {
  images: Image[];
  showThumbnails?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
}
```

**Функции:**

- Переключение изображений
- Zoom при наведении
- Fullscreen режим
- Touch жесты на мобильных

### 5.4.3 CartItem

```typescript
interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  editable?: boolean;
}
```

### 5.4.4 CheckoutForm

- Многошаговая форма
- Прогресс бар
- Валидация полей
- Сохранение между шагами

### 5.4.5 ProductFilters

```typescript
interface ProductFiltersProps {
  categories: Category[];
  priceRange: [number, number];
  attributes: FilterAttribute[];
  onFilterChange: (filters: Filters) => void;
}
```

## 5.5 Layout компоненты

### 5.5.1 Header

```typescript
interface HeaderProps {
  transparent?: boolean;
  sticky?: boolean;
}
```

**Секции:**

- Топ бар (язык, контакты)
- Основная навигация
- Поиск
- Действия (корзина, профиль)

### 5.5.2 Footer

**Секции:**

- О компании
- Покупателям
- Контакты
- Подписка
- Соцсети
- Копирайт

### 5.5.3 Sidebar

- Для каталога
- Для личного кабинета
- Collapsible на мобильных

### 5.5.4 PageLayout

```typescript
interface PageLayoutProps {
  title?: string;
  breadcrumbs?: Breadcrumb[];
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}
```

## 5.6 Специализированные компоненты

### 5.6.1 WineCard

Расширенная версия ProductCard с:

- Характеристики вина
- Год урожая
- Крепость
- Сорт винограда
- Температура подачи

### 5.6.2 WineClubBanner

- Информация о программе
- Текущий статус
- CTA для вступления

### 5.6.3 NewsletterForm

- Email поле
- Согласие на рассылку
- Успешная подписка

### 5.6.4 StoreLocator

- Карта с точками
- Список магазинов
- Фильтр по городу

### 5.6.5 AgeGate

- Модальное окно
- Проверка возраста
- Запоминание выбора

## 5.7 Утилитарные компоненты

### 5.7.1 SEO

```typescript
interface SEOProps {
  title: string;
  description: string;
  image?: string;
  article?: boolean;
}
```

### 5.7.2 ErrorBoundary

- Отлов ошибок
- Fallback UI
- Логирование в Sentry

### 5.7.3 LazyImage

- Lazy loading
- Placeholder
- Error state
- Оптимизация

### 5.7.4 InfiniteScroll

- Автозагрузка
- Loading state
- End reached callback

### 5.7.5 ProtectedRoute

- Проверка авторизации
- Редирект на login
- Loading state

## 5.8 Анимации и переходы

### 5.8.1 Page Transitions

- Fade между страницами
- Slide для мобильного меню
- Scale для модальных окон

### 5.8.2 Micro Interactions

- Hover эффекты
- Loading состояния
- Success анимации
- Error shake

### 5.8.3 Scroll Animations

- Fade in при скролле
- Parallax эффекты
- Progress indicators

## 5.9 Темизация и кастомизация

### 5.9.1 CSS Variables

```css
:root {
  --color-primary: #7c3aed;
  --color-secondary: #a94f5c;
  --color-accent: #d4af37;
  --font-heading: 'Playfair Display';
  --font-body: 'Inter';
}
```

### 5.9.2 Tailwind Config

- Кастомные цвета
- Расширенные breakpoints
- Кастомные анимации

### 5.9.3 Component Variants

- Использование CVA
- Композиция стилей
- Переопределение defaults

## 5.10 Документация компонентов

### 5.10.1 Storybook

- Все компоненты в изоляции
- Различные состояния
- Контролы для props
- Документация использования

### 5.10.2 Примеры использования

- Code snippets
- Best practices
- Common patterns
- Do's and Don'ts
