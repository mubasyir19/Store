import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { loginUser } from '../../services/user';
import type { ErrorResponse } from '../../types/error';
import { useAuthStore } from '../../stores/authStore';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      console.log('data login = ', response);
      const { accessToken, user } = response.data;

      console.log('AccessToken:', accessToken);
      console.log('User:', user);

      toast.success('Login successfully');
      setAuth(user, true);
      if (user.role === 'Customer') {
        navigate('/');
      } else if (user.role === 'Admin') {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      console.error('Login error:', error);
    },
  });
}
