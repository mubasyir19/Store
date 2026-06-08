export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryPayload {
  name: string;
  slug: string;
}

export interface CategoryTable {
  id: string;
  name: string;
  slug: string;
  products: [];
  _count: {
    products: number;
  };
}
