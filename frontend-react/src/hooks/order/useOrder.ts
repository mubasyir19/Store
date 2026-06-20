import { useMutation, useQuery, type UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import { checkoutOrder, getAllOrder, getListOrderUser, getOrderDetail } from '../../services/order';
import type { CheckoutData, CheckoutResponse } from '../../types/order';

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: any) => void;
          onPending: (result: any) => void;
          onError: (result: any) => void;
          onClose: () => void;
        },
      ) => void;
    };
  }
}

export const useCheckout = (options?: UseMutationOptions<CheckoutResponse, Error, CheckoutData>) => {
  return useMutation({
    mutationFn: checkoutOrder,
    onSuccess: (data, variables, context) => {
      // Payment processing
      console.log('✅ Checkout success - Full response:', data);
      console.log('✅ Payment data:', data?.payment);
      console.log('✅ Token:', data?.payment?.token);
      console.log('✅ Window.snap:', window.snap);

      if (!data?.payment?.token) {
        console.error('❌ No payment token found in response!');
        console.error('📦 Response data:', JSON.stringify(data, null, 2));

        // 🔥 Tampilkan error ke user
        // toast.error('Payment token not found. Please try again.');

        // 🔥 Trigger onError jika ada
        if (options?.onError) {
          options.onError(new Error('No payment token found'), variables, context);
        }
        return;
      }

      // 🔥 CEK APAKAH WINDOW.SNAP TERSEDIA
      if (!window.snap) {
        console.error('❌ Window.snap is undefined! Snap script may not be loaded.');
        console.log('🔍 Check: Is the Midtrans Snap script loaded?');
        console.log('🔍 Client Key:', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);

        // 🔥 Tampilkan error ke user
        // toast.error('Payment system not loaded. Please refresh the page.');

        // 🔥 Trigger onError jika ada
        if (options?.onError) {
          options.onError(new Error('Snap script not loaded'), variables, context);
        }
        return;
      }

      // ✅ SEMUA OK, BUKA SNAP
      console.log('✅ Opening Snap popup with token:', data.payment.token);

      window.snap.pay(data.payment.token, {
        onSuccess: (result: any) => {
          console.log('✅ Payment success:', result);
          // 🔥 PERBAIKAN: Redirect ke orders/success dengan order_id
          window.location.href = `/order/success?order_id=${data.order?.id || ''}`;
        },
        onPending: (result: any) => {
          console.log('⏳ Payment pending:', result);
          // 🔥 PERBAIKAN: Redirect ke orders/pending
          window.location.href = `/order/pending?order_id=${data.order?.id || ''}`;
        },
        onError: (result: any) => {
          console.error('❌ Payment error:', result);
          // 🔥 PERBAIKAN: Redirect ke orders/failed
          window.location.href = `/order/failed?order_id=${data.order?.id || ''}`;
        },
        onClose: () => {
          console.log('🚫 Customer closed payment popup');
          // 🔥 TAMBAHAN: Redirect ke halaman order detail
          if (data.order?.id) {
            window.location.href = `/order/${data.order.id}`;
          } else {
            window.location.href = '/order';
          }
        },
      });

      // 🔥 Trigger onSuccess dari options jika ada
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error: any, variables, context) => {
      // 🔥 BETTER ERROR HANDLING
      console.error('❌ Checkout error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error message:', error.message);

      // 🔥 Tampilkan error ke user
      const errorMessage = error.response?.data?.message || error.message || 'Checkout failed. Please try again.';
      toast.error(errorMessage);

      // 🔥 Trigger onError dari options jika ada
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
    ...options,
  });
};

export const useOrderAll = () => {
  return useQuery({
    queryKey: ['allOrder'],
    queryFn: () => getAllOrder(),
  });
};

export const useOrderList = () => {
  return useQuery({
    queryKey: ['listOrder'],
    queryFn: () => getListOrderUser(),
  });
};

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ['orderDetail', orderId],
    queryFn: () => getOrderDetail(orderId),
    enabled: !!orderId,
  });
};
