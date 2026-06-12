import { Button } from '../../components/ui/button';
import { useFetchCart } from '../../hooks/cart/useCart';
import CartItemCard from '../../components/Cart/CartItemCard';
import { useAuthStore } from '../../stores/authStore';
import type { CartItem } from '../../types/cartItem';
import { useCartStore } from '../../stores/cartStore';

function CartPage() {
  const { user } = useAuthStore();
  const { data: cartItems, isLoading } = useFetchCart();
  const { items, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  // console.log('list cart items user = ', cartItems);
  // console.log('items cart = ', items);
  // console.log('sub total items = ', subtotal);

  // Count SubTotal
  const shipping = 0;
  const estimatedTax = subtotal * 0.11;
  const total = subtotal + shipping + estimatedTax;

  return (
    <div>
      <section className='container mx-auto px-6 py-8'>
        <h1 className='text-primary text-2xl lg:text-3xl xl:text-4xl font-bold'>Your Shopping Cart</h1>
      </section>
      <section className='container min-h-screen mx-auto px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='grow space-y-4'>
            {isLoading ? (
              <p>Loading...</p>
            ) : Array.isArray(cartItems) && cartItems.length > 0 ? (
              cartItems.map((item: CartItem) => (
                <CartItemCard
                  key={item.id}
                  idCart={item.id}
                  userId={user?.id as string}
                  productId={item.productId}
                  quantity={item.quantity}
                  subTotal={0}
                />
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          <div className='border border-gray-300 rounded-xl bg-white p-6 h-fit w-full lg:w-72 xl:w-72'>
            <h4 className='text-black font-bold text-xl'>Order Summary</h4>
            <div className='mt-6 space-y-2 pb-4 border-b border-gray-400'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-black'>Subtotal</p>
                <p className='text-sm'>{subtotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-black'>Shipping</p>
                <p className='text-sm'>{shipping.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-black'>Estimated Tax</p>
                <p className='text-sm'>
                  {estimatedTax.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </p>
              </div>
            </div>
            <div className='mt-2 flex items-center justify-between'>
              <p className='text-lg font-bold text-black'>Total</p>
              <p className='text-lg font-bold text-black'>
                {total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </p>
            </div>
            <div className='mt-8 space-y-4'>
              <Button className='w-full'>Proceed to Checkout</Button>
              <div className='bg-slate-100 border border-gray-200 p-2 rounded-md'>
                <p className='text-xs text-gray-500'>Secured by EmeraldVault Encryption. Your data is protected.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
