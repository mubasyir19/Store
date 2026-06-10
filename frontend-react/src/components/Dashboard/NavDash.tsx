import { Bell, CircleUser, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { useLogout } from '../../hooks/auth/useAuth';

function NavDash() {
  const { mutate, isPending } = useLogout();

  const handleLogout = () => {
    mutate();
  };
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='cursor-pointer'>
              <CircleUser className='size-5 text-black' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link to={`#`}>Profile</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <Button onClick={handleLogout} size={'sm'} className='bg-red-500 w-full text-white rounded-lg'>
              {isPending ? 'Loading...' : 'Logout'}
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default NavDash;
