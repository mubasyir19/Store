import { Check, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { useAddToCart } from '../../hooks/cart/useCart';

interface Props {
  productId: string;
  stock: number;
}

function AddToCartButton({ productId, stock }: Props) {
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const { mutate, isPending } = useAddToCart();

  const handleAddToCart = async () => {
    await mutate({ productId, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className='bg-primary flex items-center justify-center gap-3 cursor-pointer text-white font-medium text-sm py-3 px-8 rounded-lg hover:bg-primary/90 transition-all hover:scale-105 transform'
    >
      {isPending ? (
        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
      ) : added ? (
        <>
          <Check className='w-5 h-5' />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className='size-5 text-white' />
          Add to Cart
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
