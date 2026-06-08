import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addNewCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
} from '../../services/category';
import type { CategoryPayload } from '../../types/category';

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'lists'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
  slug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: getAllCategory,
  });
};

export const useCategoryById = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id, // Query tidak akan berjalan jika id tidak ada
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
};

export const useAddCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Invalidate cache agar UI otomatis ter-update dengan data terbaru
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) => updateCategory(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate list dan detail spesifik yang di-update
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};
