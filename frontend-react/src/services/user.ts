import { api } from '../lib/axios';
import type { LoginPayload, RegisterPayload } from '../types/user';

export const registerUser = async (payload: RegisterPayload) => {
  const res = await api.post('/auth/register', payload);
  return res.data;
};

export const loginUser = async (payload: LoginPayload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const profileUser = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};
