import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser, profileUser } from '../../services/user';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../../types/error';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';

export const useLogout = () => {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logout successfully');
      navigate('/login');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Logout failed';
      clearAuth();
      toast.error(errorMessage);
      console.error('Logout error:', error);
      navigate('/login');
    },
  });
};

export const useAuthCheck = () => {
  const { setAuth, clearAuth, setLoading, isLoading } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        const response = await profileUser();

        if (response.data?.user) {
          setAuth(response.data.user, true);
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setAuth, clearAuth, setLoading]);

  return { isLoading };
};
