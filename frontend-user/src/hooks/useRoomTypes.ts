import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

export interface RoomType {
  id: number;
  name: string;
  description: string;
  price: number ;
  adult_capacity: number;
  child_capacity: number;
  image_url?: string;
  amenities?: Amenity[];
  bed_type?: string;
  bed_count?: number;
}

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface CreateRoomTypeInput {
  name: string;
  description: string;
  price_per_night: number;
  max_guests: number;
}

interface UpdateRoomTypeInput extends CreateRoomTypeInput {
  id: number;
}

// Public hooks
export const useRoomTypes = () => {
  return useQuery<RoomType[], Error>({
    queryKey: ['room-types'],
    queryFn: () => fetcher<RoomType[]>('/room-types'),
  });
};

export const useRoomType = (id: number) => {
  return useQuery<RoomType, Error>({
    queryKey: ['room-types', id],
    queryFn: () => fetcher<RoomType>(`/room-types/${id}`),
    enabled: !!id,
  });
};