# Apollo Client Setup

This directory contains the Apollo Client configuration for the Beykush
frontend.

## Files

- `apollo-client.ts` - Server-side Apollo Client configuration for React Server
  Components
- `apollo-wrapper.tsx` - Client-side Apollo Provider wrapper for Client
  Components
- `index.ts` - Barrel exports

## Usage

### In Server Components

```tsx
import { query } from '@/lib/apollo';
import { GET_PRODUCTS } from '@/lib/graphql/queries/products';

const { data } = await query({ query: GET_PRODUCTS });
```

### In Client Components

```tsx
'use client';

import { useSuspenseQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/lib/graphql/queries/products';

export function ProductList() {
  const { data } = useSuspenseQuery(GET_PRODUCTS);
  return <div>{/* render products */}</div>;
}
```

## Configuration

The GraphQL endpoint is configured via environment variable:

```env
NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT=http://beykush.local/graphql
```
