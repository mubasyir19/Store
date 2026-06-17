import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface ShippingMethodTabProps {
  onNext?: () => void;
  onPrev?: () => void;
}

function ShippingMethodTab({ onNext, onPrev }: ShippingMethodTabProps) {
  return (
    <div>
      <h3 className='text-black font-bold text-xl'>Shipping Method</h3>
      <div className='mt-4 space-y-4'>
        <div className='border border-gray-200 rounded-md p-4 flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className=''>
              <Input type='radio' />
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
              <Input type='radio' />
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
              <Input type='radio' />
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
