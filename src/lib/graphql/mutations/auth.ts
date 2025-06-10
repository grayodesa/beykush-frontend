import { gql } from '@apollo/client';
import { CUSTOMER_FIELDS } from '../fragments/cart';

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        name
        email
        firstName
        lastName
      }
      customer {
        id
        databaseId
        email
        firstName
        lastName
      }
    }
  }
`;

export const REGISTER_CUSTOMER = gql`
  ${CUSTOMER_FIELDS}

  mutation RegisterCustomer($input: RegisterCustomerInput!) {
    registerCustomer(input: $input) {
      customer {
        ...CustomerFields
      }
      authToken
      refreshToken
    }
  }
`;

export const REFRESH_AUTH_TOKEN = gql`
  mutation RefreshAuthToken($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($key: String!, $password: String!, $login: String!) {
    resetUserPassword(input: { key: $key, password: $password, login: $login }) {
      user {
        id
        email
      }
    }
  }
`;

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      success
    }
  }
`;

export const GET_VIEWER = gql`
  ${CUSTOMER_FIELDS}

  query GetViewer {
    viewer {
      id
      databaseId
      name
      email
      firstName
      lastName
    }
    customer {
      ...CustomerFields
    }
  }
`;
