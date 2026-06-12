import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useProductById } from '../../hooks/product/useProduct';
import { useRemoveCartItem, useUpdateCartQuantity } from '../../hooks/cart/useCart';

interface CartItemCardProps {
  idCart: string;
  userId: string;
  productId: string;
  quantity: number;
  subTotal: number;
}

function CartItemCard({ idCart, userId, productId, quantity, subTotal }: CartItemCardProps) {
  const { data: dataProduct, isLoading: isLoadingProduct } = useProductById(productId);
  const { mutate: updateQuantityMutation, isPending: isUpdating } = useUpdateCartQuantity();
  const { mutate: removeItemMutation, isPending: isRemoving } = useRemoveCartItem();

  const displayImage =
    !isLoadingProduct && dataProduct?.images && dataProduct.images.length > 0 ? dataProduct.images[0] : null;
  // console.log('detail prod = ', dataProduct);

  // Handle Update Quantity
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantityMutation({ itemId: idCart, quantity: quantity - 1 });
    } else {
      handleRemoveItem();
    }
  };

  const handleIncreaseQuantity = () => {
    if (dataProduct && quantity < dataProduct.stock) {
      updateQuantityMutation({ itemId: idCart, quantity: quantity + 1 });
    } else if (dataProduct && quantity >= dataProduct.stock) {
      alert(`Stock only available ${dataProduct.stock}`);
    }
  };

  // Handle Remove Item
  const handleRemoveItem = () => {
    removeItemMutation(idCart);
  };

  // Count subtotal per item
  const itemSubTotal = !isLoadingProduct && dataProduct ? dataProduct.price * quantity : 0;

  const isLoading = isLoadingProduct;
  const isDisabled = isUpdating || isRemoving;

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
          <p className='text-base text-black font-semibold'>{isLoading ? '....' : dataProduct?.name}</p>
          <div className='w-fit flex items-stretch border border-gray-300 rounded-md overflow-hidden'>
            <button
              onClick={handleDecreaseQuantity}
              disabled={isDisabled || isLoading}
              className='px-2 py-1 text-black text-sm bg-slate-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              -
            </button>
            <p className='px-2 py-1 text-black text-sm border-x-2 border-gray-300'>{quantity}</p>
            <button
              onClick={handleIncreaseQuantity}
              disabled={isDisabled || isLoading || (dataProduct && quantity >= dataProduct.stock)}
              className='px-2 py-1 text-black text-sm bg-slate-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className='flex flex-col justify-between'>
        {/* <p className='text-base text-black font-semibold'>
          {isLoading ? 0 : Number(dataProduct.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
        </p> */}
        <div className='text-right'>
          <p className='text-base text-black font-semibold'>
            {isLoading ? 0 : Number(dataProduct?.price).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </p>
          <p className='text-xs text-gray-500 mt-1'>
            Subtotal: {isLoading ? 0 : itemSubTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </p>
        </div>
        <Button variant={'destructive'} onClick={handleRemoveItem} disabled={isDisabled}>
          <Trash />
          Remove
        </Button>
      </div>
    </div>
  );
}

export default CartItemCard;
