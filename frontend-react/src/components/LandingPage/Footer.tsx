import { Link } from 'react-router';

function Footer() {
  return (
    <footer className='bg-white w-full border-t border-gray-300 flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4'>
      <div className=''>
        <h2 className='text-primary font-bold text-xl'>Emerald Retail</h2>
        <p className='text-neutral text-sm'>&copy;2026 Emerald Retail. Precise. Professional. Effortless.</p>
      </div>
      <div className='mt-8 md:mt-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
        <Link to={`#`}>
          <p className='text-neutral font-medium text-sm'>Privacy Policy</p>
        </Link>
        <Link to={`#`}>
          <p className='text-neutral font-medium text-sm'>Terms of Service</p>
        </Link>
        <Link to={`#`}>
          <p className='text-neutral font-medium text-sm'>Help Center</p>
        </Link>
        <Link to={`#`}>
          <p className='text-neutral font-medium text-sm'>Contact Us</p>
        </Link>
        <Link to={`/admin/login`}>
          <p className='text-neutral font-medium text-sm'>Admin Dashboard</p>
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
