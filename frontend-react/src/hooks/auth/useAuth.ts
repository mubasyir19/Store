import { useMutation } from '@tanstack/react-query';
import { logoutUser } from '../../services/user';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '../../types/error';

export const useLogout = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success('Logout successfully');
      navigate('/login');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Logout failed';
      toast.error(errorMessage);
      console.error('Logout error:', error);
    },
  });
};
