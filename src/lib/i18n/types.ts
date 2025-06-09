export type Language = 'uk' | 'en';

export type TranslationKeys = {
  // Common
  common: {
    search: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    viewAll: string;
    showMore: string;
    showLess: string;
    currency: string;
    items: string;
    item: string;
  };

  // Navigation
  navigation: {
    home: string;
    shop: string;
    wines: string;
    about: string;
    contact: string;
    cart: string;
    account: string;
    login: string;
    logout: string;
    register: string;
    myOrders: string;
    wishlist: string;
    checkout: string;
  };

  // Product related
  product: {
    addToCart: string;
    outOfStock: string;
    inStock: string;
    availability: string;
    sku: string;
    category: string;
    categories: string;
    tags: string;
    description: string;
    specifications: string;
    reviews: string;
    relatedProducts: string;
    price: string;
    salePrice: string;
    quantity: string;
    total: string;
    subtotal: string;
    shipping: string;
    tax: string;
    discount: string;
  };

  // Cart
  cart: {
    title: string;
    empty: string;
    continueShopping: string;
    updateCart: string;
    proceedToCheckout: string;
    remove: string;
    couponCode: string;
    applyCoupon: string;
    cartTotals: string;
  };

  // Checkout
  checkout: {
    title: string;
    billingDetails: string;
    shippingDetails: string;
    sameAsBilling: string;
    paymentMethod: string;
    orderSummary: string;
    placeOrder: string;
    orderNotes: string;
    createAccount: string;
  };

  // Forms
  form: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
    address: string;
    addressLine2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    ukraine: string;
    required: string;
    optional: string;
    invalidEmail: string;
    passwordMismatch: string;
    fieldRequired: string;
  };

  // Wine specific
  wine: {
    type: string;
    redWine: string;
    whiteWine: string;
    roseWine: string;
    sparklingWine: string;
    dessertWine: string;
    year: string;
    volume: string;
    alcohol: string;
    servingTemp: string;
    grapeVariety: string;
    winery: string;
    region: string;
    awards: string;
    tastingNotes: string;
    foodPairing: string;
  };

  // Footer
  footer: {
    subscribe: string;
    subscribeDescription: string;
    enterEmail: string;
    subscribed: string;
    customerService: string;
    information: string;
    followUs: string;
    paymentMethods: string;
    securePayment: string;
    privacyPolicy: string;
    termsConditions: string;
    returnPolicy: string;
  };

  // Account
  account: {
    myAccount: string;
    accountDetails: string;
    orderHistory: string;
    addresses: string;
    billingAddress: string;
    shippingAddress: string;
    editAddress: string;
    addNewAddress: string;
    defaultAddress: string;
    noOrdersYet: string;
  };

  // Messages
  messages: {
    addedToCart: string;
    removedFromCart: string;
    cartUpdated: string;
    orderPlaced: string;
    orderFailed: string;
    loginSuccess: string;
    loginFailed: string;
    logoutSuccess: string;
    registrationSuccess: string;
    registrationFailed: string;
    profileUpdated: string;
    passwordChanged: string;
    subscribeSuccess: string;
    subscribeFailed: string;
  };

  // Errors
  errors: {
    general: string;
    network: string;
    notFound: string;
    unauthorized: string;
    serverError: string;
    validationError: string;
  };
};

export type Translations = {
  [key in Language]: TranslationKeys;
};