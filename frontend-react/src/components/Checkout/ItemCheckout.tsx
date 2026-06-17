import { useProductById } from '../../hooks/product/useProduct';

interface ItemCheckoutProps {
  idCart: string;
  //   userId: string;
  productId: string;
  quantity: number;
  //   subTotal: number;
}

function ItemCheckout({ idCart, userId, productId, quantity, subTotal }: ItemCheckoutProps) {
  const { data: dataProduct, isLoading: isLoadingProduct } = useProductById(productId);

  const displayImage =
    !isLoadingProduct && dataProduct?.images && dataProduct.images.length > 0 ? dataProduct.images[0] : null;
  const itemSubTotal = !isLoadingProduct && dataProduct ? dataProduct.price * quantity : 0;

  const isLoading = isLoadingProduct;
  return (
    <div className='flex items-center gap-4'>
      {/* photo item */}
      <div className=''>
        {isLoading ? (
          <div className='bg-gray-400 size-24'></div>
        ) : (
          <img src={displayImage} alt='images' className='size-24 object-cover' />
          // <img src='/images/head.png' alt='images' className='size-24 object-cover' />
        )}
      </div>
      {/* desc item */}
      {/* <div className='flex flex-col justify-between'> */}
      <div className=''>
        <p className='text-base text-black font-semibold line-clamp-1'>{isLoading ? '....' : dataProduct?.name}</p>
        <p className='text-xs text-gray-500'>Qty: {quantity}</p>
        <p className='text-black font-semibold text-sm'>
          {itemSubTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
        </p>
      </div>
    </div>
  );
}

export default ItemCheckout;
