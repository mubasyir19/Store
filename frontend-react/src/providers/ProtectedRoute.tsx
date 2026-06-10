import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { profileUser } from '../services/user';
import { Navigate, Outlet } from 'react-router';

interface ProtectedRouteProps {
  allowedRoles?: Array<'Admin' | 'Customer'>;
  redirectTo?: string;
}

function ProtectedRoute({ allowedRoles = [], redirectTo = '/login' }: ProtectedRouteProps) {
  const { isAuthenticated, user, setAuth, clearAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await profileUser();
        if (response?.user) {
          setAuth(response.user, true);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, user, setAuth, clearAuth]);

  // Loading state
  if (isLoading || isChecking) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-gray-600'>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check if authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role if specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to='/' replace />; // Redirect to home if not authorized
  }

  return <Outlet />;
}

export default ProtectedRoute;
