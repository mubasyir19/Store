import { Link } from 'react-router';

function MainDashPage() {
  return (
    <div className='p-8 space-y-8'>
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>Total Revenue</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>
            {(19000000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </h2>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>Today's Order</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>142</h2>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>New Customer</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>38</h2>
        </div>
      </section>
      <section className='grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8'>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md md:col-span-3 lg:col-span-4'>
          <p className='text-black font-semibold text-xl'>Sales Overview</p>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md md:col-span-1 lg:col-span-2'>
          <p className='text-black font-semibold text-xl'>System Health</p>
        </div>
      </section>
      <section>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <div className='flex items-center justify-between'>
            <p className='text-black font-semibold text-xl'>Top Selling Products</p>
            <p className='text-neutral text-base'>
              <Link to={`#`}>Full Report</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainDashPage;
