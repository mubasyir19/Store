import type { Category } from './category';

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface AddProductPayload {
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images?: File[];
}

export interface UpdateProductPayload {
  categoryId?: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: File[];
}

export interface ProductTable {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  stock: number;
  images: File[];
  category: Category;
}
