export function fetchCustomers(page: number, pageSize: number, filters?: {
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | null;
  searchQuery?: string | null;
}): {
  customers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
    billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
    status: "ACTIVE" | "INACTIVE" | "PENDING";
    totalOrders: number;
    totalSpent: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  totalCount: number;
};

export function fetchCustomerProfile(customerId: string): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export function updateCustomerProfile(customerId: string, updates: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  shippingAddress?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string; } | null;
  billingAddress?: { street?: string; city?: string; state?: string; zipCode?: string; country?: string; } | null;
  status?: "ACTIVE" | "INACTIVE" | "PENDING" | null;
}): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};

export function deactivateCustomer(customerId: string): {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  billingAddress: { street: string; city: string; state: string; zipCode: string; country: string; };
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
};