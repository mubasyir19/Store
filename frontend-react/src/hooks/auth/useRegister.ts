import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';
import { registerUser } from '../../services/user';
import type { ErrorResponse } from '../../types/error';
import { useNavigate } from 'react-router';

export function useRegister() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Register failed';
      toast.error(errorMessage);
      console.error('Register error:', error);
    },
  });
}
