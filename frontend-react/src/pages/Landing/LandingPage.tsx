import { Link } from 'react-router';
import { useAuthStore } from '../../stores/authStore';
import { MessageCircleQuestionMark, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '../../hooks/product/useProduct';
import type { Product } from '../../types/product';
import ProductCard from '../../components/Product/ProductCard';

function LandingPage() {
  const { accessToken, user } = useAuthStore();
  // console.log('access token =', accessToken);
  console.log('user =', user);
  const { data: dataProducts, isLoading, error } = useProducts();
  // console.log('list products =', dataProducts);

  if (isLoading) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='text-center py-20'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
          <p className='mt-4 text-lg text-black text-center font-semibold'>Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='container mx-auto px-6 py-8'>
        <div className='text-center py-20'>
          <p className='text-red-500 text-center'>Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  const products = dataProducts?.data || [];

  const newArrivals = products
    .sort((a: Product, b: Product) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  console.log('new arriv =', newArrivals);

  return (
    <div>
      <section className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-4 place-self-center'>
            <p className='uppercase bg-tertiary/50 rounded-full text-xs px-3 py-1 text-primary font-medium w-fit'>
              Premium Collection 2026
            </p>
            <h1 className='text-2xl lg:text-3xl xl:text-4xl font-bold text-primary'>Elevate Your Lifestyle</h1>
            <p className='text-sm text-neutral'>
              Discover curated precision and professional craft in every detail. Designed for those who appreciate the
              intersection of high-end aesthetics and daily utility.
            </p>
            <div className='mt-4 flex items-center gap-4'>
              <Link to={`/product`}>
                <button className='bg-primary cursor-pointer text-white font-medium text-sm py-2 px-4 rounded-lg w-fit outline-none'>
                  Shop Now
                </button>
              </Link>
              <Link to={`#`}>
                <button className='border cursor-pointer border-primary text-primary font-medium text-sm py-2 px-4 rounded-lg w-fit outline-none'>
                  View Lookbook
                </button>
              </Link>
            </div>
          </div>
          <div className='hidden md:block place-self-center'>
            <img src='/images/head.png' alt='image' className='h-1/2 w-full object-cover' />
          </div>
        </div>
      </section>
      <section className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6'>
          <div className='bg-secondary shadow rounded-lg p-4 flex items-center gap-4'>
            <div className='bg-tertiary/30 rounded-full size-14 flex items-center justify-center'>
              <Truck className='text-black size-7' />
            </div>
            <div className='grow'>
              <p className='text-black font-semibold text-base'>Free shipping</p>
              <p className='text-neutral text-sm'>on all orders over $150</p>
            </div>
          </div>
          <div className='bg-secondary shadow rounded-lg p-4 flex items-center gap-4'>
            <div className='bg-tertiary/30 rounded-full size-14 flex items-center justify-center'>
              <ShieldCheck className='text-black size-7' />
            </div>
            <div className='grow'>
              <p className='text-black font-semibold text-base'>Secure Payment</p>
              <p className='text-neutral text-sm'>100% encrypted transactions</p>
            </div>
          </div>
          <div className='bg-secondary shadow rounded-lg p-4 flex items-center gap-4'>
            <div className='bg-tertiary/30 rounded-full size-14 flex items-center justify-center'>
              <MessageCircleQuestionMark className='text-black size-7' />
            </div>
            <div className='grow'>
              <p className='text-black font-semibold text-base'>24/7 Support</p>
              <p className='text-neutral text-sm'>Professional dedicated care</p>
            </div>
          </div>
        </div>
      </section>
      <section className='container mx-auto px-6 py-8'>
        <div className=''>
          <h2 className='text-center text-primary font-bold text-2xl'>New Arrivals</h2>
          <p className='text-center text-neutral text-base'>The latest additions to the Emerald collection.</p>
        </div>
        {newArrivals.length === 0 ? (
          <p className='mt-4 text-lg text-black text-center font-semibold'>No products available</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6'>
            {newArrivals.map((item: Product) => (
              <ProductCard
                key={item.id}
                id={item.id}
                images={item.images}
                name={item.name}
                slug={item.slug}
                price={item.price}
                description={item.description}
              />
            ))}
          </div>
        )}
      </section>
      <section className='px-6 py-8 bg-primary'>
        <div className='container mx-auto '>
          <div className='text-sm md:text-base text-white text-center'>
            Subscribe to receive curated product updates, exclusive previews, and member-only events directly to your
            inbox.
          </div>
          <form className='w-full md:w-1/4 mx-auto mt-4 flex flex-col md:flex-row items-stretch justify-center gap-4'>
            <input
              type='email'
              name='email'
              placeholder='Enter your business email'
              required
              className='bg-white rounded-lg grow px-4 py-2 focus:outline-none'
            />
            <button className='text-white shadow-lg px-4 py-2 md:py-0 border border-tertiary rounded-lg cursor-pointer text-sm md:text-base'>
              Subscribe
            </button>
          </form>
          <p className='mt-4 text-xs md:text-sm text-white text-center'>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
