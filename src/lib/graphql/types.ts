export type Maybe<T> = T | null;

export enum ProductType {
  SIMPLE = 'SIMPLE',
  VARIABLE = 'VARIABLE',
  GROUPED = 'GROUPED',
  EXTERNAL = 'EXTERNAL',
}

export enum StockStatus {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ON_BACKORDER = 'ON_BACKORDER',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export interface ProductImage {
  id: string;
  sourceUrl: string;
  altText?: Maybe<string>;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  count?: Maybe<number>;
  description?: Maybe<string>;
  image?: Maybe<ProductImage>;
  children?: Maybe<ProductCategory[]>;
}

export interface ProductAttribute {
  id: string;
  name: string;
  options?: Maybe<string[]>;
  variation?: Maybe<boolean>;
  value?: Maybe<string>;
}

export interface ProductVariation {
  id: string;
  databaseId: number;
  name: string;
  price: string;
  regularPrice?: Maybe<string>;
  salePrice?: Maybe<string>;
  onSale: boolean;
  stockStatus?: Maybe<StockStatus>;
  stockQuantity?: Maybe<number>;
  manageStock?: Maybe<boolean>;
  attributes: ProductAttribute[];
  image?: Maybe<ProductImage>;
}

export interface Product {
  id: string;
  databaseId: number;
  name: string;
  slug: string;
  type: ProductType;
  status: string;
  sku?: Maybe<string>;
  description?: Maybe<string>;
  shortDescription?: Maybe<string>;
  featured: boolean;
  averageRating?: Maybe<number>;
  reviewCount?: Maybe<number>;
  image?: Maybe<ProductImage>;
  galleryImages?: Maybe<{ nodes: ProductImage[] }>;
  productCategories?: Maybe<{ nodes: ProductCategory[] }>;
  attributes?: Maybe<ProductAttribute[]>;
  // Price fields (only for SimpleProduct and VariableProduct)
  price?: Maybe<string>;
  regularPrice?: Maybe<string>;
  salePrice?: Maybe<string>;
  onSale?: Maybe<boolean>;
  // Stock fields (only for SimpleProduct and VariableProduct)
  stockStatus?: Maybe<StockStatus>;
  stockQuantity?: Maybe<number>;
  manageStock?: Maybe<boolean>;
  soldIndividually?: Maybe<boolean>;
  // Variable product specific
  variations?: Maybe<ProductVariation[]>;
  defaultAttributes?: Maybe<ProductAttribute[]>;
  // Related products
  relatedProducts?: Maybe<Product[]>;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: Maybe<string>;
  endCursor?: Maybe<string>;
}

export interface ProductConnection {
  pageInfo: PageInfo;
  nodes: Product[];
}

export interface CartItem {
  key: string;
  product: Product;
  variation?: Maybe<ProductVariation>;
  quantity: number;
  total: string;
  subtotal: string;
  tax?: Maybe<string>;
}

export interface AppliedCoupon {
  code: string;
  discountAmount: string;
}

export interface ShippingRate {
  id: string;
  label: string;
  cost: string;
  methodId: string;
}

export interface ShippingPackage {
  packageDetails?: Maybe<string>;
  rates: ShippingRate[];
}

export interface Cart {
  contents: {
    itemCount: number;
    productCount: number;
    nodes: CartItem[];
  };
  appliedCoupons?: Maybe<AppliedCoupon[]>;
  subtotal: string;
  total: string;
  totalTax: string;
  shippingTotal: string;
  shippingTax: string;
  discountTotal: string;
  availableShippingMethods?: Maybe<ShippingPackage[]>;
  chosenShippingMethods?: Maybe<string[]>;
  needsShippingAddress: boolean;
}

export interface Address {
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  company?: Maybe<string>;
  address1?: Maybe<string>;
  address2?: Maybe<string>;
  city?: Maybe<string>;
  state?: Maybe<string>;
  postcode?: Maybe<string>;
  country?: Maybe<string>;
  email?: Maybe<string>;
  phone?: Maybe<string>;
}

export interface Customer {
  id: string;
  databaseId: number;
  email: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  displayName?: Maybe<string>;
  billing?: Maybe<Address>;
  shipping?: Maybe<Address>;
}

export interface OrderLineItem {
  product: Product;
  variation?: Maybe<ProductVariation>;
  quantity: number;
  total: string;
  subtotal: string;
}

export interface Order {
  id: string;
  databaseId: number;
  orderNumber: string;
  status: OrderStatus;
  date: string;
  total: string;
  subtotal: string;
  totalTax: string;
  shippingTotal: string;
  discountTotal: string;
  paymentMethod?: Maybe<string>;
  paymentMethodTitle?: Maybe<string>;
  customerNote?: Maybe<string>;
  billing?: Maybe<Address>;
  shipping?: Maybe<Address>;
  lineItems: OrderLineItem[];
  appliedCoupons?: Maybe<AppliedCoupon[]>;
  shippingLines?: Maybe<
    Array<{
      methodTitle?: Maybe<string>;
      total: string;
    }>
  >;
}

// Query/Mutation Input Types
export interface ProductsWhereArgs {
  featured?: Maybe<boolean>;
  category?: Maybe<string>;
  categoryIn?: Maybe<string[]>;
  tag?: Maybe<string>;
  tagIn?: Maybe<string[]>;
  search?: Maybe<string>;
  sku?: Maybe<string>;
  status?: Maybe<string>;
  type?: Maybe<ProductType>;
  minPrice?: Maybe<number>;
  maxPrice?: Maybe<number>;
  stockStatus?: Maybe<StockStatus[]>;
  onSale?: Maybe<boolean>;
}

export interface ProductsOrderByInput {
  field: 'DATE' | 'TITLE' | 'PRICE' | 'RATING' | 'POPULARITY' | 'MENU_ORDER';
  order: 'ASC' | 'DESC';
}

export interface CheckoutInput {
  billing?: Maybe<Address>;
  shipping?: Maybe<Address>;
  shipToDifferentAddress?: Maybe<boolean>;
  paymentMethod: string;
  customerNote?: Maybe<string>;
  metaData?: Maybe<
    Array<{
      key: string;
      value: string;
    }>
  >;
}

export interface CreateOrderInput {
  billing?: Maybe<Address>;
  shipping?: Maybe<Address>;
  lineItems?: Maybe<
    Array<{
      productId?: Maybe<number>;
      variationId?: Maybe<number>;
      quantity: number;
    }>
  >;
  shippingLines?: Maybe<
    Array<{
      methodId: string;
      methodTitle: string;
      total: string;
    }>
  >;
  paymentMethod: string;
  paymentMethodTitle?: Maybe<string>;
  status?: Maybe<OrderStatus>;
  customerId?: Maybe<number>;
  customerNote?: Maybe<string>;
  coupons?: Maybe<string[]>;
}

export interface UpdateCustomerInput {
  id: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  email?: Maybe<string>;
  billing?: Maybe<Address>;
  shipping?: Maybe<Address>;
}
