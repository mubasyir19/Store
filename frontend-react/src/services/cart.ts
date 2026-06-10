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
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
  });
  return res.data;
};

export const updateQuantityCart = async (itemId: string, quantity: number) => {
  const res = await api.post(`/cart/edit/${itemId}`, quantity, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
  });
  return res.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await api.post(`/cart/remove/${itemId}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
  });
  return res.data;
};

export const getCartTotal = async (): Promise<{ total: number; totalItems: number }> => {
  const res = await api.get('/cart/total');
  return res.data;
};
