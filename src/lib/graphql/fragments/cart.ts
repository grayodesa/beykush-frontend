import { gql } from '@apollo/client';

export const CART_FIELDS = gql`
  fragment CartFields on Cart {
    contents {
      itemCount
      productCount
      nodes {
        key
        product {
          node {
            id
            databaseId
            name
            slug
            type
            image {
              id
              sourceUrl
              altText
            }
            ... on SimpleProduct {
              price
              regularPrice
              salePrice
            }
            ... on VariableProduct {
              price
              regularPrice
              salePrice
            }
          }
        }
        variation {
          node {
            id
            databaseId
            name
            price
            regularPrice
            salePrice
            attributes {
              nodes {
                id
                name
                value
              }
            }
            image {
              id
              sourceUrl
              altText
            }
          }
        }
        quantity
        total
        subtotal
        tax
      }
    }
    appliedCoupons {
      code
      discountAmount
    }
    subtotal
    total
    totalTax
    shippingTotal
    shippingTax
    discountTotal
    availableShippingMethods {
      packageDetails
      rates {
        id
        label
        cost
        methodId
      }
    }
    chosenShippingMethods
    needsShippingAddress
  }
`;

export const CUSTOMER_FIELDS = gql`
  fragment CustomerFields on Customer {
    id
    databaseId
    email
    firstName
    lastName
    displayName
    billing {
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postcode
      country
      email
      phone
    }
    shipping {
      firstName
      lastName
      company
      address1
      address2
      city
      state
      postcode
      country
    }
  }
`;