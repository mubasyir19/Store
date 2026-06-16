// types/order.ts
export interface CheckoutData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes?: string;
  email: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes?: string;
  trackingNumber?: string;
  snapToken?: string;
  snapRedirectUrl?: string;
}

export interface PaymentResponse {
  token: string;
  redirect_url: string;
  order_id: string;
}

export interface CheckoutResponse {
  message: string;
  order: Order;
  payment: PaymentResponse;
}

export type OrderStatus = 'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
