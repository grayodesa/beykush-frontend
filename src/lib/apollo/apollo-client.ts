import { HttpLink } from '@apollo/client';
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';

// Set GraphQL endpoint - using environment variable for flexibility
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_ENDPOINT || 'http://beykush.local/graphql';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      // This needs to be an absolute url, as relative urls cannot be used in SSR
      uri: GRAPHQL_ENDPOINT,
      fetchOptions: {
        // Next.js-related fetch options regarding caching and revalidation
        // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
        cache: 'no-store', // Disable caching for now, can be changed later
      },
    }),
  });
});
