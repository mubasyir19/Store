import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { checkoutOrder } from '../../services/order';
import type { CheckoutData, CheckoutResponse } from '../../types/order';

export const useCheckout = (options?: UseMutationOptions<CheckoutResponse, Error, CheckoutData>) => {
  return useMutation({
    mutationFn: checkoutOrder,
    onSuccess: (data) => {
      // Payment processing
      if (data.payment.token && window.snap) {
        window.snap.pay(data.payment.token, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result);
            window.location.href = '/order/success';
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result);
            window.location.href = '/order/pending';
          },
          onError: (result: any) => {
            console.error('Payment error:', result);
            window.location.href = '/order/failed';
          },
          onClose: () => {
            console.log('Customer closed payment popup');
          },
        });
      }
    },
    ...options,
  });
};
