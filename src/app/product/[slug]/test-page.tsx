import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo';
import { gql } from '@apollo/client';

const SIMPLE_PRODUCT_QUERY = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      slug
      __typename
    }
  }
`;

export default async function TestProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const client = getClient();

  try {
    const { data } = await client.query({
      query: SIMPLE_PRODUCT_QUERY,
      variables: { slug: resolvedParams.slug },
    });

    return (
      <div className="p-8">
        <h1>Test Product Page</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1>Error</h1>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}