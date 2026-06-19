import { Link } from 'react-router';
import { useOrderList } from '../../hooks/order/useOrder';
import type { Order, OrderStatus } from '../../types/order';

function OrderListPage() {
  const { data, isLoading, isError } = useOrderList();
  console.log('list order = ', data);

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>;
  }

  if (isError || !data) {
    return <div className='flex justify-center items-center h-screen text-red-500'>Failed load list order.</div>;
  }

  const getStatusBadge = (status: OrderStatus) => {
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

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>My List Order</h1>
          <Link to='/' className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
            &larr; Back Shopping
          </Link>
        </div>

        {data.data.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100'>
            <p className='text-gray-500 mb-4'>You don't have any order history yet.</p>
            <Link
              to='/'
              className='inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition'
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {data.data.map((order: Order) => (
              <div
                key={order.id}
                className='bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition duration-200'
              >
                <div className='space-y-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='font-semibold text-gray-800 text-sm sm:text-base'>{order.midtransOrderId}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className='text-xs text-gray-400'>
                    Created at:{' '}
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    WIB
                  </p>
                  <p className='text-xs text-gray-500'>
                    Recipient: <span className='font-medium text-gray-700'>{order.shippingName}</span> (
                    {order.shippingCity})
                  </p>
                </div>

                <div className='flex sm:flex-col items-center sm:items-end w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 gap-2'>
                  <div className='sm:text-right'>
                    <p className='text-xs text-gray-400'>Total Payment</p>
                    <p className='font-bold text-indigo-600 text-lg'>
                      {/* Mengubah string harga menjadi number sebelum diformat */}
                      {Number(order.totalPrice).toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  <div className='flex gap-2'>
                    {/* Jika statusnya masih Pending dan ada snapRedirectUrl, tampilkan opsi Bayar Sekarang */}
                    {order.status === 'Pending' && order.snapRedirectUrl && (
                      <a
                        href={order.snapRedirectUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-block text-xs font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-xl transition shadow-sm'
                      >
                        Pay Now
                      </a>
                    )}

                    <Link
                      to={`/order/success?order_id=${order.id}`}
                      className='inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition'
                    >
                      See Detail
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderListPage;
