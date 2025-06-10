import { gql } from '@apollo/client';

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
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
    productTags {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

export const SIMPLE_PRODUCT_FIELDS = gql`
  fragment SimpleProductFields on SimpleProduct {
    price
    regularPrice
    salePrice
    onSale
    stockQuantity
    stockStatus
    manageStock
    soldIndividually
  }
`;

export const VARIABLE_PRODUCT_FIELDS = gql`
  fragment VariableProductFields on VariableProduct {
    price
    regularPrice
    salePrice
    onSale
    stockQuantity
    stockStatus
    manageStock
    soldIndividually
  }
`;

export const PRODUCT_VARIATION_FIELDS = gql`
  fragment ProductVariationFields on ProductVariation {
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
  }
`;
