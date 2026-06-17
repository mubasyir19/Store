import React, { useState } from 'react';
import ItemCheckout from '../../components/Checkout/ItemCheckout';
import ShippingDataTab from '../../components/Checkout/Tab/ShippingDataTab';
import ShippingMethodTab from '../../components/Checkout/Tab/ShippingMethodTab';
import { useFetchCart } from '../../hooks/cart/useCart';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import type { CartItem } from '../../types/cartItem';

const tabs = [
  {
    name: 'Address',
  },
  {
    name: 'Shipping',
  },
  {
    name: 'Payment',
  },
];

interface ShippingData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes: string;
}

function CheckoutPage() {
  const { user } = useAuthStore();
  const { data: cartItems, isLoading } = useFetchCart();
  const { getSubtotal } = useCartStore();
  const subtotal = getSubtotal();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const [formShippingData, setFormShippingData] = useState<ShippingData>({
    shippingName: user?.name ?? '',
    shippingPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostalCode: '',
    shippingNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormShippingData((prev) => ({ ...prev, [name]: value }));
  };

  // Count Total Cart
  const shipping = 0;
  const estimatedTax = subtotal * 0.11;
  const total = subtotal + shipping + estimatedTax;

  console.log('item cart = ', cartItems);

  return (
    <div>
      <section className='container mx-auto px-6 py-8'>
        <h1 className='text-primary text-2xl lg:text-3xl xl:text-4xl font-bold'>Checkout Order</h1>
      </section>
      <section className='container min-h-screen mx-auto px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-6'>
          <div className='grow w-full'>
            <div className='flex items-start justify-between min-w-150 md:min-w-full relative'>
              {tabs.map((tab, i) => (
                <div key={i} className='flex-1 flex items-center relative'>
                  {/* Kontainer Utama Angka & Tulisan */}
                  <div
                    onClick={() => setCurrentStep && setCurrentStep(i)} // Opsional: jika ingin bisa diklik
                    className='flex flex-col items-center gap-2 group cursor-pointer z-10 mx-auto'
                  >
                    {/* Lingkaran Angka */}
                    <div
                      className={`group-hover:bg-primary group-hover:border-primary size-9 border-2 rounded-full flex items-center justify-center duration-300 transition-all ${
                        currentStep === i ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <p
                        className={`text-sm group-hover:text-white font-bold duration-300 transition-all ${
                          currentStep === i ? 'text-white' : 'text-gray-500'
                        }`}
                      >
                        {i + 1}
                      </p>
                    </div>

                    {/* Tulisan / Nama Tab di Bawah Angka */}
                    <p
                      className={`group-hover:text-primary font-semibold text-sm md:text-base text-center duration-300 transition-all ${
                        currentStep === i ? 'text-primary' : 'text-gray-400'
                      }`}
                    >
                      {tab.name}
                    </p>
                  </div>

                  {/* Garis Penghubung Antar Tab */}
                  {i !== tabs.length - 1 && (
                    <div className='absolute top-4.5 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-0.5 bg-gray-300 z-0' />
                  )}
                </div>
              ))}
            </div>
            {/* Tab 1 - basic data shipping */}
            <div className='mt-6'>
              {currentStep === 0 && (
                <ShippingDataTab data={formShippingData} onChange={handleChange} onNext={nextStep} />
              )}
              {currentStep === 1 && <ShippingMethodTab onNext={nextStep} onPrev={prevStep} />}
              {currentStep === 2 && (
                <ShippingDataTab data={formShippingData} onChange={handleChange} onNext={nextStep} onPrev={prevStep} />
              )}
            </div>
          </div>
          <div className='border border-gray-300 rounded-xl bg-white p-6 h-fit w-full lg:w-1/3'>
            <h4 className='text-black font-bold text-xl'>Order Summary</h4>
            <div className='mt-6 py-4 border-t border-gray-400'>
              {/* items cart */}
              {isLoading ? (
                <p className='text-black text-sm text-center'>Loading...</p>
              ) : Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map((item: CartItem) => (
                  <ItemCheckout key={item.id} idCart={item.id} productId={item.productId} quantity={item.quantity} />
                ))
              ) : (
                <p className='text-black text-sm text-center'>Your cart is empty.</p>
              )}
            </div>
            <div className='space-y-2 pt-4 border-t border-gray-400'>
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

export default CheckoutPage;
