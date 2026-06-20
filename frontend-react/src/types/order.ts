import type { User } from './user';

// types/order.ts
export interface CheckoutData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes?: string;

  shippingMethod: string; // 'regular' | 'express' | 'same_day'
  paymentMethod: string; // 'bank_transfer' | 'credit_card' | 'gopay'

  email: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalPrice: string; // <-- Diubah ke string sesuai response json backend
  createdAt: string;
  updatedAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes: string | null;

  shippingMethod: string;
  shippingCost: string; // <-- Diubah ke string sesuai response json backend
  shippingEta: string | null;
  shippingCourier: string | null;
  shippingService: string | null;

  trackingNumber: string | null;
  trackingUrl: string | null;

  midtransOrderId: string;
  snapToken: string | null;
  snapRedirectUrl: string | null;
  paymentType: string | null;
  paymentStatus: string | null;
  fraudStatus: string | null;
  vaNumber: string | null;
  transactionId: string | null;
  transactionTime: string | null;
  settlementTime: string | null;
  paymentExpiry: string | null;
  paymentRawResponse: any | null;

  user: User;
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

export type ShippingMethod = 'regular' | 'express' | 'same_day';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'gopay' | 'qris';
