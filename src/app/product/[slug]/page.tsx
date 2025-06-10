import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo';
import { GET_PRODUCT_BY_SLUG } from '@/lib/graphql/queries/products';
import { GET_PRODUCT_BY_SLUG_SIMPLE } from '@/lib/graphql/queries/products-simple';
import { Product, ProductType } from '@/lib/graphql';
import ProductDetailClient from './client';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const client = getClient();

  try {
    const { data, error } = await client.query({
      query: GET_PRODUCT_BY_SLUG_SIMPLE,
      variables: { slug: resolvedParams.slug },
      errorPolicy: 'all',
    });

    if (!data?.product) {
      notFound();
    }

    const product = data.product as Product;

    return <ProductDetailClient product={product} />;
  } catch (error: any) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GET_PRODUCT_BY_SLUG,
      variables: { slug: resolvedParams.slug },
    });

    const product = data?.product as Product;
    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: `${product.name} | Beykush`,
      description: product.shortDescription || product.description?.substring(0, 160),
      openGraph: {
        title: product.name,
        description: product.shortDescription || product.description?.substring(0, 160),
        images: product.image ? [product.image.sourceUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found',
    };
  }
}