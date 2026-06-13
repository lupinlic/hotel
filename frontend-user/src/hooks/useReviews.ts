import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface Review {
  id: number;
  room_id: number;
  booking_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user: {
    name: string;
  };
  room: {
    id?: number;
    name?: string;
    room_type_id?: number;
  };
  booking: {
    id: number;
  };
}
interface CreateReviewInput {
  booking_id: number;
  rating: number;
  comment?: string;
}

// Public hooks
export const useReviews = (roomId?: number) => {
  return useQuery<Review[], Error>({
    queryKey: ['reviews', roomId],
    queryFn: () => fetcher<Review[]>('/reviews'),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation<Review, Error, CreateReviewInput>({
    mutationFn: (data) => fetcher<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

// User hooks
export const useMyReviews = (enabled: boolean = false) => {
  return useQuery<Review[], Error>({
    queryKey: ['my-reviews'],
    queryFn: () => fetcher<Review[]>('/my-reviews'),
    enabled,
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => fetcher<void>(`/reviews/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};