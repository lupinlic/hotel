import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
  otp?: string;
  otp_expires_at?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: 'admin' | 'customer';
  is_verified?: boolean;
}

// User hook
export const useMe = () => {
  return useQuery<User, Error>({
    queryKey: ['me'],
    queryFn: () => fetcher<User>('/me'),
  });
};