import type { OrderStatus } from '../types/order';

export const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'Paid':
    case 'Delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Pending':
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
