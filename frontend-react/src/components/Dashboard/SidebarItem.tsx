import type { LucideIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router';

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  link: string;
}

function SidebarItem({ label, icon: Icon, link }: SidebarItemProps) {
  const location = useLocation();
  const pathname = location.pathname;
  return (
    <li
      className={`group flex items-center gap-2 px-4 py-2 rounded-xl duration-200 transition-all ${pathname === link ? 'bg-primary' : 'hover:bg-primary'}`}
    >
      <Link to={link} className='flex items-center gap-2 w-full'>
        <Icon
          className={`size-5 duration-200 transition-all ${pathname === link ? 'text-secondary' : 'text-neutral group-hover:text-secondary'}`}
        />
        <p
          className={`text-base duration-200 transition-all ${pathname === link ? 'text-secondary' : 'text-neutral group-hover:text-secondary'}`}
        >
          {label}
        </p>
      </Link>
    </li>
  );
}

export default SidebarItem;
