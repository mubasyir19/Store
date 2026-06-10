import { create } from 'zustand';
import type { AddToCartPayload, CartItem } from '../types/cartItem';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: AddToCartPayload) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  // clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist((set, get) => ({
    items: [],
    isLoading: false,
    setItems: (items: CartItem[]) => set({ items }),
    addItem: (newItem: AddToCartPayload) => {
      const { items } = get();
      const existingIndex = items.findIndex((item: CartItem) => item.productId === newItem.productId);

      if (existingIndex > -1) {
        // Update existing item
        const updatedItems = [...items];
        updatedItems[existingIndex].quantity += newItem.quantity;
        set({ items: updatedItems });
      } else {
        const tempItem = {
          id: `temp-${Date.now()}`,
          productId: newItem.productId,
          quantity: newItem.quantity,
          product: {
            name: 'Loading...',
            price: 0,
            images: [],
            stock: 0,
            slug: '',
          },
        } as CartItem;
        set({ items: [...items, tempItem] });
      }
    },
    updateQuantity: (itemId: string, quantity: number) => {
      set({
        items: get().items.map((item: CartItem) => (item.id === itemId ? { ...item, quantity } : item)),
      });
    },

    removeItem: (itemId: string) => {
      set({ items: get().items.filter((item: CartItem) => item.id !== itemId) });
    },

    // clearCart: () => set({ items: [] }),

    getTotalItems: () => {
      return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    },

    getSubtotal: () => {
      return get().items.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0);
    },
  })),
);
