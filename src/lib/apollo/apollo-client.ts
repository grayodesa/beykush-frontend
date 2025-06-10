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
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            products: {
              keyArgs: ['where', 'search'],
              merge(existing, incoming, { args }) {
                if (!args?.after) {
                  // This is the first page, replace everything
                  return incoming;
                }
                // This is a subsequent page, merge the results
                return {
                  ...incoming,
                  nodes: [...(existing?.nodes || []), ...incoming.nodes],
                };
              },
            },
          },
        },
      },
    }),
    link: new HttpLink({
      // This needs to be an absolute url, as relative urls cannot be used in SSR
      uri: GRAPHQL_ENDPOINT,
      fetchOptions: {
        // Next.js-related fetch options regarding caching and revalidation
        // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
        cache: 'no-store', // Disable caching for now, can be changed later
      },
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  });
});
