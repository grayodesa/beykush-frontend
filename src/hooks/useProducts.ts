import { useQuery } from '@apollo/client';
import { GET_PRODUCTS, GET_FEATURED_PRODUCTS, SEARCH_PRODUCTS } from '@/lib/graphql/queries/products';
import { Product, ProductsWhereArgs } from '@/lib/graphql/types';

export interface UseProductsOptions {
  first?: number;
  after?: string;
  where?: ProductsWhereArgs;
  featured?: boolean;
  search?: string;
}

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: Error | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string | null;
  startCursor: string | null;
  fetchMore: () => Promise<void>;
  refetch: () => Promise<any>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { 
    first = 12, 
    after = null, 
    where = {}, 
    featured = false, 
    search = '' 
  } = options;

  // Determine which query to use
  let query = GET_PRODUCTS;
  let variables: any = { first, after };

  if (search) {
    query = SEARCH_PRODUCTS;
    variables = { search, first };
  } else if (featured) {
    query = GET_FEATURED_PRODUCTS;
    variables = { first };
  }

  const { data, loading, error, fetchMore, refetch } = useQuery(query, {
    variables,
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo || {
    hasNextPage: false,
    hasPreviousPage: false,
    endCursor: null,
    startCursor: null,
  };

  const handleFetchMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.endCursor) return;

    try {
      await fetchMore({
        variables: {
          ...variables,
          after: pageInfo.endCursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          return {
            products: {
              ...fetchMoreResult.products,
              nodes: [
                ...previousResult.products.nodes,
                ...fetchMoreResult.products.nodes,
              ],
            },
          };
        },
      });
    } catch (err) {
      console.error('Error fetching more products:', err);
    }
  };

  return {
    products,
    loading,
    error,
    hasNextPage: pageInfo.hasNextPage,
    hasPreviousPage: pageInfo.hasPreviousPage,
    endCursor: pageInfo.endCursor,
    startCursor: pageInfo.startCursor,
    fetchMore: handleFetchMore,
    refetch,
  };
}