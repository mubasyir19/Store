import { api } from '../lib/axios';
import type { CheckoutData } from '../types/order';

export const checkoutOrder = async (data: CheckoutData) => {
  const res = await api.post('/order/checkout', data);
  return res.data;
};

export const getListOrder = async () => {
  const res = await api.get(`/order/all`);
  return res.data;
};

export const getOrderDetail = async (orderId: string) => {
  const res = await api.get(`/order/${orderId}`);
  return res.data;
};
