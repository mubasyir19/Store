import { CircleUser, Heart, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useAuthStore } from '../../stores/authStore';

function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { isAuthenticated } = useAuthStore();
  return (
    <nav className='sticky w-full z-50 flex items-center justify-between px-6 py-4 shadow-lg'>
      <div className=''>
        <Link to={`/`}>
          <h1 className='text-primary font-bold text-base md:text-lg lg:text-xl xl:text-2xl text-center'>
            Emerald Retail
          </h1>
        </Link>
      </div>
      <div className='hidden md:flex items-center gap-4'>
        <Link to={`/category`}>
          <p className={`font-medium ${pathname === '/category' ? 'text-primary' : 'text-black'}`}>Category</p>
        </Link>
        <Link to={`/product`}>
          <p className={`font-medium ${pathname === '/product' ? 'text-primary' : 'text-black'}`}>Product</p>
        </Link>
        <Link to={`#`}>
          <p className={`font-medium ${pathname === '/about' ? 'text-primary' : 'text-black'}`}>About Us</p>
        </Link>
      </div>
      <div className='hidden md:block'>
        {isAuthenticated === true ? (
          <div className='flex items-center gap-4'>
            <Link to={`#`}>
              <div className={`group rounded-full p-1 ${pathname === '/wishlist' ? 'bg-primary' : 'bg-none'}`}>
                <Heart className={`size-5 ${pathname === '/wishlist' ? 'text-white' : 'text-black'}`} />
              </div>
            </Link>
            <Link to={`#`}>
              <div className={`group rounded-full p-1 ${pathname === '/wishlist' ? 'bg-primary' : 'bg-none'}`}>
                <ShoppingCart className={`size-5 ${pathname === '/wishlist' ? 'text-white' : 'text-black'}`} />
              </div>
            </Link>
            <Link to={`#`}>
              <div className={`group rounded-full p-1 ${pathname === '/wishlist' ? 'bg-primary' : 'bg-none'}`}>
                <CircleUser className={`size-5 ${pathname === '/wishlist' ? 'text-white' : 'text-black'}`} />
              </div>
            </Link>
          </div>
        ) : (
          <div className='flex items-center gap-4'>
            <Link to={`/register`}>
              <button className='border cursor-pointer border-primary text-primary font-medium text-sm py-1 px-2 rounded-lg w-fit outline-none'>
                Register
              </button>
            </Link>
            <Link to={`/login`}>
              <button className='bg-primary cursor-pointer text-white font-medium text-sm py-1 px-2 rounded-lg w-fit outline-none'>
                Sign In
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
