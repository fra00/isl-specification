export const ProductAvailabilityStatus: {
  IN_STOCK: 'IN_STOCK';
  OUT_OF_STOCK: 'OUT_OF_STOCK';
  LOW_STOCK: 'LOW_STOCK';
  DISCONTINUED: 'DISCONTINUED';
};

export const OrderStatus: {
  PENDING: 'PENDING';
  PROCESSING: 'PROCESSING';
  SHIPPED: 'SHIPPED';
  DELIVERED: 'DELIVERED';
  CANCELLED: 'CANCELLED';
  RETURNED: 'RETURNED';
};

export const PaymentStatus: {
  PENDING: 'PENDING';
  PAID: 'PAID';
  REFUNDED: 'REFUNDED';
  FAILED: 'FAILED';
};

export const CustomerStatus: {
  ACTIVE: 'ACTIVE';
  INACTIVE: 'INACTIVE';
  PENDING: 'PENDING';
};

export const UserRole: {
  ADMIN: 'ADMIN';
  EDITOR: 'EDITOR';
  VIEWER: 'VIEWER';
};

export const CustomerId: (value?: string) => string;

export const Address: (data?: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) => {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export const Product: (data?: {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  category?: string;
  stockQuantity?: number;
  imageUrl?: string;
  availabilityStatus?: typeof ProductAvailabilityStatus[keyof typeof ProductAvailabilityStatus];
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  availabilityStatus: typeof ProductAvailabilityStatus[keyof typeof ProductAvailabilityStatus];
  createdAt: Date;
  updatedAt: Date;
};

export const OrderItem: (data?: {
  productId?: string;
  productName?: string;
  quantity?: number;
  unitPrice?: number;
  subtotal?: number; // This will be calculated, but can be passed for initial data
}) => {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export const Order: (data?: {
  id?: string;
  customerId?: string;
  orderDate?: Date;
  status?: typeof OrderStatus[keyof typeof OrderStatus];
  totalAmount?: number;
  items?: Array<ReturnType<typeof OrderItem>>;
  shippingAddress?: string;
  billingAddress?: string;
  paymentStatus?: typeof PaymentStatus[keyof typeof PaymentStatus];
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  customerId: string;
  orderDate: Date;
  status: typeof OrderStatus[keyof typeof OrderStatus];
  totalAmount: number;
  items: Array<ReturnType<typeof OrderItem>>;
  shippingAddress: string;
  billingAddress: string;
  paymentStatus: typeof PaymentStatus[keyof typeof PaymentStatus];
  createdAt: Date;
  updatedAt: Date;
};

export const Customer: (data?: {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  shippingAddress?: ReturnType<typeof Address>;
  billingAddress?: ReturnType<typeof Address>;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: ReturnType<typeof Address>;
  billingAddress: ReturnType<typeof Address>;
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export const CustomerSummary: (data?: {
  id?: string;
  name?: string;
  email?: string;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus];
}) => {
  id: string;
  name: string;
  email: string;
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
};

export const CustomerProfile: (data?: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: ReturnType<typeof Address>;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders?: number;
  lastOrderDate?: Date | null;
}) => {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: ReturnType<typeof Address>;
  status: typeof CustomerStatus[keyof typeof CustomerStatus];
  totalOrders: number;
  lastOrderDate: Date | null;
};

export const CustomerFilter: (data?: {
  status?: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
  searchQuery?: string | null;
}) => {
  status: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
  searchQuery: string | null;
};

export const CustomerProfileUpdate: (data?: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  shippingAddress?: ReturnType<typeof Address> | null;
  billingAddress?: ReturnType<typeof Address> | null;
  status?: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
}) => {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  shippingAddress: ReturnType<typeof Address> | null;
  billingAddress: ReturnType<typeof Address> | null;
  status: typeof CustomerStatus[keyof typeof CustomerStatus] | null;
};

export const User: (data?: {
  id?: string;
  username?: string;
  email?: string;
  role?: typeof UserRole[keyof typeof UserRole];
  lastLogin?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}) => {
  id: string;
  username: string;
  email: string;
  role: typeof UserRole[keyof typeof UserRole];
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
};