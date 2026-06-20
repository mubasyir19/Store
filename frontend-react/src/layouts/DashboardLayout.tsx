import { Outlet } from 'react-router';
import NavDash from '../components/Dashboard/NavDash';
import Sidebar from '../components/Dashboard/Sidebar';

function DashboardLayout() {
  return (
    <div className='flex min-h-screen w-full flex-row flex-nowrap items-start'>
      <Sidebar />
      <main className='md:pl-64 flex flex-1 flex-col overflow-hidden'>
        <NavDash />
        <div className='scrollbar-hidden flex-1 overflow-y-auto'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
