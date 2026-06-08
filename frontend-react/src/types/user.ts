export interface User {
  email: string;
  id: string;
  name: string;
  role: 'Customer' | 'Admin';
}

export interface RegisterPayload {
  name: string;
  email: string;
  passwordHash: string;
  confirmPassword: string;
  role: 'Customer' | 'Admin';
}

export interface LoginPayload {
  email: string;
  passwordHash: string;
}
