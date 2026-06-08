import { create } from 'zustand';
import type { CartItem } from '../types/cartItem';

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist((set, get) => ({
    items: [],
    isLoading: false,
    setItem: (items: CartItem[]) => set({ items }),
    addItem: (newItem: CartItem) => {
      const { items } = get();
      const existingIndex = items.findIndex((item: CartItem) => item.productId === newItem.productId);

      if (existingIndex > -1) {
        // Update existing item
        const updatedItems = [...items];
        updatedItems[existingIndex].quantity += newItem.quantity;
        set({ items: updatedItems });
      } else {
        set({ items: [...items, newItem] });
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

    clearCart: () => set({ items: [] }),

    getTotalItems: () => {
      return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    },

    getSubtotal: () => {
      return get().items.reduce((total: number, item: CartItem) => total + item.product.price * item.quantity, 0);
    },
  })),
);
