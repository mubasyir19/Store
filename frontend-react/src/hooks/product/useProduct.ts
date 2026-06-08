// hooks/product/useProduct.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addNewProduct,
  addProductImages,
  deleteProduct,
  deleteProductImages,
  getAllProducts,
  getProductById,
  getProductBySlug,
  replaceProductImages,
  updateProduct,
} from '../../services/product';
import type { AddProductPayload, UpdateProductPayload } from '../../types/product';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'lists'] as const,
  detail: (id: string) => [...productKeys.all, 'detail', id] as const,
  slug: (slug: string) => [...productKeys.all, 'slug', slug] as const,
};

// Query hooks
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getAllProducts,
  });
};

export const useProductById = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

// Mutation hooks
export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddProductPayload) => addNewProduct(payload),
    onSuccess: () => {
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: any) => {
      console.error('Failed to add product:', error);
      // You can add toast notification here
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
      replaceImages = false,
    }: {
      id: string;
      payload: UpdateProductPayload;
      replaceImages?: boolean;
    }) => updateProduct(id, payload, replaceImages),
    onSuccess: (_, variables) => {
      // Invalidate both list and specific product detail
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });

      // Also invalidate slug if name/slug changed
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
};

export const useAddProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, images }: { id: string; images: File[] }) => addProductImages(id, images),
    onSuccess: (_, variables) => {
      // Invalidate product detail to show new images
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useReplaceProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, images }: { id: string; images: File[] }) => replaceProductImages(id, images),
    onSuccess: (_, variables) => {
      // Invalidate product detail to show replaced images
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useDeleteProductImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageUrls }: { id: string; imageUrls: string[] }) => deleteProductImages(id, imageUrls),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (_, id) => {
      // Invalidate lists and remove detail from cache
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
    },
  });
};
