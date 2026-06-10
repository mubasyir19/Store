import { api } from '../lib/axios';
import type { CategoryPayload } from '../types/category';

export const getAllCategory = async () => {
  const res = await api.get('/category/all');
  return res.data;
};

export const getCategoryById = async (id: string) => {
  const res = await api.get(`/category/${id}`);
  return res.data;
};

export const getCategoryBySlug = async (slug: string) => {
  const res = await api.get(`/category/slug/${slug}`);
  return res.data;
};

export const addNewCategory = async (payload: CategoryPayload) => {
  const res = await api.post(`/category/add`, payload, {});
  return res.data;
};

export const updateCategory = async (id: string, payload: CategoryPayload) => {
  const res = await api.patch(`/category/edit/${id}`, payload);
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/category/delete/${id}`);
  return res.data;
};
