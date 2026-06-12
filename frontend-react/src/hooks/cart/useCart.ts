import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addCart, getDataCart, updateQuantityCart, removeCartItem } from '../../services/cart';
import { useCartStore } from '../../stores/cartStore';
import type { AddToCartPayload, CartItem } from '../../types/cartItem';

export const cartKeys = {
  all: ['cart'] as const,
  lists: () => [...cartKeys.all, 'listCart'] as const,
  detail: (id: string) => [...cartKeys.all, 'detail', id] as const,
  total: () => [...cartKeys.all, 'total'] as const,
};

// Fetch cart data
export const useFetchCart = () => {
  const { setItems } = useCartStore();

  return useQuery({
    queryKey: cartKeys.lists(),
    queryFn: getDataCart,
    onSuccess: (data) => {
      setItems(data);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Add to cart
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { addItem } = useCartStore();

  return useMutation({
    mutationFn: addCart,
    onMutate: async (newItem: AddToCartPayload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData(cartKeys.lists());

      // Optimistic update to store
      addItem(newItem);

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.total() });
    },
    onError: (error: any, variables, context) => {
      console.log('error add cart - ', error);
      console.error('Failed add to cart: ', error.response?.data?.message || error.message);
      // Rollback optimistic update jika perlu
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.lists(), context.previousCart);
      }
    },
  });
};

// Update quantity
export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  const { updateQuantity } = useCartStore();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => updateQuantityCart(itemId, quantity),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });

      const previousCart = queryClient.getQueryData(cartKeys.lists());

      // Optimistic update ke store
      updateQuantity(itemId, quantity);

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      // queryClient.invalidateQueries({ queryKey: cartKeys.total() });
    },
    onError: (error: any, variables, context) => {
      console.error('Failed update quantity: ', error.response?.data?.message || error.message);
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.lists(), context.previousCart);
      }
    },
  });
};

// Remove item from cart
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  const { removeItem } = useCartStore();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists() });

      const previousCart = queryClient.getQueryData(cartKeys.lists());

      // Optimistic update ke store
      removeItem(itemId);

      return { previousCart };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cartKeys.total() });
    },
    onError: (error: any, variables, context) => {
      console.error('Failed remove item: ', error.response?.data?.message || error.message);
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.lists(), context.previousCart);
      }
    },
  });
};

// Clear all cart
// export const useClearCart = () => {
//   const queryClient = useQueryClient();
//   const { clearCart: clearStoreCart } = useCartStore();

//   return useMutation({
//     mutationFn: clearCart,
//     onMutate: async () => {
//       await queryClient.cancelQueries({ queryKey: cartKeys.lists() });

//       const previousCart = queryClient.getQueryData(cartKeys.lists());

//       // Optimistic clear store
//       clearStoreCart();

//       return { previousCart };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
//       queryClient.invalidateQueries({ queryKey: cartKeys.total() });
//     },
//     onError: (error: any, variables, context) => {
//       console.error('Failed clear cart: ', error.response?.data?.message || error.message);
//       if (context?.previousCart) {
//         queryClient.setQueryData(cartKeys.lists(), context.previousCart);
//       }
//     },
//   });
// };

// Get cart total
export const useCartTotal = () => {
  return useQuery({
    queryKey: cartKeys.total(),
    queryFn: async () => {
      const cart = await getDataCart();
      const total = cart.reduce((sum: number, item: any) => sum + item.product.price * item.quantity, 0);
      const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      return { total, totalItems };
    },
    enabled: false, // Tidak auto fetch, panggil manual saat perlu
  });
};
