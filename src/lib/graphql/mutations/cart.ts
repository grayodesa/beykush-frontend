import { gql } from '@apollo/client';
import { CART_FIELDS } from '../fragments/cart';

export const ADD_TO_CART = gql`
  ${CART_FIELDS}
  
  mutation AddToCart($productId: Int!, $quantity: Int = 1, $variationId: Int) {
    addToCart(input: { productId: $productId, quantity: $quantity, variationId: $variationId }) {
      cart {
        ...CartFields
      }
      cartItem {
        key
        product {
          node {
            id
            name
          }
        }
        quantity
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  ${CART_FIELDS}
  
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      cart {
        ...CartFields
      }
      items {
        key
        quantity
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  ${CART_FIELDS}
  
  mutation RemoveFromCart($keys: [ID!]!) {
    removeItemsFromCart(input: { keys: $keys }) {
      cart {
        ...CartFields
      }
      cartItems {
        key
        product {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export const EMPTY_CART = gql`
  ${CART_FIELDS}
  
  mutation EmptyCart {
    emptyCart(input: {}) {
      cart {
        ...CartFields
      }
      deletedCart {
        contents {
          itemCount
        }
      }
    }
  }
`;

export const APPLY_COUPON = gql`
  ${CART_FIELDS}
  
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      cart {
        ...CartFields
      }
      applied {
        code
        discountAmount
      }
    }
  }
`;

export const REMOVE_COUPON = gql`
  ${CART_FIELDS}
  
  mutation RemoveCoupon($code: String!) {
    removeCoupons(input: { codes: [$code] }) {
      cart {
        ...CartFields
      }
      removed {
        code
        discountAmount
      }
    }
  }
`;

export const UPDATE_SHIPPING_METHOD = gql`
  ${CART_FIELDS}
  
  mutation UpdateShippingMethod($shippingMethods: [String!]!) {
    updateShippingMethod(input: { shippingMethods: $shippingMethods }) {
      cart {
        ...CartFields
      }
    }
  }
`;

export const GET_CART = gql`
  ${CART_FIELDS}
  
  query GetCart {
    cart {
      ...CartFields
    }
  }
`;