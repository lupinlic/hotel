import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface CreateAmenityInput {
  name: string;
  icon: string;
}

interface UpdateAmenityInput extends CreateAmenityInput {
  id: number;
}

// Public hooks
export const useAmenities = () => {
  return useQuery<Amenity[], Error>({
    queryKey: ['amenities'],
    queryFn: () => fetcher<Amenity[]>('/amenities'),
  });
};

// Admin hooks
export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation<Amenity, Error, CreateAmenityInput>({
    mutationFn: (data) => fetcher<Amenity>('/admin/amenities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation<Amenity, Error, UpdateAmenityInput>({
    mutationFn: ({ id, ...data }) => fetcher<Amenity>(`/admin/amenities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => fetcher<void>(`/admin/amenities/${id}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
};