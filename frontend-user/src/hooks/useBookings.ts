import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface Booking {
  id: number;
  user_id?: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  rooms?: Room[]; // backend returns rooms relation under booking.rooms
  booking_rooms?: BookingRoom[];
  payment?: Payment;
}

interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  paid_at?: string;
  created_at: string;
}

interface BookingRoom {
  id: number;
  booking_id: number;
  room_id: number;
  room?: Room;
}

interface Room {
  id: number;
  room_number: string;
  room_type_id?: number;
  room_type?: RoomType;
}

interface RoomType {
  id: number;
  name: string;
  price_per_night?: number;
  price?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateBookingInput {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  total_guests: number;
  room_type_id: number;
  total_price: number;
  special_requests?: string;
}

interface RevenueReport {
  total_revenue: number;
  monthly_revenue: { month: string; revenue: number }[];
}

interface OccupancyReport {
  total_rooms: number;
  occupied_rooms: number;
  occupancy_rate: number;
}

// Public hooks
export const useCreateBooking = () => {
  return useMutation<Booking, Error, CreateBookingInput>({
    mutationFn: (data) => fetcher<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  });
};

// User hooks
export const useMyBookings = (enabled: boolean = false) => {
  return useQuery<Booking[], Error>({
    queryKey: ['my-bookings'],
    queryFn: () => fetcher<Booking[]>('/my-bookings'),
    enabled,
  });
};

export const useBooking = (id: number) => {
  return useQuery<Booking, Error>({
    queryKey: ['bookings', id],
    queryFn: () => fetcher<Booking>(`/bookings/${id}`),
    enabled: !!id,
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => fetcher<void>(`/bookings/${id}/cancel`, {
      method: 'PUT',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
};

