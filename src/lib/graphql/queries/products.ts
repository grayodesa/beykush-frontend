import { gql } from '@apollo/client';

// Example product query - will be refined once WPGraphQL schema is confirmed
export const GET_PRODUCTS = gql`
  query GetProducts($first: Int = 10) {
    products(first: $first) {
      nodes {
        id
        databaseId
        name
        slug
        ... on SimpleProduct {
          price
          regularPrice
          salePrice
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
    }
  }
`;
