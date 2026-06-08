import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';

interface ProductCardProps {
  images?: string[];
  name: string;
  slug?: string;
  price: number;
  description: string;
}

function ProductCard({ images, name, slug, price, description }: ProductCardProps) {
  const displayImage = images && images.length > 0 ? images[0] : null;
  return (
    <div className='rounded-lg overflow-hidden shadow-xl'>
      <div className='relative h-60'>
        {displayImage ? (
          <img src={displayImage} alt='images' className='h-full w-full object-cover' />
        ) : (
          <div className='bg-gray-400 h-full w-full'></div>
        )}
        <div className='absolute top-2 right-2 group cursor-pointer bg-white size-10 rounded-full flex items-center justify-center'>
          <Heart className='text-black size-5 group-hover:fill-red-500 group-hover:text-red-500' />
        </div>
      </div>
      <div className='p-4 bg-white flex flex-col'>
        <Link to={`/product/${slug}`}>
          <p className='text-lg font-semibold text-primary line-clamp-1 hover:underline hover:decoration-primary'>
            {name}
          </p>
        </Link>
        <p className='text-neutral text-sm line-clamp-2'>{description}</p>
        <div className='mt-6 flex items-center'>
          <p className='grow font-bold text-black text-lg'>
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(price)}
          </p>
          <button className='px-3 py-1 bg-primary rounded-lg text-center text-white font-medium flex items-center gap-2 text-sm'>
            <ShoppingCart className='size-4 text-white' /> Add
          </button>
        </div>

        {/* <Link to={`product/${slug}`}>
          <p className='mt-6 text-primary text-center font-medium underline decoration-primary'>See detail</p>
        </Link> */}
      </div>
    </div>
  );
}

export default ProductCard;
