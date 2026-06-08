export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: string[];
    stock: number;
    slug: string;
  };
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}
