import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface Room {
  id: number;
  room_number: string;
  room_type_id: number;
  status: 'available' | 'occupied' | 'maintenance';
  room_type?: RoomType;
}

interface RoomType {
  id: number;
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
}

interface CreateRoomInput {
  room_number: string;
  room_type_id: number;
  status?: 'available' | 'occupied' | 'maintenance';
}

interface UpdateRoomInput extends CreateRoomInput {
  id: number;
}

interface SearchParams {
  check_in?: string;
  check_out?: string;
  guests?: number;
  room_type_id?: number;
}

// Public hooks
export const useRooms = () => {
  return useQuery<Room[], Error>({
    queryKey: ['rooms'],
    queryFn: () => fetcher<Room[]>('/rooms'),
  });
};

export const useRoom = (id: number) => {
  return useQuery<Room, Error>({
    queryKey: ['rooms', id],
    queryFn: () => fetcher<Room>(`/rooms/${id}`),
    enabled: !!id,
  });
};

export const useSearchRooms = (params: SearchParams) => {
  return useQuery<Room[], Error>({
    queryKey: ['search', params],
    queryFn: () => {
      const queryString = new URLSearchParams(params as any).toString();
      return fetcher<Room[]>(`/search?${queryString}`);
    },
    enabled: Object.keys(params).length > 0,
  });
};

// Admin hooks
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation<Room, Error, CreateRoomInput>({
    mutationFn: (data) => fetcher<Room>('/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation<Room, Error, UpdateRoomInput>({
    mutationFn: ({ id, ...data }) => fetcher<Room>(`/admin/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => fetcher<void>(`/admin/rooms/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};