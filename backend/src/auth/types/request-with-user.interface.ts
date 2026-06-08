import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: string;
    sub: string;
    name: string;
    email: string;
    role: 'Customer' | 'Admin';
    type?: 'access' | 'refresh';
  };
}
