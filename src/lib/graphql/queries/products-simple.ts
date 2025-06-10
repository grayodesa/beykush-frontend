import { gql } from '@apollo/client';

export const GET_PRODUCT_BY_SLUG_SIMPLE = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      __typename
      ... on SimpleProduct {
        id
        databaseId
        name
        slug
        type
        status
        sku
        description
        shortDescription
        featured
        averageRating
        reviewCount
        image {
          id
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            id
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        price
        regularPrice
        salePrice
        onSale
        stockQuantity
        stockStatus
        manageStock
        soldIndividually
      }
      ... on VariableProduct {
        id
        databaseId
        name
        slug
        type
        status
        sku
        description
        shortDescription
        featured
        averageRating
        reviewCount
        image {
          id
          sourceUrl
          altText
        }
        galleryImages {
          nodes {
            id
            sourceUrl
            altText
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
        price
        regularPrice
        salePrice
        onSale
        stockQuantity
        stockStatus
        manageStock
        soldIndividually
      }
    }
  }
`;