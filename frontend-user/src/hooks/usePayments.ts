import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'bank_transfer' | 'paypal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
  booking?: Booking;
}

interface Booking {
  id: number;
  guest_name: string;
  total_price: number;
}

interface CreatePaymentInput {
  booking_id: number;
  amount: number;
  payment_method: 'cash' | 'credit_card' | 'bank_transfer' | 'paypal';
}

// User hooks
export const useCreatePayment = () => {
  return useMutation<Payment, Error, CreatePaymentInput>({
    mutationFn: (data) => fetcher<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
};

export const usePayment = (id: number) => {
  return useQuery<Payment, Error>({
    queryKey: ['payments', id],
    queryFn: () => fetcher<Payment>(`/payments/${id}`),
    enabled: !!id,
  });
};

