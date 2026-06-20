import ListOrder from '../../components/Dashboard/Order/ListOrder';
import { useOrderAll } from '../../hooks/order/useOrder';
import type { Order } from '../../types/order';

function OrderDashPage() {
  const { data: allOrder, isLoading } = useOrderAll();
  const orders: Order[] = allOrder?.data ?? [];
  const totalPendingPaymentOrder = orders.filter((item: Order) => item.status === 'Pending');
  return (
    <div className='p-8 space-y-8'>
      <section className='flex items-center justify-between'>
        <div className=''>
          <h2 className='text-black font-bold text-2xl'>Order</h2>
          <p className='text-neutral text-sm'>Monitor and manage your order.</p>
        </div>
        <div className=''></div>
      </section>
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>Total Orders</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>{isLoading ? 0 : orders.length}</h2>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>Pending Payment</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>{isLoading ? 0 : totalPendingPaymentOrder.length}</h2>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-red-600'>Shipped Today</p>
          <h2 className='mt-2 font-bold text-red-600 text-2xl'>24</h2>
        </div>
      </section>
      <section>
        <ListOrder />
      </section>
    </div>
  );
}

export default OrderDashPage;
