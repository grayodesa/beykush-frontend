# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

Beykush Frontend is a modern e-commerce platform for a Ukrainian winery, built
as a headless WordPress solution with Next.js frontend. The project is currently
in the planning/documentation phase with comprehensive technical specifications.

## Local WordPress Environment

A local copy of the existing WordPress site is available at
`http://beykush.local/` and can be queried via WordPress REST API using the
alias 'beykush'. This connection is verified and working for development use.
The local environment contains:

- Current product catalog with wine data
- Existing content structure
- WooCommerce configuration
- Current categories and taxonomies
- Media assets and product images

Use this local environment to:

- Understand the current data structure
- Query existing products and content via REST API endpoints
- Test GraphQL queries against real data
- Ensure compatibility with existing WordPress setup
- Adapt the Next.js frontend to match current content organization
- Fetch real wine product data for development and testing

## Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 3.4+
- **State Management**: Zustand (cart), React Context (auth/i18n), Apollo Client
  Cache
- **Data Fetching**: Apollo Client 3.8+ (GraphQL), SWR (REST)
- **Backend**: WordPress with WooCommerce (headless via WPGraphQL)

## Common Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm storybook        # Component documentation

# Code Quality
pnpm type-check       # TypeScript validation
pnpm format           # Prettier formatting
pnpm analyze          # Bundle size analysis

# GraphQL
pnpm codegen          # Generate GraphQL types
pnpm codegen:watch    # Watch mode for GraphQL types
```

## Architecture Overview

The project follows a headless CMS architecture where WordPress serves as the
content management system and API provider, while Next.js handles the frontend
presentation layer.

### Key Architectural Decisions:

1. **Routing Structure**: Uses Next.js App Router with route groups:

   - `(shop)/` - E-commerce routes (products, cart, checkout)
   - `(auth)/` - Protected routes (account, orders)
   - `(static)/` - Content pages (about, contact)

2. **Component Organization**: Atomic design pattern with clear separation:

   - `components/ui/` - Base UI components (buttons, forms)
   - `components/products/` - Product-specific components
   - `components/cart/` - Shopping cart components
   - `components/layout/` - Layout components (header, footer)

3. **State Management Strategy**:

   - Zustand for client-side state (cart, user preferences)
   - Apollo Client for server state (products, orders)
   - React Context for global app state (auth, i18n)

4. **Data Fetching Patterns**:
   - Static Generation (SSG) for product pages
   - Incremental Static Regeneration (ISR) for dynamic content
   - Client-side fetching for user-specific data

## GraphQL Integration

The project uses WPGraphQL for WordPress integration. Key queries and mutations
are organized in `lib/graphql/`:

- Product queries handle catalog browsing and product details
- Cart mutations manage shopping cart operations
- Order mutations process checkout and payment

## Performance Optimizations

- Image optimization with Next.js Image component
- Static page generation for products with ISR (revalidate: 3600)
- Apollo Client caching with custom merge strategies
- CDN integration for static assets
- Bundle splitting and lazy loading

## Testing Approach

- Unit tests with Jest for utilities and hooks
- Component testing with React Testing Library
- E2E tests with Playwright for critical user flows
- Visual regression testing with Storybook

## Deployment

The project is designed for Vercel deployment with environment variables for:

- WordPress GraphQL endpoint
- Payment gateway credentials (LiqPay, Privat24)
- Delivery service APIs (Nova Poshta)
- Analytics (GA4, Facebook Pixel)
