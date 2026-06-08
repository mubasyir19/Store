import ListCategory from '../../components/Dashboard/Category/ListCategory';
import ListProduct from '../../components/Dashboard/Product/ListProduct';

function ProductDashPage() {
  return (
    <div className='p-8 space-y-8'>
      <section className='flex items-center justify-between'>
        <div className=''>
          <h2 className='text-black font-bold text-2xl'>Product Inventory</h2>
          <p className='text-neutral text-sm'>Monitor and manage your store's high-end catalog items.</p>
        </div>
        <div className=''></div>
      </section>
      <section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>Total Products</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>148</h2>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-neutral'>Categories</p>
          <h2 className='mt-2 font-bold text-black text-2xl'>24</h2>
        </div>
        <div className='border border-gray-300 p-4 rounded-lg bg-white shadow-md'>
          <p className='text-base text-red-600'>Low Stock Alert</p>
          <h2 className='mt-2 font-bold text-red-600 text-2xl'>24</h2>
        </div>
      </section>
      <section>
        <ListCategory />
      </section>
      <section>
        <ListProduct />
      </section>
    </div>
  );
}

export default ProductDashPage;
