import { api } from '../lib/axios';
import { useAuthStore } from '../stores/authStore';
import type { AddToCartPayload } from '../types/cartItem';

export const getDataCart = async () => {
  const res = await api.get('/cart', {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
  });
  return res.data;
};

export const addCart = async (payload: AddToCartPayload) => {
  const res = await api.post('/cart/add', payload, {
    // headers: {
    //   Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    // },
  });
  return res.data;
};

export const updateQuantityCart = async (itemId: string, quantity: number) => {
  console.log('update quantity = ', quantity);
  const res = await api.patch(
    `/cart/edit/${itemId}`,
    { quantity },
    {
      // headers: {
      //   Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      // },
    },
  );
  console.log('res update quantity serv = ', res.data);
  return res.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await api.delete(`/cart/remove/${itemId}`, {
    // headers: {
    //   Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    // },
  });
  return res.data;
};

export const getCartTotal = async (): Promise<{ total: number; totalItems: number }> => {
  const res = await api.get('/cart/total');
  return res.data;
};
