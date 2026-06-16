import { api } from '../lib/axios';
import type { CheckoutData } from '../types/order';

export const checkoutOrder = async (data: CheckoutData) => {
  const res = await api.post('/order/checkout', data);
  return res.data;
};
