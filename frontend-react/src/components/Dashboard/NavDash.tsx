import { Bell, CircleUser, Menu } from 'lucide-react';

function NavDash() {
  return (
    <nav className='flex justify-between px-6 py-4 w-full border-b border-gray-300'>
      <div className=''>
        <button>
          <Menu className='size-5 text-black' />
        </button>
      </div>
      <div className='flex items-center gap-8'>
        <button className='relative cursor-pointer'>
          <Bell className='size-5 text-black' />
          <div className='absolute top-0 right-0 size-2 rounded-full bg-red-500'></div>
        </button>
        <button className='cursor-pointer'>
          <CircleUser className='size-5 text-black' />
        </button>
      </div>
    </nav>
  );
}

export default NavDash;
