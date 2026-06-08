import { Outlet } from 'react-router';
import Footer from '../components/LandingPage/Footer';
import Navbar from '../components/LandingPage/Navbar';

function UserLayout() {
  return (
    <div className=''>
      <Navbar />
      <div className=''>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default UserLayout;
