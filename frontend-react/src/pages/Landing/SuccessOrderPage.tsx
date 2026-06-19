import { Link, useSearchParams } from 'react-router';
import { useOrderDetail } from '../../hooks/order/useOrder';

function SuccessOrderPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { data, isLoading, isError } = useOrderDetail(orderId as string);

  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'>Memuat status pesanan...</div>;
  }

  if (!orderId || isError || !data) {
    return (
      <div className='flex flex-col justify-center items-center h-screen space-y-4'>
        <p className='text-red-500 font-medium'>Data pesanan tidak ditemukan atau terjadi kesalahan.</p>
        <Link to='/' className='text-indigo-600 hover:underline'>
          Kembali ke Toko
        </Link>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4'>
      <div className='bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center'>
        {/* Icon Sukses */}
        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
          </svg>
        </div>

        <h1 className='text-2xl font-bold text-gray-800 mb-2'>Pembayaran Berhasil!</h1>
        <p className='text-gray-600 mb-6'>Terima kasih atas pembayaran Anda. Pesanan Anda sedang diproses.</p>

        {/* Ringkasan Pesanan */}
        {data.order && (
          <div className='bg-gray-50 p-4 rounded-xl text-left text-sm mb-6 space-y-2'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Order ID:</span>
              <span className='font-semibold text-gray-700'>{data.order.midtransOrderId}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Total Bayar:</span>
              <span className='font-semibold text-gray-700'>
                {data.order.totalPrice?.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Status Database:</span>
              <span className='px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full'>
                {data.order.status}
              </span>
            </div>
          </div>
        )}

        {/* Tombol Navigasi */}
        <div className='space-y-3'>
          <Link
            to='/dashboard/orders'
            className='block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition duration-200'
          >
            Lihat Daftar Pesanan
          </Link>
          <Link
            to='/'
            className='block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition duration-200'
          >
            Kembali ke Toko
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SuccessOrderPage;
