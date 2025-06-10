import { getClient } from '@/lib/apollo';
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql/queries/products';
import { ProductCard } from '@/components/products';
import { Breadcrumb } from '@/components/layout';
import { Button, Badge } from '@/components/ui';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const client = getClient();
  const { slug } = await params;

  let product = null;
  try {
    const { data } = await client.query({
      query: GET_PRODUCT_BY_SLUG,
      variables: { slug },
    });
    product = data?.product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'Головна', href: '/' },
    { label: 'Вина', href: '/products' },
    { label: product.name, href: `/products/${product.slug}` },
  ];

  // Extract product details
  const isVariable = product.__typename === 'VariableProduct';
  const price = product.price || '₴0';
  const regularPrice = product.regularPrice;
  const onSale = product.onSale;
  const images = product.galleryImages?.nodes || [];
  const mainImage = product.image?.sourceUrl || '/placeholder-wine.svg';
  const relatedProducts = product.relatedProducts?.nodes || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={mainImage}
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {onSale && (
                <Badge variant="error" className="absolute top-4 left-4">
                  Акція
                </Badge>
              )}
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square relative bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <Image
                      src={img.sourceUrl}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.shortDescription && (
                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }}
                />
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-purple-600">{price}</span>
              {onSale && regularPrice && (
                <span className="text-xl text-gray-400 line-through">{regularPrice}</span>
              )}
            </div>

            {/* Product attributes */}
            {product.attributes?.nodes && product.attributes.nodes.length > 0 && (
              <div className="space-y-3 border-t border-b py-6">
                {product.attributes.nodes.map((attr) => (
                  <div key={attr.id} className="flex justify-between">
                    <span className="text-gray-600">{attr.name}:</span>
                    <span className="font-medium">{attr.options?.join(', ')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Variations for variable products */}
            {isVariable && product.variations?.nodes && (
              <div className="space-y-4">
                <h3 className="font-semibold">Оберіть варіант:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variations.nodes.map((variation) => (
                    <button
                      key={variation.id}
                      className="p-3 border border-gray-300 rounded-md hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <div className="text-sm">{variation.name}</div>
                      <div className="font-semibold">{variation.price}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <div className="flex gap-4">
              <Button size="lg" variant="primary" className="flex-1">
                Додати в кошик
              </Button>
              <Button size="lg" variant="secondary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Button>
            </div>

            {/* SKU and Categories */}
            <div className="space-y-2 text-sm text-gray-600">
              {product.sku && (
                <div>
                  <span className="font-medium">Артикул:</span> {product.sku}
                </div>
              )}
              {product.productCategories?.nodes && (
                <div>
                  <span className="font-medium">Категорії:</span>{' '}
                  {product.productCategories.nodes.map((cat) => cat.name).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-12 prose prose-lg max-w-none">
            <h2 className="text-2xl font-serif font-bold mb-4">Опис</h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-8">Схожі вина</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
