// lib/graphql/operations/woocommerce.ts
import { gql } from '@apollo/client';

// ===== FRAGMENTS =====
// Фрагменты для переиспользования в запросах

export const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id
    databaseId
    name
    slug
    type
    description
    shortDescription
    sku
    dateCreated
    dateModified
    featured
    catalogVisibility
    averageRating
    reviewCount
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      dateOnSaleFrom
      dateOnSaleTo
      stockStatus
      stockQuantity
      manageStock
      soldIndividually
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
    }
  }
`;

export const PRODUCT_IMAGE_FIELDS = gql`
  fragment ProductImageFields on Product {
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
  }
`;

export const PRODUCT_CATEGORY_FIELDS = gql`
  fragment ProductCategoryFields on ProductCategory {
    id
    databaseId
    name
    slug
    description
    count
    image {
      sourceUrl
      altText
    }
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
    currency
    paymentMethod
    paymentMethodTitle
    customerNote
    billing {
      firstName
      lastName
      email
      phone
      address1
      city
      postcode
      country
    }
    shipping {
      firstName
      lastName
      address1
      city
      postcode
      country
    }
  }
`;

// ===== QUERIES =====
// Запросы для получения данных

// Получение всех продуктов с пагинацией
export const GET_PRODUCTS = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_IMAGE_FIELDS}
  query GetProducts(
    $first: Int = 12
    $after: String
    $where: RootQueryToProductConnectionWhereArgs
  ) {
    products(first: $first, after: $after, where: $where) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        ...ProductFields
        ...ProductImageFields
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
            visible
          }
        }
        # Специфичные для вина атрибуты
        metaData {
          key
          value
        }
      }
    }
  }
`;

// Получение одного продукта по slug
export const GET_PRODUCT = gql`
  ${PRODUCT_FIELDS}
  ${PRODUCT_IMAGE_FIELDS}
  query GetProduct($id: ID!, $idType: ProductIdTypeEnum = SLUG) {
    product(id: $id, idType: $idType) {
      ...ProductFields
      ...ProductImageFields
      productCategories {
        nodes {
          id
          name
          slug
          parent {
            node {
              id
              name
              slug
            }
          }
        }
      }
      attributes {
        nodes {
          id
          name
          options
          variation
          visible
        }
      }
      related(first: 4) {
        nodes {
          ...ProductFields
          ...ProductImageFields
        }
      }
      reviews(first: 10) {
        averageRating
        nodes {
          id
          content
          author {
            node {
              name
            }
          }
          date
          rating
        }
      }
      # Для вариативных продуктов
      ... on VariableProduct {
        variations(first: 100) {
          nodes {
            id
            databaseId
            name
            price
            regularPrice
            salePrice
            stockStatus
            stockQuantity
            attributes {
              nodes {
                name
                value
              }
            }
            image {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  }
`;

// Получение категорий продуктов
export const GET_PRODUCT_CATEGORIES = gql`
  ${PRODUCT_CATEGORY_FIELDS}
  query GetProductCategories($first: Int = 100) {
    productCategories(first: $first, where: { hideEmpty: true }) {
      nodes {
        ...ProductCategoryFields
        children {
          nodes {
            ...ProductCategoryFields
          }
        }
      }
    }
  }
`;

// Получение корзины текущего пользователя
export const GET_CART = gql`
  query GetCart {
    cart {
      contents {
        nodes {
          key
          quantity
          total
          subtotal
          product {
            node {
              id
              databaseId
              name
              slug
              image {
                sourceUrl
                altText
              }
              ... on SimpleProduct {
                price
                stockStatus
              }
            }
          }
          variation {
            node {
              id
              databaseId
              name
              price
              stockStatus
              attributes {
                nodes {
                  name
                  value
                }
              }
            }
          }
        }
      }
      total
      subtotal
      totalTax
      shippingTotal
      discountTotal
      availableShippingMethods {
        packageDetails
        rates {
          id
          label
          cost
        }
      }
      appliedCoupons {
        code
        discountAmount
      }
    }
  }
`;

// Получение заказов пользователя
export const GET_CUSTOMER_ORDERS = gql`
  ${ORDER_FIELDS}
  query GetCustomerOrders($customerId: Int!) {
    customer(customerId: $customerId) {
      orders(first: 10) {
        nodes {
          ...OrderFields
          lineItems {
            nodes {
              quantity
              total
              product {
                node {
                  id
                  name
                  slug
                  image {
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ===== MUTATIONS =====
// Мутации для изменения данных

// Добавление товара в корзину
export const ADD_TO_CART = gql`
  mutation AddToCart($productId: Int!, $quantity: Int = 1, $variationId: Int) {
    addToCart(
      input: {
        productId: $productId
        quantity: $quantity
        variationId: $variationId
      }
    ) {
      cartItem {
        key
        quantity
        total
        product {
          node {
            id
            name
          }
        }
      }
      cart {
        total
        subtotal
        contents {
          itemCount
        }
      }
    }
  }
`;

// Обновление количества товара в корзине
export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($key: ID!, $quantity: Int!) {
    updateItemQuantities(input: { items: [{ key: $key, quantity: $quantity }] }) {
      cart {
        total
        subtotal
        contents {
          nodes {
            key
            quantity
            total
          }
        }
      }
    }
  }
`;

// Удаление товара из корзины
export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($keys: [ID!]!) {
    removeItemsFromCart(input: { keys: $keys }) {
      cart {
        total
        subtotal
        contents {
          itemCount
        }
      }
    }
  }
`;

// Применение купона
export const APPLY_COUPON = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      cart {
        appliedCoupons {
          code
          discountAmount
        }
        total
        discountTotal
      }
    }
  }
`;

// Создание заказа
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    checkout(input: $input) {
      order {
        id
        databaseId
        orderNumber
        status
        total
      }
      customer {
        id
      }
      result
      redirect
    }
  }
`;

// Регистрация пользователя
export const REGISTER_CUSTOMER = gql`
  mutation RegisterCustomer($input: RegisterCustomerInput!) {
    registerCustomer(input: $input) {
      customer {
        id
        databaseId
        email
        firstName
        lastName
      }
      authToken
      refreshToken
    }
  }
`;

// Авторизация пользователя
export const LOGIN_CUSTOMER = gql`
  mutation LoginCustomer($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        email
        firstName
        lastName
        wooSessionToken
      }
    }
  }
`;

// Обновление данных клиента
export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        id
        email
        firstName
        lastName
        billing {
          firstName
          lastName
          phone
          email
          address1
          city
          postcode
          country
        }
        shipping {
          firstName
          lastName
          address1
          city
          postcode
          country
        }
      }
    }
  }
`;

// Сброс пароля
export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      success
    }
  }
`;

// Обновление пароля
export const RESET_PASSWORD = gql`
  mutation ResetPassword($key: String!, $login: String!, $password: String!) {
    resetUserPassword(
      input: { key: $key, login: $login, password: $password }
    ) {
      user {
        id
        email
      }
    }
  }
`;

// ===== SUBSCRIPTIONS =====
// Подписки для real-time обновлений (если поддерживается)

export const CART_UPDATED_SUBSCRIPTION = gql`
  subscription OnCartUpdated($customerId: Int!) {
    cartUpdated(customerId: $customerId) {
      cart {
        total
        subtotal
        contents {
          itemCount
        }
      }
    }
  }
`;

// ===== HELPER TYPES =====
// TypeScript типы для работы с данными

export interface ProductWhereArgs {
  status?: string;
  orderby?: {
    field: 'DATE' | 'TITLE' | 'PRICE' | 'RATING' | 'POPULARITY' | 'MENU_ORDER';
    order: 'ASC' | 'DESC';
  }[];
  categoryIn?: string[];
  tagIn?: string[];
  featured?: boolean;
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK';
  search?: string;
}

export interface CreateOrderInput {
  billing?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  shipToDifferentAddress?: boolean;
  paymentMethod?: string;
  isPaid?: boolean;
  transactionId?: string;
  customerNote?: string;
  lineItems?: Array<{
    productId?: number;
    variationId?: number;
    quantity?: number;
  }>;
  shippingLines?: Array<{
    methodId: string;
    methodTitle: string;
    total: string;
  }>;
  feeLines?: Array<{
    name: string;
    amount: string;
  }>;
  couponLines?: string[];
  metaData?: Array<{
    key: string;
    value: string;
  }>;
}

export interface RegisterCustomerInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  billing?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

export interface UpdateCustomerInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  billing?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
  shipping?: {
    firstName?: string;
    lastName?: string;
    address1?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };
}

// ===== EXAMPLE USAGE =====
/*
// В компоненте React:

import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS, ADD_TO_CART } from '@/lib/graphql/operations/woocommerce';

function ProductList() {
  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 12,
      where: {
        categoryIn: ['wine'],
        stockStatus: 'IN_STOCK',
        orderby: [{ field: 'DATE', order: 'DESC' }]
      }
    }
  });

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: ['GetCart'],
    onCompleted: (data) => {
      console.log('Added to cart:', data.addToCart.cartItem);
    }
  });

  const handleAddToCart = (productId: number) => {
    addToCart({
      variables: {
        productId,
        quantity: 1
      }
    });
  };

  // ... остальной код компонента
}
*/