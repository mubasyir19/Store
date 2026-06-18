import { Building, CreditCard, Wallet } from 'lucide-react';
import { Button } from '../../ui/button';

interface PaymentMethodTabProps {
  onNext: () => void;
  onPrev: () => void;
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

function PaymentMethodTab({ onNext, onPrev, selectedMethod, onMethodChange }: PaymentMethodTabProps) {
  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Transfer via BCA, Mandiri, BNI, etc.',
      icon: Building,
    },
    {
      id: 'credit_card',
      name: 'Credit / Debit Card',
      description: 'Visa, Mastercard, JCB',
      icon: CreditCard,
    },
    {
      id: 'gopay',
      name: 'GoPay',
      description: 'Pay with GoPay e-wallet',
      icon: Wallet,
    },
  ];

  return (
    <div className='bg-white rounded-xl p-6'>
      <h3 className='text-lg font-semibold mb-4'>Payment Method</h3>
      <div className='space-y-3'>
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`
              block p-4 border-2 rounded-lg cursor-pointer transition
              ${selectedMethod === method.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
            `}
          >
            <div className='flex items-center gap-3'>
              <input
                type='radio'
                name='paymentMethod'
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onMethodChange(method.id)}
                className='w-4 h-4 text-blue-600'
              />
              <method.icon className='w-5 h-5 text-gray-600' />
              <div>
                <p className='font-medium'>{method.name}</p>
                <p className='text-sm text-gray-500'>{method.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <Button className='' onClick={onPrev}>
          Back
        </Button>
        <Button className='' onClick={onNext}>
          Place Order
        </Button>
      </div>
    </div>
  );
}

export default PaymentMethodTab;
