# Design System

This directory contains the Beykush design system implementation using Tailwind
CSS v4.

## Files

- `globals.css` - Global styles, components, and utilities
- `theme.css` - Design tokens and theme configuration

## Design Tokens

### Colors

- **Primary**: Purple (`purple-600` / `#7c3aed`)
- **Secondary**: Burgundy (`burgundy-600` / `#a94f5c`)
- **Accent**: Gold (`gold-600` / `#d4af37`)
- **Background**: Cream (`#faf8f3`)

### Typography

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

### Spacing

Based on an 8px grid system:

- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px
- etc.

## Component Classes

### Buttons

```html
<!-- Primary button -->
<button class="btn btn-md btn-primary">Shop Wines</button>

<!-- Secondary button -->
<button class="btn btn-md btn-secondary">Learn More</button>

<!-- Sizes: btn-sm, btn-md, btn-lg -->
<!-- Variants: btn-primary, btn-secondary, btn-burgundy, btn-gold, btn-ghost -->
```

### Cards

```html
<div class="card">
  <img src="wine.jpg" alt="Wine" />
  <div class="card-body">
    <h3>Cabernet Sauvignon</h3>
    <p>Rich and full-bodied</p>
  </div>
</div>
```

### Forms

```html
<div>
  <label class="label" for="email">Email</label>
  <input type="email" id="email" class="input" placeholder="your@email.com" />
  <p class="error-message">Please enter a valid email</p>
</div>
```

### Badges

```html
<span class="badge badge-primary">New</span>
<span class="badge badge-wine-red">Red Wine</span>
<span class="badge badge-success">In Stock</span>
```

## Utility Classes

### Text Gradients

```html
<h1 class="text-gradient">Premium Wines</h1>
<h2 class="text-gradient-gold">Gold Collection</h2>
```

### Animations

```html
<div class="animate-fade-in-up">Fade in from bottom</div>
<div class="animate-fade-in-down">Fade in from top</div>
<div class="animate-scale-in">Scale in</div>
```

### Wine-Specific

```html
<div class="wine-card-shadow">Wine card with custom shadow</div>
<div class="gold-shimmer">Element with gold shimmer effect</div>
<svg class="wine-glass-tilt">Wine glass icon with tilt on hover</svg>
```

### Scrollbars

```html
<!-- Hide scrollbar -->
<div class="overflow-auto scrollbar-hide">...</div>

<!-- Custom styled scrollbar -->
<div class="overflow-auto scrollbar-custom">...</div>
```

## Responsive Design

Breakpoints:

- `xs`: 320px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

Example:

```html
<div class="px-4 sm:px-6 lg:px-8">
  <!-- Responsive padding -->
</div>
```

## Accessibility

- All interactive elements have focus states
- Color contrast meets WCAG AA standards
- Focus visible outline: `outline-2 outline-purple-600`
- Minimum touch target size: 44x44px
