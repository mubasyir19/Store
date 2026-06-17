import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

interface ShippingData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingNotes: string;
}

interface ShippingDataProps {
  data: ShippingData;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext?: () => void;
}

function ShippingDataTab({ data, onChange, onNext }: ShippingDataProps) {
  return (
    <div className=''>
      <h3 className='text-black font-bold text-xl'>Shipping Data</h3>
      <div className='mt-4'>
        <form className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='shippingName'>Name</Label>
            <Input
              type='text'
              name='shippingName'
              value={data.shippingName}
              onChange={onChange}
              placeholder='Input your name'
              required
            />
            {/* {errors.slug && <p className='text-sm text-red-500'>{errors.slug}</p>} */}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='shippingPhone'>Phone</Label>
            <Input
              type='text'
              name='shippingPhone'
              value={data.shippingPhone}
              onChange={onChange}
              placeholder='Input phone number'
              required
            />
            {/* {errors.slug && <p className='text-sm text-red-500'>{errors.slug}</p>} */}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='shippingAddress'>Address</Label>
            <Textarea
              name='shippingAddress'
              value={data.shippingAddress}
              onChange={onChange}
              placeholder='Input your address'
              rows={4}
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='shippingCity'>City</Label>
            <Input
              type='text'
              name='shippingCity'
              value={data.shippingCity}
              onChange={onChange}
              placeholder='Input phone number'
              required
            />
            {/* {errors.slug && <p className='text-sm text-red-500'>{errors.slug}</p>} */}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='shippingPostalCode'>Postal Code</Label>
            <Input
              type='text'
              name='shippingPostalCode'
              value={data.shippingPostalCode}
              onChange={onChange}
              placeholder='Input postal code'
              required
            />
            {/* {errors.slug && <p className='text-sm text-red-500'>{errors.slug}</p>} */}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='shippingNotes'>Note</Label>
            <Textarea
              name='shippingNotes'
              value={data.shippingNotes}
              onChange={onChange}
              placeholder='Input notes'
              rows={4}
            />
          </div>
        </form>
        <div className='mt-4 flex items-center justify-end'>
          <Button className='' onClick={onNext}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShippingDataTab;
