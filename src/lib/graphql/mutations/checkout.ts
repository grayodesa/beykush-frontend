import { gql } from '@apollo/client';
import { CUSTOMER_FIELDS } from '../fragments/cart';

export const ORDER_FIELDS = gql`
  fragment OrderFields on Order {
    id
    databaseId
    orderNumber
    status
    date
    total
    subtotal
    totalTax
    shippingTotal
    discountTotal
    paymentMethod
    paymentMethodTitle
    customerNote
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
    lineItems {
      nodes {
        product {
          node {
            id
            name
            slug
            image {
              id
              sourceUrl
              altText
            }
          }
        }
        variation {
          node {
            id
            name
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
        quantity
        total
        subtotal
      }
    }
    appliedCoupons {
      code
      discountAmount
    }
    shippingLines {
      methodTitle
      total
    }
  }
`;

export const CHECKOUT = gql`
  ${ORDER_FIELDS}

  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        ...OrderFields
      }
      result
      redirect
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  ${CUSTOMER_FIELDS}

  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        ...CustomerFields
      }
    }
  }
`;

export const CREATE_ORDER = gql`
  ${ORDER_FIELDS}

  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        ...OrderFields
      }
    }
  }
`;

export const GET_ORDER = gql`
  ${ORDER_FIELDS}

  query GetOrder($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
`;

export const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders($customerId: Int!, $first: Int = 10, $after: String) {
    customer(id: $customerId) {
      orders(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          databaseId
          orderNumber
          status
          date
          total
          lineItems {
            nodes {
              product {
                node {
                  name
                }
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

// Payment specific mutations for Ukrainian payment gateways
export const PROCESS_LIQPAY_PAYMENT = gql`
  mutation ProcessLiqPayPayment($orderId: ID!, $data: String!, $signature: String!) {
    processLiqPayPayment(input: { orderId: $orderId, data: $data, signature: $signature }) {
      success
      message
      order {
        id
        status
      }
    }
  }
`;

export const PROCESS_PRIVAT24_PAYMENT = gql`
  mutation ProcessPrivat24Payment($orderId: ID!, $paymentId: String!, $status: String!) {
    processPrivat24Payment(input: { orderId: $orderId, paymentId: $paymentId, status: $status }) {
      success
      message
      order {
        id
        status
      }
    }
  }
`;
