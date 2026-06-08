import { Gem, LockKeyhole, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { useRegister } from '../hooks/auth/useRegister';
import type { RegisterPayload } from '../types/user';

function RegisterPage() {
  const { mutate, isPending } = useRegister();

  const [formData, setFormData] = useState<RegisterPayload>({
    name: '',
    email: '',
    passwordHash: '',
    confirmPassword: '',
    role: 'Customer',
  });
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!isAgreed) {
      alert('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    mutate(formData);
  };

  return (
    <div className='w-full h-screen flex items-center justify-center px-4 py-8'>
      <div className='bg-white xl:px-40 lg:px-20 md:px-10 md:py-5 lg:py-10 xl:py-20 p-4 shadow-xl rounded-xl'>
        <div className=''>
          <Gem className='text-primary size-14 mx-auto' />
          <h1 className='text-primary font-bold text-2xl text-center'>Emerald Retail</h1>
        </div>
        <div className='mt-8 space-y-1'>
          <h2 className='text-primary text-xl font-semibold text-center'>Create your account</h2>
          <p className='text-base text-neutral text-center'>Join Emerald Retail for a premium shopping experience.</p>
        </div>
        <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
          <div className='group-input'>
            <label htmlFor='name' className='block text-black text-base font-medium'>
              Full Name
            </label>
            <div className='px-4 py-2 flex items-center border border-neutral gap-2 rounded-lg transition-all duration-200'>
              <User className='text-neutral size-5' />
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                required
                placeholder='John Doe'
                className='focus:outline-none grow'
              />
            </div>
          </div>
          <div className='group-input'>
            <label htmlFor='' className='block text-black text-base font-medium'>
              Email Address
            </label>
            <div className='px-4 py-2 flex items-center border border-neutral gap-2 rounded-lg transition-all duration-200'>
              <Mail className='text-neutral size-5' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                placeholder='name@company.com'
                className='focus:outline-none grow'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='group-input'>
              <div className='flex items-center justify-between'>
                <label htmlFor='' className='block text-black text-base font-medium'>
                  Password
                </label>
              </div>
              <div className='px-4 py-2 flex items-center border border-neutral gap-2 rounded-lg transition-all duration-200'>
                <LockKeyhole className='text-neutral size-5' />
                <input
                  type='password'
                  name='passwordHash'
                  value={formData.passwordHash}
                  onChange={handleChange}
                  required
                  placeholder='••••••'
                  className='focus:outline-none grow'
                />
              </div>
            </div>
            <div className='group-input'>
              <div className='flex items-center justify-between'>
                <label htmlFor='' className='block text-black text-base font-medium'>
                  Confirm Password
                </label>
              </div>
              <div className='px-4 py-2 flex items-center border border-neutral gap-2 rounded-lg transition-all duration-200'>
                <LockKeyhole className='text-neutral size-5' />
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder='••••••'
                  className='focus:outline-none grow'
                />
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              name='agreement'
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
            />
            <label htmlFor=''>I agree to the Term of Service and Privacy Policy</label>
          </div>
          <div className=''>
            <button type='submit' className='bg-primary text-white font-medium text-base py-2 rounded-lg w-full'>
              {isPending ? 'Loading...' : 'Create Account'}
            </button>
          </div>
        </form>
        <div className='mt-8'>
          <p className='text-neutral text-base text-center'>
            Already have an account?{' '}
            <Link to={'/register'} className='text-primary font-medium'>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
