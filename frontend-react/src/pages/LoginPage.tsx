import { Link } from 'react-router';
import { Gem, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import type { LoginPayload } from '../types/user';
import { useLogin } from '../hooks/auth/useLogin';

function LoginPage() {
  const { mutate, isPending } = useLogin();

  const [formData, setFormData] = useState<LoginPayload>({
    email: '',
    passwordHash: '',
  });
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

    mutate(formData);
  };
  return (
    <div className='w-full h-screen flex items-center justify-center px-4 py-8'>
      <div className='bg-white xl:p-40 lg:p-20 md:p-10 p-4 shadow-xl rounded-xl'>
        <div className=''>
          <Gem className='text-primary size-14 mx-auto' />
          <h1 className='text-primary font-bold text-2xl text-center'>Emerald Retail</h1>
        </div>
        <div className='mt-8 space-y-1'>
          <h2 className='text-primary text-xl font-semibold text-center'>Welcome back</h2>
          <p className='text-base text-neutral text-center'>Please enter your details to access your account.</p>
        </div>
        <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
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
          <div className='group-input'>
            <div className='flex items-center justify-between'>
              <label htmlFor='' className='block text-black text-base font-medium'>
                Password
              </label>
              <Link to={'/forgot-password'} className='text-primary font-medium text-sm'>
                Forgot Password?
              </Link>
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
          <div className=''>
            <button type='submit' className='bg-primary text-white font-medium text-base py-2 rounded-lg w-full'>
              {isPending ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className='mt-8'>
          <p className='text-neutral text-base text-center'>
            Don&apos;t have an account?{' '}
            <Link to={'/register'} className='text-primary font-medium'>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
