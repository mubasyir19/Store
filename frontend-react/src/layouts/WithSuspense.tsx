import type React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import { Suspense } from 'react';

interface WithSuspenseProps {
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

function WithSuspense({ children, loadingFallback }: WithSuspenseProps) {
  return (
    <div className=''>
      <ErrorBoundary>
        <Suspense fallback={loadingFallback || <div className='text-center p-4'>Loading...</div>}>{children}</Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default WithSuspense;
