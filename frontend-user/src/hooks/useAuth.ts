import { useMutation, useQuery } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';
import { setToken, removeToken, getToken } from '@/services/token';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) =>
      fetcher<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
};

export const useGetUser = () => {
  return useQuery<User, Error>({
    queryKey: ['user'],
    queryFn: () => fetcher<User>('/me'),
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: !!getToken(),
  });
};

export const useLogout = () => {
  return useMutation<{ message: string }, Error, void>({
    mutationFn: () => fetcher<{ message: string }>('/logout', { method: 'POST' }),
    onSuccess: () => {
      removeToken();
    },
  });
};
export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterInput>({
    mutationFn: (data) =>
      fetcher<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
}
export const useVerifyOtp = () => {
  return useMutation<{ message: string }, Error, { email: string; otp: string }>({
    mutationFn: (data) =>
      fetcher<{ message: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
};

export const useResendOtp = () => {
  return useMutation<{ message: string }, Error, { email: string }>({
    mutationFn: (data) =>
      fetcher<{ message: string }>('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
};