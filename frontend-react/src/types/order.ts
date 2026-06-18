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
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes?: string;

  shippingMethod: string; // 'regular' | 'express' | 'same_day'
  shippingCost: number; // Biaya pengiriman
  shippingEta?: string; // Estimasi waktu sampai
  shippingCourier?: string; // Kurir (jne, tiki, pos)
  shippingService?: string; // Layanan (reg, yes, oke)

  trackingNumber?: string;
  trackingUrl?: string;

  snapToken?: string;
  snapRedirectUrl?: string;
  paymentType?: string; // 'bank_transfer' | 'credit_card' | 'gopay'
  paymentStatus?: string; // 'pending' | 'settlement' | 'capture' | 'expire'
  transactionId?: string;
  vaNumber?: string;
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
