import { gql } from '@apollo/client';
import {
  PRODUCT_FIELDS,
  SIMPLE_PRODUCT_FIELDS,
  VARIABLE_PRODUCT_FIELDS,
  PRODUCT_VARIATION_FIELDS,
} from '../fragments/product';

export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int = 12
    $after: String
    $categoryIn: [String]
    $orderBy: ProductsOrderByEnum = DATE
    $order: OrderEnum = DESC
  ) {
    products(
      first: $first
      after: $after
      where: {
        typeIn: [SIMPLE, VARIABLE]
        categoryIn: $categoryIn
        stockStatus: IN_STOCK
        orderby: {
          field: $orderBy
          order: $order
        }
      }
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
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
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
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
        attributes {
          nodes {
            id
            name
            options
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
        relatedProducts(first: 4) {
          nodes {
            __typename
            ... on SimpleProduct {
              id
              name
              slug
              price
              onSale
              image {
                sourceUrl
                altText
              }
            }
            ... on VariableProduct {
              id
              name
              slug
              price
              onSale
              image {
                sourceUrl
                altText
              }
            }
          }
        }
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
        attributes {
          nodes {
            id
            name
            options
            variation
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
        variations(first: 100) {
          nodes {
            id
            databaseId
            name
            price
            regularPrice
            salePrice
            onSale
            stockQuantity
            stockStatus
            manageStock
            image {
              id
              sourceUrl
              altText
            }
            attributes {
              nodes {
                id
                name
                attributeId
                label
              }
            }
          }
        }
        relatedProducts(first: 4) {
          nodes {
            __typename
            ... on SimpleProduct {
              id
              name
              slug
              price
              onSale
              image {
                sourceUrl
                altText
              }
            }
            ... on VariableProduct {
              id
              name
              slug
              price
              onSale
              image {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($first: Int = 100) {
    productCategories(first: $first, where: { parent: null }) {
      nodes {
        id
        name
        slug
        description
        count
        image {
          id
          sourceUrl
          altText
        }
        children {
          nodes {
            id
            name
            slug
            count
          }
        }
      }
    }
  }
`;

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($first: Int = 8) {
    products(
      first: $first
      where: { 
        featured: true
        typeIn: [SIMPLE, VARIABLE]
        stockStatus: IN_STOCK
      }
    ) {
      nodes {
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
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($search: String!, $first: Int = 12) {
    products(
      first: $first
      where: { 
        search: $search
        typeIn: [SIMPLE, VARIABLE]
        stockStatus: IN_STOCK
      }
    ) {
      nodes {
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
  }
`;
