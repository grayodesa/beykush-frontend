import { gql } from '@apollo/client';
import { 
  PRODUCT_FIELDS, 
  SIMPLE_PRODUCT_FIELDS, 
  VARIABLE_PRODUCT_FIELDS,
  PRODUCT_VARIATION_FIELDS 
} from '../fragments/product';

export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  ${SIMPLE_PRODUCT_FIELDS}
  ${VARIABLE_PRODUCT_FIELDS}
  
  query GetProducts(
    $first: Int = 12
    $after: String
    $where: RootQueryToProductConnectionWhereArgs
    $orderby: [ProductsOrderbyInput]
  ) {
    products(first: $first, after: $after, where: $where, orderby: $orderby) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...ProductFields
        ... on SimpleProduct {
          ...SimpleProductFields
        }
        ... on VariableProduct {
          ...VariableProductFields
          variations(first: 100) {
            nodes {
              ...ProductVariationFields
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  ${PRODUCT_FIELDS}
  ${SIMPLE_PRODUCT_FIELDS}
  ${VARIABLE_PRODUCT_FIELDS}
  ${PRODUCT_VARIATION_FIELDS}
  
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      ...ProductFields
      ... on SimpleProduct {
        ...SimpleProductFields
        relatedProducts(first: 4) {
          nodes {
            ...ProductFields
            ... on SimpleProduct {
              price
              onSale
            }
            ... on VariableProduct {
              price
              onSale
            }
          }
        }
      }
      ... on VariableProduct {
        ...VariableProductFields
        variations(first: 100) {
          nodes {
            ...ProductVariationFields
          }
        }
        defaultAttributes {
          nodes {
            id
            name
            value
          }
        }
        relatedProducts(first: 4) {
          nodes {
            ...ProductFields
            ... on SimpleProduct {
              price
              onSale
            }
            ... on VariableProduct {
              price
              onSale
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
  ${PRODUCT_FIELDS}
  ${SIMPLE_PRODUCT_FIELDS}
  ${VARIABLE_PRODUCT_FIELDS}
  
  query GetFeaturedProducts($first: Int = 8) {
    products(first: $first, where: { featured: true, status: "publish" }) {
      nodes {
        ...ProductFields
        ... on SimpleProduct {
          ...SimpleProductFields
        }
        ... on VariableProduct {
          ...VariableProductFields
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  ${SIMPLE_PRODUCT_FIELDS}
  ${VARIABLE_PRODUCT_FIELDS}
  
  query SearchProducts($search: String!, $first: Int = 12) {
    products(first: $first, where: { search: $search, status: "publish" }) {
      nodes {
        ...ProductFields
        ... on SimpleProduct {
          ...SimpleProductFields
        }
        ... on VariableProduct {
          ...VariableProductFields
        }
      }
    }
  }
`;