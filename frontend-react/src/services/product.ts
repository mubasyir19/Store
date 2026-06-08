// services/product.ts
import { api } from '../lib/axios';
import { useAuthStore } from '../stores/authStore';
import type { AddProductPayload, UpdateProductPayload } from '../types/product';

export const getAllProducts = async () => {
  const res = await api.get('/product/all');
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await api.get(`/product/${id}`);
  return res.data;
};

export const getProductBySlug = async (slug: string) => {
  const res = await api.get(`/product/slug/${slug}`);
  return res.data;
};

// Create product with images
export const addNewProduct = async (payload: AddProductPayload) => {
  const formData = new FormData();
  formData.append('categoryId', payload.categoryId);
  formData.append('name', payload.name);
  formData.append('slug', payload.slug);
  formData.append('description', payload.description);
  formData.append('price', payload.price.toString());
  formData.append('stock', payload.stock.toString());

  // Append images
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  const res = await api.post('/product/add', formData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

// Update product with optional replaceImages flag
export const updateProduct = async (id: string, payload: UpdateProductPayload, replaceImages: boolean = false) => {
  const formData = new FormData();

  // Only append fields that are provided
  if (payload.categoryId !== undefined) formData.append('categoryId', payload.categoryId);
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.slug !== undefined) formData.append('slug', payload.slug);
  if (payload.description !== undefined) formData.append('description', payload.description);
  if (payload.price !== undefined) formData.append('price', payload.price.toString());
  if (payload.stock !== undefined) formData.append('stock', payload.stock.toString());

  // Append new images if any
  if (payload.images && payload.images.length > 0) {
    payload.images.forEach((image) => {
      formData.append('images', image);
    });
  }

  // Add query parameter for replaceImages
  const url = replaceImages ? `/product/edit/${id}?replaceImages=true` : `/product/edit/${id}`;

  const res = await api.put(url, formData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

// Add images to existing product (append)
export const addProductImages = async (id: string, images: File[]) => {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append('images', image);
  });

  const res = await api.post(`/product/${id}/images`, formData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

// Replace all images of a product
export const replaceProductImages = async (id: string, images: File[]) => {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append('images', image);
  });

  const res = await api.put(`/product/${id}/images`, formData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

// Delete product (with all its images)
export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
  });

  return res.data;
};

// Delete specific images from product
export const deleteProductImages = async (id: string, imageUrls: string[]) => {
  const res = await api.delete(`/product/${id}/images`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
    },
    data: { imageUrls },
  });

  return res.data;
};
