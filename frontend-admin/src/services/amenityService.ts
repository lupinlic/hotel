const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API ${path} error: ${res.status} ${errorText}`);
  }

  return res.json();
}

export type AmenityDto = {
  id: number;
  name: string;
  icon?: string | null;
  type?: string | null;
  created_at?: string;
  updated_at?: string;
};

export const getAmenities = async (): Promise<AmenityDto[]> => {
  return fetchApi<AmenityDto[]>('/amenities');
};

export const createAmenity = async (data: Partial<AmenityDto>): Promise<AmenityDto> => {
  return fetchApi<AmenityDto>('/admin/amenities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateAmenity = async (id: number, data: Partial<AmenityDto>): Promise<AmenityDto> => {
  return fetchApi<AmenityDto>(`/admin/amenities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteAmenity = async (id: number): Promise<{ message: string }> => {
  return fetchApi<{ message: string }>(`/admin/amenities/${id}`, {
    method: 'DELETE',
  });
};
