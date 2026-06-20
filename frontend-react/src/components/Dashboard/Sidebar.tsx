import { Box, ChartNoAxesCombined, LayoutDashboard, Settings, ShoppingBag, Users } from 'lucide-react';
import SidebarItem from './SidebarItem';

const ListMenu = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    link: '/dashboard',
  },
  {
    name: 'Product',
    icon: Box,
    link: '/dashboard/product',
  },
  {
    name: 'Order',
    icon: ShoppingBag,
    link: '/dashboard/order',
  },
  {
    name: 'Customer',
    icon: Users,
    link: '/dashboard/customer',
  },
  {
    name: 'Analytics',
    icon: ChartNoAxesCombined,
    link: '/dashboard/analytics',
  },
  {
    name: 'Settings',
    icon: Settings,
    link: '/dashboard/settings',
  },
];

function Sidebar() {
  return (
    <aside className='hidden md:block fixed w-64 h-screen bg-secondary border-r border-gray-300 p-4'>
      <div className='px-4'>
        <h3 className='text-primary font-bold text-lg'>Emerald Retail</h3>
        <p className='text-neutral text-sm'>Management</p>
      </div>
      <ul className='mt-14 flex flex-col gap-3'>
        {ListMenu.map((menu, i) => (
          <SidebarItem key={i} label={menu.name} icon={menu.icon} link={menu.link} />
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;
