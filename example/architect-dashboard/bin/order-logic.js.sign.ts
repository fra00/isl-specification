export const OrderStatus: {
  PENDING: 'Pending';
  PROCESSING: 'Processing';
  SHIPPED: 'Shipped';
  DELIVERED: 'Delivered';
  CANCELLED: 'Cancelled';
  RETURNED: 'Returned';
};

export const OrderItem: (data: { productId: string; quantity: number; price: number; returnedQuantity?: number; }) => { productId: string; quantity: number; price: number; returnedQuantity: number; };

export const Order: (data: { id: string; customerId: string; status?: typeof OrderStatus[keyof typeof OrderStatus]; items?: Array<ReturnType<typeof OrderItem>>; totalAmount?: number; date?: string; }) => { id: string; customerId: string; status: typeof OrderStatus[keyof typeof OrderStatus]; items: Array<ReturnType<typeof OrderItem>>; totalAmount: number; date: string; };

export const ReturnConfirmation: (data: { orderId: string; returnedItems?: Array<{ productId: string; quantity: number; }>; refundAmount?: number; }) => { orderId: string; returnedItems: Array<{ productId: string; quantity: number; }>; refundAmount: number; };

export function fetchOrders(filters?: { status?: typeof OrderStatus[keyof typeof OrderStatus]; customerId?: string; dateRange?: { start: string; end: string; }; }, pagination?: { page?: number; pageSize?: number; }): Promise<{ orders: Array<ReturnType<typeof Order>>; totalCount: number; }>;

export function fetchOrderById(orderId: string): Promise<ReturnType<typeof Order> | null>;

export function updateOrderStatus(orderId: string, newStatus: typeof OrderStatus[keyof typeof OrderStatus]): Promise<ReturnType<typeof Order>>;

export function processOrderReturn(orderId: string, itemsToReturn: Array<{ productId: string; quantity: number; }>, returnReason: string): Promise<ReturnType<typeof ReturnConfirmation>>;