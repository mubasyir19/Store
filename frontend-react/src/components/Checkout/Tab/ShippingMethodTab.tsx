import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface ShippingMethodTabProps {
  onNext?: () => void;
  onPrev?: () => void;
  selectedMethod?: string;
  selectedPrice?: number;
  onMethodChange?: (method: string, price: number) => void;
}

const SHIPPING_OPTIONS = [
  {
    id: 'regular',
    label: 'Regular',
    price: 10000,
    description: 'Estimated delivery: 3 - 5 working days',
  },
  {
    id: 'express',
    label: 'Express',
    price: 20000,
    description: 'Estimated delivery: 1 - 2 working days',
  },
  {
    id: 'same-day',
    label: 'Same Day',
    price: 50000,
    description: 'Estimated delivery: Today (for nearby areas)',
  },
];

function ShippingMethodTab({
  onNext,
  onPrev,
  selectedMethod = 'regular',
  selectedPrice = 10000,
  onMethodChange,
}: ShippingMethodTabProps) {
  const handleMethodChange = (method: string, price: number) => {
    if (onMethodChange) {
      onMethodChange(method, price);
    }
  };

  const getSelectedOption = SHIPPING_OPTIONS.find((opt) => opt.id === selectedMethod);

  return (
    <div>
      <h3 className='text-black font-bold text-xl'>Shipping Method</h3>
      {getSelectedOption && (
        <div className='mt-2 p-2 bg-blue-50 rounded-md'>
          <p className='text-sm text-blue-700'>
            Selected: {getSelectedOption.label} -{' '}
            {getSelectedOption.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </p>
        </div>
      )}
      <div className='mt-4 space-y-4'>
        {SHIPPING_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={`border rounded-md p-4 flex items-center justify-between cursor-pointer transition-all
              ${selectedMethod === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
            onClick={() => handleMethodChange(option.id, option.price)}
          >
            <div className='flex items-center gap-4'>
              <div>
                <Input
                  type='radio'
                  name='shippingMethod'
                  value={option.id}
                  checked={selectedMethod === option.id}
                  onChange={() => handleMethodChange(option.id, option.price)}
                  className='cursor-pointer'
                />
              </div>
              <div className='space-y-0.5'>
                <p className='text-base font-bold text-black'>{option.label}</p>
                <p className='text-gray-400 text-sm'>{option.description}</p>
              </div>
            </div>
            <div>
              <p className={`text-black font-bold text-base ${selectedMethod === option.id ? 'text-blue-600' : ''}`}>
                {option.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </p>
            </div>
          </div>
        ))}
        {/* <div className='border border-gray-200 rounded-md p-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className=''>
              <Input
                type='radio'
                name='shippingMethod'
                value='regular'
                checked={selectedMethod === 'regular'}
                onChange={() => handleMethodChange('regular')}
              />
            </div>
            <div className='space-y-0.5'>
              <p className='text-base font-bold text-black'>Regular</p>
              <p className='text-gray-400 text-sm'>Estimated develivery: 3 - 5 working days</p>
            </div>
          </div>
          <div className=''>
            <p className='text-black font-bold text-base'>
              {(10000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </p>
          </div>
        </div>
        <div className='border border-gray-200 rounded-md p-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className=''>
              <Input
                type='radio'
                name='shippingMethod'
                value='express'
                checked={selectedMethod === 'express'}
                onChange={() => handleMethodChange('express')}
              />
            </div>
            <div className='space-y-0.5'>
              <p className='text-base font-bold text-black'>Express</p>
              <p className='text-gray-400 text-sm'>Estimated develivery: 1 - 2 working days</p>
            </div>
          </div>
          <div className=''>
            <p className='text-black font-bold text-base'>
              {(20000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </p>
          </div>
        </div>
        <div className='border border-gray-200 rounded-md p-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className=''>
              <Input
                type='radio'
                name='shippingMethod'
                value='same_day'
                checked={selectedMethod === 'same_day'}
                onChange={() => handleMethodChange('same_day')}
              />
            </div>
            <div className='space-y-0.5'>
              <p className='text-base font-bold text-black'>Same Day</p>
              <p className='text-gray-400 text-sm'>Estimated develivery: Today (for nearby areas)</p>
            </div>
          </div>
          <div className=''>
            <p className='text-black font-bold text-base'>
              {(50000).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </p>
          </div>
        </div> */}
      </div>
      {/* Optional: Tampilkan shipping cost summary */}
      <div className='mt-4 p-3 border-t border-gray-200'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Shipping Cost:</span>
          <span className='font-bold'>
            {selectedPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
          </span>
        </div>
      </div>
      <div className='mt-4 flex items-center justify-between'>
        <Button className='' onClick={onPrev}>
          Previous
        </Button>
        <Button className='' onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export default ShippingMethodTab;
