# 7. Дизайн-система

## 7.1 Принципы дизайна

### 7.1.1 Философия бренда

- **Элегантность**: премиальное позиционирование
- **Аутентичность**: связь с украинской культурой
- **Минимализм**: чистый, современный дизайн
- **Природность**: связь с виноградниками и морем

### 7.1.2 Визуальная иерархия

- **F-pattern**: для контентных страниц
- **Z-pattern**: для landing страниц
- **Контраст**: четкое разделение элементов
- **Белое пространство**: достаточно "воздуха"

### 7.1.3 Эмоциональный дизайн

- **Доверие**: через профессионализм
- **Желание**: через визуальную привлекательность
- **Удовольствие**: через микровзаимодействия
- **Гордость**: через украинскую идентичность

## 7.2 Цветовая палитра

### 7.2.1 Основные цвета

```scss
// Бренд цвета
$beykush-purple: #7c3aed; // Основной акцент
$beykush-purple-light: #8b5cf6; // Hover состояние
$beykush-purple-dark: #6d28d9; // Active состояние

$beykush-burgundy: #a94f5c; // Вторичный акцент
$beykush-burgundy-light: #c26975;
$beykush-burgundy-dark: #8b3e49;

$beykush-gold: #d4af37; // Премиум акцент
$beykush-gold-light: #e4c65b;
$beykush-gold-dark: #b8941f;
```

### 7.2.2 Нейтральные цвета

```scss
// Оттенки серого
$gray-50: #fafafa;
$gray-100: #f4f4f5;
$gray-200: #e4e4e7;
$gray-300: #d4d4d8;
$gray-400: #a1a1aa;
$gray-500: #71717a;
$gray-600: #52525b;
$gray-700: #3f3f46;
$gray-800: #27272a;
$gray-900: #18181b;

// Фоновые цвета
$beykush-cream: #faf8f3; // Основной фон
$beykush-white: #ffffff; // Карточки
```

### 7.2.3 Семантические цвета

```scss
// Статусы
$success: #22c55e;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;

// Вина
$wine-red: #722f37;
$wine-white: #f3e5ab;
$wine-rose: #f4c2c2;
$wine-sparkling: #f7e7ce;
```

### 7.2.4 Применение цветов

- **60%** - Основной фон (cream/white)
- **30%** - Вторичные элементы (grays)
- **10%** - Акценты (purple/burgundy)

## 7.3 Типографика

### 7.3.1 Шрифты

```css
/* Заголовки */
font-family: 'Playfair Display', Georgia, serif;

/* Основной текст */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  sans-serif;

/* Моноширинный */
font-family: 'JetBrains Mono', monospace;
```

### 7.3.2 Размеры шрифтов

```scss
// Type scale (1.25 ratio)
$text-xs: 0.75rem; // 12px
$text-sm: 0.875rem; // 14px
$text-base: 1rem; // 16px
$text-lg: 1.125rem; // 18px
$text-xl: 1.25rem; // 20px
$text-2xl: 1.5rem; // 24px
$text-3xl: 1.875rem; // 30px
$text-4xl: 2.25rem; // 36px
$text-5xl: 3rem; // 48px
$text-6xl: 3.75rem; // 60px
$text-7xl: 4.5rem; // 72px
```

### 7.3.3 Стили текста

```scss
// Заголовки
.h1 {
  font-size: $text-5xl;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

// Основной текст
.body {
  font-size: $text-base;
  line-height: 1.5;
  font-weight: 400;
}

// Мелкий текст
.caption {
  font-size: $text-sm;
  line-height: 1.4;
  font-weight: 400;
}
```

### 7.3.4 Использование

- **Playfair Display**: заголовки, логотип, акценты
- **Inter**: основной текст, UI элементы
- **Вес шрифта**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## 7.4 Сетка и отступы

### 7.4.1 Сетка

```scss
// Container
$container-max-width: 1280px;
$container-padding: 1rem; // mobile
$container-padding-lg: 2rem; // desktop

// Grid
$grid-columns: 12;
$grid-gap: 1.5rem;
```

### 7.4.2 Spacing scale

```scss
// Base unit: 4px
$space-0: 0;
$space-1: 0.25rem; // 4px
$space-2: 0.5rem; // 8px
$space-3: 0.75rem; // 12px
$space-4: 1rem; // 16px
$space-5: 1.25rem; // 20px
$space-6: 1.5rem; // 24px
$space-8: 2rem; // 32px
$space-10: 2.5rem; // 40px
$space-12: 3rem; // 48px
$space-16: 4rem; // 64px
$space-20: 5rem; // 80px
$space-24: 6rem; // 96px
```

### 7.4.3 Breakpoints

```scss
$breakpoint-xs: 320px;
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## 7.5 Компоненты UI

### 7.5.1 Кнопки

```scss
// Размеры
.btn-sm {
  padding: $space-2 $space-4;
  font-size: $text-sm;
}

.btn-md {
  padding: $space-3 $space-6;
  font-size: $text-base;
}

.btn-lg {
  padding: $space-4 $space-8;
  font-size: $text-lg;
}

// Варианты
.btn-primary {
  background: $beykush-purple;
  color: white;

  &:hover {
    background: $beykush-purple-light;
  }
}

.btn-secondary {
  background: white;
  color: $gray-900;
  border: 1px solid $gray-300;
}
```

### 7.5.2 Формы

```scss
// Input fields
.input {
  padding: $space-3 $space-4;
  border: 1px solid $gray-300;
  border-radius: $radius-lg;
  font-size: $text-base;

  &:focus {
    border-color: $beykush-purple;
    outline: 2px solid rgba($beykush-purple, 0.2);
  }
}

// Labels
.label {
  font-size: $text-sm;
  font-weight: 500;
  color: $gray-700;
  margin-bottom: $space-2;
}
```

### 7.5.3 Карточки

```scss
.card {
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-sm;
  overflow: hidden;

  &:hover {
    box-shadow: $shadow-lg;
  }
}
```

## 7.6 Иконки

### 7.6.1 Набор иконок

- **Основной**: Lucide Icons
- **Дополнительный**: Custom SVG icons
- **Размеры**: 16px, 20px, 24px, 32px, 48px

### 7.6.2 Использование

```tsx
// Размеры
<Icon size="sm" />  // 16px
<Icon size="md" />  // 20px
<Icon size="lg" />  // 24px
<Icon size="xl" />  // 32px

// Цвета
<Icon color="primary" />
<Icon color="gray" />
<Icon color="currentColor" />
```

### 7.6.3 Кастомные иконки

- Бутылка вина
- Бокал вина
- Виноград
- Виноградник
- Бочка

## 7.7 Тени и радиусы

### 7.7.1 Тени

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
$shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

// Специальные
$shadow-wine: 0 0 20px rgba(212, 175, 55, 0.1);
$shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
```

### 7.7.2 Радиусы

```scss
$radius-none: 0;
$radius-sm: 0.125rem; // 2px
$radius-md: 0.375rem; // 6px
$radius-lg: 0.5rem; // 8px
$radius-xl: 0.75rem; // 12px
$radius-2xl: 1rem; // 16px
$radius-3xl: 1.5rem; // 24px
$radius-full: 9999px;
```

## 7.8 Анимации

### 7.8.1 Длительность

```scss
$duration-fast: 150ms;
$duration-normal: 200ms;
$duration-slow: 300ms;
$duration-slower: 400ms;
```

### 7.8.2 Easing функции

```scss
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 7.8.3 Анимации

```scss
// Fade in
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Scale
@keyframes scale {
  from {
    transform: scale(0.95);
  }
  to {
    transform: scale(1);
  }
}
```

## 7.9 Паттерны дизайна

### 7.9.1 Карточка продукта

- Изображение сверху (aspect-ratio 3:4)
- Информация снизу с отступами
- Hover эффект масштабирования
- Быстрые действия при наведении

### 7.9.2 Hero секция

- Полноэкранное изображение/видео
- Затемнение для читаемости текста
- Центрированный контент
- CTA кнопки внизу

### 7.9.3 Формы

- Label сверху
- Подсказки под полем
- Inline валидация
- Группировка связанных полей

### 7.9.4 Навигация

- Sticky header на скролле
- Мега-меню для категорий
- Мобильное меню справа
- Breadcrumbs для ориентации

## 7.10 Адаптивный дизайн

### 7.10.1 Mobile First

```scss
// Base styles (mobile)
.container {
  padding: $space-4;
}

// Tablet
@media (min-width: $breakpoint-md) {
  .container {
    padding: $space-6;
  }
}

// Desktop
@media (min-width: $breakpoint-lg) {
  .container {
    padding: $space-8;
    max-width: $container-max-width;
  }
}
```

### 7.10.2 Touch targets

- Минимум 44x44px для кнопок
- Достаточные отступы между элементами
- Увеличенные области клика

### 7.10.3 Responsive изображения

```html
<picture>
  <source media="(min-width: 1024px)" srcset="large.jpg" />
  <source media="(min-width: 768px)" srcset="medium.jpg" />
  <img src="small.jpg" alt="Wine bottle" />
</picture>
```

## 7.11 Доступность

### 7.11.1 Цветовой контраст

- Обычный текст: минимум 4.5:1
- Крупный текст: минимум 3:1
- UI элементы: минимум 3:1

### 7.11.2 Фокус стили

```scss
.focus-visible {
  outline: 2px solid $beykush-purple;
  outline-offset: 2px;
}
```

### 7.11.3 ARIA labels

- Все интерактивные элементы
- Описательные labels
- Состояния элементов

## 7.12 Темная тема (опционально)

### 7.12.1 Цвета для темной темы

```scss
// Backgrounds
$dark-bg: #18181b;
$dark-surface: #27272a;

// Text
$dark-text-primary: #fafafa;
$dark-text-secondary: #a1a1aa;

// Accents остаются те же
```

### 7.12.2 Реализация

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #18181b;
    --text-color: #fafafa;
  }
}
```

---
