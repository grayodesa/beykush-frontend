import { getClient } from '@/lib/apollo';
import { GET_FEATURED_PRODUCTS } from '@/lib/graphql/queries/products';
import { transformProducts } from '@/lib/graphql/utils';
import { ProductGrid } from '@/components/products';
import { Product } from '@/lib/graphql';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default async function HomePage() {
  const client = getClient();

  let featuredProducts: Product[] = [];
  let error = null;
  try {
    const { data } = await client.query({
      query: GET_FEATURED_PRODUCTS,
      variables: { first: 8 },
      errorPolicy: 'all',
    });
    const rawProducts = data?.products?.nodes || [];
    featuredProducts = transformProducts(rawProducts);
  } catch (err) {
    console.error('Failed to fetch featured products:', err);
    error = err instanceof Error ? err.message : 'Failed to fetch products';
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-cream to-white bg-vineyard-pattern">
      <div className="container mx-auto px-4 py-16">
        {/* Error display for debugging */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="font-bold text-red-700 mb-2">Error loading products:</h3>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
          <h1 className="text-7xl font-serif font-bold text-gradient mb-4">Beykush</h1>
          <p className="text-2xl text-gray-700 font-light">
            Premium Ukrainian wines from the Black Sea shores
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 flex-wrap pt-8">
            <button className="btn btn-lg btn-primary">Explore Wines</button>
            <button className="btn btn-lg btn-burgundy">Wine Club</button>
            <button className="btn btn-lg btn-secondary">Our Story</button>
          </div>

          {/* Wine categories */}
          <div className="flex gap-3 justify-center flex-wrap pt-12">
            <Link href="/products?category=artaniya" className="badge badge-wine-red">Артанія</Link>
            <Link href="/products?category=beykush" className="badge badge-wine-white">Бейкуш</Link>
            <Link href="/products?category=fantasy" className="badge badge-wine-rose">Фантазія</Link>
            <Link href="/products?category=sets" className="badge badge-primary">Сети</Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div
              className="text-center space-y-3 animate-fade-in-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-16 h-16 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-rose-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif">Crafted with Excellence</h3>
              <p className="text-gray-600">
                Every bottle tells a story of dedication and tradition
              </p>
            </div>

            <div
              className="text-center space-y-3 animate-fade-in-up"
              style={{ animationDelay: '400ms' }}
            >
              <div className="w-16 h-16 mx-auto bg-burgundy-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-burgundy-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif">Ukrainian Heritage</h3>
              <p className="text-gray-600">Rooted in centuries of winemaking tradition</p>
            </div>

            <div
              className="text-center space-y-3 animate-fade-in-up"
              style={{ animationDelay: '600ms' }}
            >
              <div className="w-16 h-16 mx-auto bg-gold-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gold-600 wine-glass-tilt"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-serif">Premium Selection</h3>
              <p className="text-gray-600">Curated collection of exceptional wines</p>
            </div>
          </div>
        </div>

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Вибрані вина</h2>
              <p className="text-xl text-gray-600">Відкрийте для себе наші найкращі вина</p>
            </div>

            <ProductGrid products={featuredProducts} />

            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="primary">
                  Переглянути всі вина
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
