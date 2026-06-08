function LoadingFallback() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <div className='text-center'>
        {/* Logo atau icon */}
        {/* <div className='w-20 h-20 mx-auto bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse'> */}
        <div className='w-20 h-20 mx-auto bg-linear-to-r from-primary to-tertiary rounded-full flex items-center justify-center animate-pulse'>
          <span className='text-white text-2xl font-bold'>L</span>
        </div>

        {/* Loading dots animation */}
        <div className='mt-6 flex space-x-2 justify-center'>
          <div className='w-3 h-3 bg-tertiary rounded-full animate-bounce' style={{ animationDelay: '0s' }}></div>
          <div className='w-3 h-3 bg-tertiary rounded-full animate-bounce' style={{ animationDelay: '0.2s' }}></div>
          <div className='w-3 h-3 bg-tertiary rounded-full animate-bounce' style={{ animationDelay: '0.4s' }}></div>
        </div>

        <p className='mt-4 text-gray-600'>Loading...</p>
      </div>
    </div>
  );
}

export default LoadingFallback;
