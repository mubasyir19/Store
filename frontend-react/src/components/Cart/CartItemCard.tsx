import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useProductById } from '../../hooks/product/useProduct';

interface CartItemCardProps {
  idCart: string;
  userId: string;
  productId: string;
  quantity: number;
  subTotal: number;
}

function CartItemCard({ idCart, userId, productId, quantity, subTotal }: CartItemCardProps) {
  const { data: dataProduct, isLoading } = useProductById(productId);
  const displayImage =
    !isLoading && dataProduct?.images && dataProduct.images.length > 0 ? dataProduct.images[0] : null;
  console.log('detail prod = ', dataProduct);
  return (
    <div id='cart-item' className='border border-gray-300 p-4 rounded-xl flex justify-between'>
      <div className='flex gap-4'>
        <div className=''>
          {isLoading ? (
            <div className='bg-gray-400 size-24'></div>
          ) : (
            <img src={displayImage} alt='images' className='size-24 object-cover' />
            // <img src='/images/head.png' alt='images' className='size-24 object-cover' />
          )}
        </div>
        <div className='flex flex-col justify-between'>
          <p className='text-base text-black font-semibold'>{isLoading ? '....' : dataProduct.name}</p>
          <div className='w-fit flex items-stretch border border-gray-300 rounded-md overflow-hidden'>
            <button className='px-2 py-1 text-black text-sm bg-slate-100 cursor-pointer'>-</button>
            <p className='px-2 py-1 text-black text-sm border-x-2 border-gray-300'>{quantity}</p>
            <button className='px-2 py-1 text-black text-sm bg-slate-100 cursor-pointer'>+</button>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        <p className='text-base text-black font-semibold'>
          {isLoading ? 0 : Number(dataProduct.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
        </p>
        <Button variant={'destructive'}>
          <Trash />
          Remove
        </Button>
      </div>
    </div>
  );
}

export default CartItemCard;
