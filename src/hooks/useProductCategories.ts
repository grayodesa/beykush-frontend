import { useQuery } from '@apollo/client';
import { GET_PRODUCT_CATEGORIES } from '@/lib/graphql/queries/products';
import { filterUniqueCategories } from '@/lib/graphql/utils/categories';
import { ProductCategory } from '@/lib/graphql/types';

export interface UseProductCategoriesResult {
  categories: ProductCategory[];
  loading: boolean;
  error: Error | undefined;
  refetch: () => Promise<any>;
}

export function useProductCategories(): UseProductCategoriesResult {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT_CATEGORIES, {
    variables: { first: 100 },
    errorPolicy: 'all',
  });

  // Filter out duplicate categories from multilingual setup
  const categories = data?.productCategories?.nodes 
    ? filterUniqueCategories(data.productCategories.nodes)
    : [];

  return {
    categories,
    loading,
    error,
    refetch,
  };
}