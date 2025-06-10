import { getClient } from '@/lib/apollo';
import { GET_PRODUCTS, GET_PRODUCT_CATEGORIES } from '@/lib/graphql/queries/products';
import { ProductGrid, ProductFilters, ProductSeries } from '@/components/products';
import { Breadcrumb } from '@/components/layout';
import { filterUniqueCategories } from '@/lib/graphql/utils/categories';
import { transformProducts } from '@/lib/graphql/utils';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}) {
  const client = getClient();
  const params = await searchParams;
  const page = parseInt(params.page || '1', 10);
  const category = params.category;
  const sort = params.sort || 'date';

  // Fetch products
  let products = [];
  let pageInfo = {};
  let productsError = null;
  
  // Map sort param to GraphQL values
  const sortMap: Record<string, { orderBy: string; order: string }> = {
    'date': { orderBy: 'DATE', order: 'DESC' },
    'price': { orderBy: 'PRICE', order: 'ASC' },
    'price-desc': { orderBy: 'PRICE', order: 'DESC' },
    'name': { orderBy: 'TITLE', order: 'ASC' },
  };
  
  const sortConfig = sortMap[sort] || sortMap['date'];
  
  try {
    const { data } = await client.query({
      query: GET_PRODUCTS,
      variables: {
        first: 12,
        after: page > 1 ? btoa(`arrayconnection:${(page - 1) * 12}`) : null,
        categoryIn: category ? [category] : null,
        orderBy: sortConfig.orderBy,
        order: sortConfig.order,
      },
      errorPolicy: 'all',
    });
    const rawProducts = data?.products?.nodes || [];
    products = transformProducts(rawProducts);
    pageInfo = data?.products?.pageInfo || {};
  } catch (error: any) {
    console.error('Failed to fetch products:', error);
    productsError = error.message || 'Failed to fetch products';
  }

  // Fetch categories
  let categories = [];
  let categoriesError = null;
  try {
    const { data } = await client.query({
      query: GET_PRODUCT_CATEGORIES,
      variables: { first: 100 },
      errorPolicy: 'all',
    });
    const rawCategories = data?.productCategories?.nodes || [];
    categories = filterUniqueCategories(rawCategories);
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    categoriesError = error.message || 'Failed to fetch categories';
  }

  const breadcrumbs = [
    { label: 'Головна', href: '/' },
    { label: 'Вина', href: '/products' },
  ];

  if (category) {
    const categoryName = categories.find((cat) => cat.slug === category)?.name || category;
    breadcrumbs.push({ label: categoryName, href: `/products?category=${category}` });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="mt-8 mb-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Наші вина</h1>
          <p className="text-lg text-gray-600">
            Відкрийте для себе колекцію преміальних українських вин
          </p>
        </div>

        {/* Error display */}
        {(productsError || categoriesError) && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-bold text-red-700 mb-2">Debug Information:</h3>
            {productsError && (
              <div className="mb-2">
                <p className="text-sm font-semibold text-red-700">Products Error:</p>
                <p className="text-sm text-red-600">{productsError}</p>
              </div>
            )}
            {categoriesError && (
              <div>
                <p className="text-sm font-semibold text-red-700">Categories Error:</p>
                <p className="text-sm text-red-600">{categoriesError}</p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <ProductFilters 
            categories={categories} 
            currentCategory={category} 
            currentSort={sort} 
          />

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length > 0 ? (
              <>
                {/* Group products by category if no specific category is selected */}
                {!category ? (
                  <div>
                    {categories.map((cat) => {
                      const categoryProducts = products.filter(p => 
                        p.productCategories?.some(pc => pc.slug === cat.slug)
                      );
                      if (categoryProducts.length === 0) return null;
                      
                      return (
                        <ProductSeries
                          key={cat.id}
                          seriesName={cat.name}
                          products={categoryProducts}
                          viewAllLink={`/products?category=${cat.slug}`}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <ProductGrid products={products} />
                )}

                {/* Pagination */}
                {(pageInfo.hasNextPage || page > 1) && (
                  <div className="mt-12 flex justify-center gap-2">
                    {page > 1 && (
                      <a
                        href={`/products?page=${page - 1}${category ? `&category=${category}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Попередня
                      </a>
                    )}
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-md">{page}</span>
                    {pageInfo.hasNextPage && (
                      <a
                        href={`/products?page=${page + 1}${category ? `&category=${category}` : ''}${sort !== 'date' ? `&sort=${sort}` : ''}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Наступна
                      </a>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Вина не знайдено</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
